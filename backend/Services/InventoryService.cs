
using System.Collections.ObjectModel;
using backend.Contexts;
using backend.Entities;

using backend.Mappers;
using backend.Models;
using backend.Models.Create;
using backend.Models.Update;
using backend.Repository;
using Microsoft.EntityFrameworkCore;




namespace backend.Services;

public interface IInventoryService
{
    // DeviceTypes
    Task<IEnumerable<DeviceTypeDto>> GetAllDeviceTypesAsync();

    // ProductCategories and storageRules
    Task<IEnumerable<ProductCategoryDto>> GetAllProductCategorieWithStorageRulessAsync();
    Task<RequestResponse<ProductCategoryDto>> CreateNewProductCategoryAsync(CategoryCreationDto input);
    Task<RequestResponse<bool>> DeleteCategoryWithRules(int id);
    Task<RequestResponse<bool>> DeleteStorageRuleAsync(int id);
    Task<RequestResponse<StorageRuleDto>> CreateNewStorageRuleinCategoryIdAsync(int categotyId, StorageRuleCreationDto input);
    // StorageLocations
    Task<IEnumerable<StoragelocationDto>> GetStoragelocationsOfHouseholdsAsync(int householdId);
    Task<StoragelocationDto?> CreateStorageLocationForHousehold(int id, StorageLocationCreateDto input);
    Task<bool> DeleteStorageLocationForHousehold(int id);
    // Products
    Task<PagedResult<ProductDto>> GetPagedProductsAsync(int page, int pageSize, bool? isGlobal, int? categoryId);
    Task<IEnumerable<ProductDto>> GetAllProductsForHouseholdId(int householdId);
    Task<Product?> CreateNewProductAsync(ProductCreationDto input);
    Task<bool> AddCategoryToProduct(int pid, int cid, bool isAdmin);
    Task<bool> RemoveCategoryFromProductAsync(int pid, int cid, bool isAdmin);
    Task<bool> RemoveProduct(int pid, bool isAdmin);
    Task<RequestResponse<ProductDto>> UpdateProductAsync(int pid, bool isAdmin, ProductUpdateDto product);
    // Inventory

}

