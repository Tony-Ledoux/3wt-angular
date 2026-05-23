
using System.Diagnostics;
using backend.Entities;

using backend.Mappers;
using backend.Models;
using backend.Models.Create;
using backend.Repository;


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
    Task<IEnumerable<StorageLocation>> GetStoragelocationsOfHouseholdsAsync(int householdId);
    // Products


    // Inventory

}

public class InventoryService(
    IGeneric<DeviceType> dev,
    IProductCategoryRepository prodcatrepo,
    IStoragelocationRepository stg,
    IMapper<DeviceType, DeviceTypeDto> devmap,
    IGeneric<StorageRule> srr,
    IMapper<ProductCategory, ProductCategoryDto> mapper_pc,
    IMapper<StorageRule,StorageRuleDto> mapper_storageRule
    ) : IInventoryService
{
    private readonly IGeneric<DeviceType> devicetypeRepo = dev;
    private readonly IGeneric<StorageRule> storageRuleRepo = srr;
    private readonly IProductCategoryRepository _catProdRepo = prodcatrepo;
    private readonly IStoragelocationRepository storagelocation = stg;
    private readonly IMapper<DeviceType, DeviceTypeDto> _deviceMapper = devmap;
    private readonly IMapper<ProductCategory, ProductCategoryDto> _Map_product = mapper_pc;
    private readonly IMapper<StorageRule,StorageRuleDto> _map_storageRule = mapper_storageRule;
    public async Task<RequestResponse<ProductCategoryDto>> CreateNewProductCategoryAsync(CategoryCreationDto input)
    {
        var exists = await _catProdRepo.ProductCategoryExistsAsync(input.CategorieName);
        if(exists) return new RequestResponse<ProductCategoryDto>().Failure("Deze categorie bestaat al").SetIsConflict();

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
            };
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

    public async Task<IEnumerable<StorageLocation>> GetStoragelocationsOfHouseholdsAsync(int householdId)
    {
        return await storagelocation.GetStorageLocationsByHouseholdIdAsync(householdId);
    }

    public async Task<RequestResponse<bool>> DeleteCategoryWithRules(int id)
    {
        // 1. get the category with rules
        var cat = await _catProdRepo.GetProductCategoryWithRulesByIdAsync(id);
        if(cat == null) return new RequestResponse<bool>().SetIsNotFound().Failure("categorie niet gevonden");
        // 2. delete each rule
        foreach (var rule in cat.StorageRules)
        {
            storageRuleRepo.Delete(rule);
        }
        // 3. delete the category
        _catProdRepo.Delete(cat);
        var success = await _catProdRepo.SaveChangesAsync();
        if(success) return new RequestResponse<bool>().Ok(true);
        return new RequestResponse<bool>().Failure("er liep iets fout");
    }

    public async Task<RequestResponse<bool>> DeleteStorageRuleAsync(int id)
    {
        //1. get the storageRule
        var rule = await storageRuleRepo.GetByIdAsync(id);
        if(rule == null) return new RequestResponse<bool>().SetIsNotFound().Failure("regel niet gevonden");
        //2. delete the storageRule
        storageRuleRepo.Delete(rule);
        var result = await storageRuleRepo.SaveChangesAsync();
        if(!result) return new RequestResponse<bool>().Failure("er gebeurde een fout");
        return new RequestResponse<bool>().Ok(true);
    }

    public async Task<RequestResponse<StorageRuleDto>> CreateNewStorageRuleinCategoryIdAsync(int categotyId, StorageRuleCreationDto input)
    {
        //1.get the category
        var cat = await _catProdRepo.GetProductCategoryWithRulesByIdAsync(categotyId);
        if(cat == null) return new RequestResponse<StorageRuleDto>().SetIsNotFound().Failure("categorie niet gevonden");
        //2. check if deviceType already exists within cat.storageRules.deviceTypeId
        if(cat.StorageRules.Any(x=>x.DeviceTypeId == input.DeviceType)) return new RequestResponse<StorageRuleDto>().SetIsConflict().Failure("Regel bestaat al");
        //get the device navigation property
        var dev = await devicetypeRepo.GetByIdAsync(input.DeviceType);
        if(dev == null) return new RequestResponse<StorageRuleDto>().Failure("Type niet gevonden");
        //create the new rule
        var rule = storageRuleRepo.GetNewEmptyInstance();
        rule.DeviceTypeId = input.DeviceType;
        rule.ProductCategoryId = categotyId;
        rule.Multiplier = input.Multiplier;
        await storageRuleRepo.AddAsync(rule);
        rule.DeviceType = dev;
        var success = await storageRuleRepo.SaveChangesAsync();
        if(!success) return new RequestResponse<StorageRuleDto>().Failure("niet opgeslagen");
        return new RequestResponse<StorageRuleDto>().Ok(_map_storageRule.Map(rule));
    }
}
