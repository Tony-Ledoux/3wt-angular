
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
    IMapper<ProductCategory, ProductCategoryDto> mapper_pc
    ) : IInventoryService
{
    private readonly IGeneric<DeviceType> devicetypeRepo = dev;
    private readonly IGeneric<StorageRule> storageRuleRepo = srr;
    private readonly IProductCategoryRepository _catProdRepo = prodcatrepo;
    private readonly IStoragelocationRepository storagelocation = stg;
    private readonly IMapper<DeviceType, DeviceTypeDto> _deviceMapper = devmap;
    private readonly IMapper<ProductCategory, ProductCategoryDto> _Map_product = mapper_pc;

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
}