public class InventoryService(
    KitchenDbContext dbcontext,
    IGeneric<DeviceType> dev,
    IProductCategoryRepository prodcatrepo,
    IProductRespository product_repo,
    IStoragelocationRepository stg,
    IMapper<DeviceType, DeviceTypeDto> devmap,
    IGeneric<StorageRule> srr,
    IMapper<ProductCategory, ProductCategoryDto> mapper_pc,
    IMapper<StorageRule, StorageRuleDto> mapper_storageRule,
    IHouseholdRepository householdRepo
    ) : IInventoryService
{
    private readonly KitchenDbContext _dbContext = dbcontext;
    private readonly IHouseholdRepository _hh_repo = householdRepo;
    private readonly IGeneric<DeviceType> devicetypeRepo = dev;
    private readonly IGeneric<StorageRule> storageRuleRepo = srr;
    private readonly IProductCategoryRepository _catProdRepo = prodcatrepo;
    private readonly IProductRespository _prodRepo = product_repo;
    private readonly IStoragelocationRepository _storagelocationRepo = stg;
    private readonly IMapper<DeviceType, DeviceTypeDto> _deviceMapper = devmap;
    private readonly IMapper<ProductCategory, ProductCategoryDto> _Map_product = mapper_pc;
    private readonly IMapper<StorageRule, StorageRuleDto> _map_storageRule = mapper_storageRule;
    public async Task<RequestResponse<ProductCategoryDto>> CreateNewProductCategoryAsync(CategoryCreationDto input)
    {
        var exists = await _catProdRepo.ProductCategoryExistsAsync(input.CategorieName);
        if (exists) return new RequestResponse<ProductCategoryDto>().Failure("Deze categorie bestaat al").SetIsConflict();

        var devices = await devicetypeRepo.GetAllAsync(); // lookup voor diepvries, ijskast, kast
        // 1. Create a new ProductCategorie Instance and track it
        var cat = _catProdRepo.GetNewEmptyInstance();
        cat.Category = input.CategorieName;
        await _catProdRepo.AddAsync(cat);
        // 2. Loop over storageRules in input
        foreach (var sr in input.StorageRules)
        {
            var device = devices.FirstOrDefault(x => x.Id == sr.DeviceType); //get the devicetype from memory (devices)
            if (device != null)
            {
                var x = storageRuleRepo.GetNewEmptyInstance();
                x.DeviceType = device;
                x.Multiplier = sr.Multiplier;
                x.ProductCategory = cat;
                cat.StorageRules.Add(x); // AutoTracks because cat is tracked
            }
            ;
        }
        // 3. Save categorie and rules
        var success = await _catProdRepo.SaveChangesAsync();
        if (!success) return new RequestResponse<ProductCategoryDto>().Failure("Er is iets misgelopen bij het opslaan");
        return new RequestResponse<ProductCategoryDto>().Ok(_Map_product.Map(cat));
    }

    public async Task<IEnumerable<DeviceTypeDto>> GetAllDeviceTypesAsync()
    {
        var devices = await devicetypeRepo.GetAllAsync();
        return _deviceMapper.MapList(devices);
    }

    public async Task<IEnumerable<ProductCategoryDto>> GetAllProductCategorieWithStorageRulessAsync()
    {
        var data = await _catProdRepo.GetAllWithStorageRulesAsync();
        return _Map_product.MapList(data);
    }

    public async Task<IEnumerable<StoragelocationDto>> GetStoragelocationsOfHouseholdsAsync(int householdId)
    {

        var locations = await _storagelocationRepo.GetStorageLocationsByHouseholdIdAsync(householdId);
        return locations.Select(x => new StoragelocationDto
        {
            Id = x.Id,
            Name = x.Name,
            DeviceTypeId = x.DeviceTypeId,
            DeviceType = x.DeviceType.Type,
            NumberOfItemsInInventory = x.InventoryItems.Count
        });

    }

    public async Task<RequestResponse<bool>> DeleteCategoryWithRules(int id)
    {
        // 1. get the category with rules
        var cat = await _catProdRepo.GetProductCategoryWithRulesByIdAsync(id);
        if (cat == null) return new RequestResponse<bool>().SetIsNotFound().Failure("categorie niet gevonden");
        // 2. delete each rule
        foreach (var rule in cat.StorageRules)
        {
            storageRuleRepo.Delete(rule);
        }
        // 3. delete the category
        _catProdRepo.Delete(cat);
        var success = await _catProdRepo.SaveChangesAsync();
        if (success) return new RequestResponse<bool>().Ok(true);
        return new RequestResponse<bool>().Failure("er liep iets fout");
    }

    public async Task<RequestResponse<bool>> DeleteStorageRuleAsync(int id)
    {
        //1. get the storageRule
        var rule = await storageRuleRepo.GetByIdAsync(id);
        if (rule == null) return new RequestResponse<bool>().SetIsNotFound().Failure("regel niet gevonden");
        //2. delete the storageRule
        storageRuleRepo.Delete(rule);
        var result = await storageRuleRepo.SaveChangesAsync();
        if (!result) return new RequestResponse<bool>().Failure("er gebeurde een fout");
        return new RequestResponse<bool>().Ok(true);
    }

    public async Task<RequestResponse<StorageRuleDto>> CreateNewStorageRuleinCategoryIdAsync(int categotyId, StorageRuleCreationDto input)
    {
        //1.get the category
        var cat = await _catProdRepo.GetProductCategoryWithRulesByIdAsync(categotyId);
        if (cat == null) return new RequestResponse<StorageRuleDto>().SetIsNotFound().Failure("categorie niet gevonden");
        //2. check if deviceType already exists within cat.storageRules.deviceTypeId
        if (cat.StorageRules.Any(x => x.DeviceTypeId == input.DeviceType)) return new RequestResponse<StorageRuleDto>().SetIsConflict().Failure("Regel bestaat al");
        //get the device navigation property
        var dev = await devicetypeRepo.GetByIdAsync(input.DeviceType);
        if (dev == null) return new RequestResponse<StorageRuleDto>().Failure("Type niet gevonden");
        //create the new rule
        var rule = storageRuleRepo.GetNewEmptyInstance();
        rule.DeviceTypeId = input.DeviceType;
        rule.ProductCategoryId = categotyId;
        rule.Multiplier = input.Multiplier;
        await storageRuleRepo.AddAsync(rule);
        rule.DeviceType = dev;
        var success = await storageRuleRepo.SaveChangesAsync();
        if (!success) return new RequestResponse<StorageRuleDto>().Failure("niet opgeslagen");
        return new RequestResponse<StorageRuleDto>().Ok(_map_storageRule.Map(rule));
    }
    // products
    public async Task<PagedResult<ProductDto>> GetPagedProductsAsync(int page, int pageSize, bool? isGlobal, int? categoryId)
    {
        var (products, totalCount) = await _prodRepo.GetPagedProducsAsync(page, pageSize, isGlobal, categoryId);
        var dtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            ProductName = p.ProductName,
            DefaultUnit = p.DefaultUnit,
            ShelfLifeClosedMinutes = p.ShelfLifeClosedMinutes,
            ShelfLifeOpenedMinutes = p.ShelfLifeOpenedMinutes,
            IsGlobal = p.IsGlobal,
            HouseholdId = p.HouseholdId,
            CategoryIds = [.. p.ProductCategories.Select(c => c.Id)]
        });
        return new PagedResult<ProductDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        };
    }

    public async Task<Product?> CreateNewProductAsync(ProductCreationDto input)
    {
        //1. get categories from the id's in input.CategoryIds
        Collection<ProductCategory> categories = [];
        foreach (var item in input.CategoryIds)
        {
            var cat = await _catProdRepo.GetByIdAsync(item);
            if (cat != null)
            {
                categories.Add(cat);
            }
        }
        Household? household = null;
        if (input.HouseholdId != null)
        {
            var h = await _hh_repo.GetByIdAsync(input.HouseholdId ?? 0);
            if (h != null)
            {
                household = h;
            }
        }
        //2. create a new product
        Product prod = new()
        {
            ProductName = input.ProductName,
            DefaultUnit = input.DefaultUnit,
            ShelfLifeClosedMinutes = input.ShelfLifeClosedMinutes,
            ShelfLifeOpenedMinutes = input.ShelfLifeOpenedMinutes,
            IsGlobal = input.IsGlobal,
            HouseholdId = input.HouseholdId,
            Household = household,
            ProductCategories = categories
        };
        //3. store the product in the database
        await _prodRepo.AddAsync(prod);
        var result = await _prodRepo.SaveChangesAsync();
        if (result) return prod;
        return null;

    }

    public async Task<bool> RemoveCategoryFromProductAsync(int pid, int cid, bool isAdmin)
    {
        // 1. get the product
        var prod = await _prodRepo.GetProductWithCategoriesByIdAsync(pid);
        if (prod == null) return false;
        if (!prod.ProductCategories.Any(pc => pc.Id == cid)) return false;
        if (prod.IsGlobal && !isAdmin) return false;
        //2. get the record in the mappingTable
        var record = await _dbContext.ProductCategoryMappings.FirstOrDefaultAsync(pcm => pcm.ProductCategoryId == cid && pcm.ProductId == pid);
        if (record == null) return false;
        _dbContext.Remove(record);
        return await _dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> RemoveProduct(int pid, bool isAdmin)
    {
        //1. get the product
        var prod = await _prodRepo.GetByIdAsync(pid);
        if (prod == null) return false;
        if (prod.IsGlobal && !isAdmin) return false;
        _prodRepo.Delete(prod);
        return await _prodRepo.SaveChangesAsync();
    }

    public async Task<bool> AddCategoryToProduct(int pid, int cid, bool isAdmin)
    {
        //1. get the product
        var prod = await _prodRepo.GetProductWithCategoriesByIdAsync(pid);
        var cat = await _catProdRepo.GetByIdAsync(cid);
        if (cat == null || prod == null || prod.IsGlobal && !isAdmin || prod.ProductCategories.Any(x => x.Id == cid)) return false;
        prod.ProductCategories.Add(cat);
        return await _prodRepo.SaveChangesAsync();
    }

    public async Task<RequestResponse<ProductDto>> UpdateProductAsync(int pid, bool isAdmin, ProductUpdateDto input)
    {
        var product = await _prodRepo.GetProductWithCategoriesByIdAsync(pid);
        if (product == null) return new RequestResponse<ProductDto>().Failure("Niet gevonden").SetIsNotFound();
        if (isAdmin)
        {
            input.HouseholdId = null;
        }
        // cleanup input
        var DefaultUnit =
        product.ProductName = input.ProductName;
        product.DefaultUnit = string.IsNullOrEmpty(input.DefaultUnit) ? null : input.DefaultUnit;
        product.ShelfLifeClosedMinutes = input.ShelfLifeClosedMinutes;
        product.ShelfLifeOpenedMinutes = input.ShelfLifeOpenedMinutes;
        product.IsGlobal = isAdmin;
        product.HouseholdId = input.HouseholdId;

        var success = await _prodRepo.SaveChangesAsync();
        if (!success) return new RequestResponse<ProductDto>().Failure("Error saving data");
        ProductDto returnable = new()
        {
            ProductName = product.ProductName,
            DefaultUnit = product.DefaultUnit,
            ShelfLifeClosedMinutes = product.ShelfLifeClosedMinutes,
            ShelfLifeOpenedMinutes = product.ShelfLifeOpenedMinutes,
            IsGlobal = product.IsGlobal,
            HouseholdId = product.HouseholdId,
            CategoryIds = [.. product.ProductCategories.Select(c => c.Id)]

        };
        return new RequestResponse<ProductDto>().Ok(returnable);

    }

    /// <summary>
    /// Get all products for a household,
    /// these include the global ones and the ones corresponding to the household id
    /// </summary>
    /// <param name="householdId">integer</param>
    /// <returns>A list of productDto</returns>
    public async Task<IEnumerable<ProductDto>> GetAllProductsForHouseholdId(int householdId)
    {

        var result = await _prodRepo.GetProductsWithCategoriesByHouseholdId(householdId);
        var dtos = result.Select(p => new ProductDto
        {
            Id = p.Id,
            ProductName = p.ProductName,
            DefaultUnit = p.DefaultUnit,
            ShelfLifeClosedMinutes = p.ShelfLifeClosedMinutes,
            ShelfLifeOpenedMinutes = p.ShelfLifeOpenedMinutes,
            IsGlobal = p.IsGlobal,
            HouseholdId = p.HouseholdId,
            CategoryIds = [.. p.ProductCategories.Select(c => c.Id)]
        }
            );
        return dtos;
    }

    public async Task<StoragelocationDto?> CreateStorageLocationForHousehold(int id, StorageLocationCreateDto input)
    {
        var _household = await _hh_repo.GetByIdAsync(id);
        if (_household == null) return null;
        if (await _storagelocationRepo.DoesStorageLocationExists(id, input.Naam)) return null;
        var device = await devicetypeRepo.GetByIdAsync(input.DeviceType);
        if (device == null) return null;
        StorageLocation sd = new()
        {
            Name = input.Naam,
            HouseholdId = id,
            DeviceType = device,
            
        };
        await _storagelocationRepo.AddAsync(sd);
        var saveSuccessfull = await _storagelocationRepo.SaveChangesAsync();
        if (!saveSuccessfull) return null;

        return new StoragelocationDto
        {
            Id = sd.Id,
            Name = sd.Name,
            DeviceTypeId = sd.DeviceTypeId,
            DeviceType = sd.DeviceType.Type,
            NumberOfItemsInInventory = 0
        };

    }

    public async Task<bool> DeleteStorageLocationForHousehold(int id)
    {
        var sl = await _storagelocationRepo.GetByIdAsync(id);
        if(sl == null) return false;
        _storagelocationRepo.Delete(sl);
        return await _storagelocationRepo.SaveChangesAsync();
        
    }
}
