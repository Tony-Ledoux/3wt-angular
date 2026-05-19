using System;
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

    // StorageLocations
    Task<IEnumerable<StorageLocation>> GetStoragelocationsOfHouseholdsAsync(int householdId);
    // ProductCategories
    Task<IEnumerable<ProductCategoryDto>> GetAllProductCategorieWithStorageRulessAsync();
    Task<ProductCategoryDto?> CreateNewProductCategoryAsync(CategoryCreationDto input);
    // StorageRules

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
    private readonly IStoragelocationRepository storagelocation = stg;
    private readonly IMapper<DeviceType, DeviceTypeDto> _deviceMapper = devmap;
    private readonly IProductCategoryRepository _catProdRepo = prodcatrepo;
    private readonly IMapper<ProductCategory, ProductCategoryDto> _Map_product = mapper_pc;

    public async Task<ProductCategoryDto?> CreateNewProductCategoryAsync(CategoryCreationDto input)
    {
        // TODO optimize this query so i get all requested devicetypes in one go
        var devices = await dev.GetAllAsync();

        var cat = new ProductCategory()
        {
            Category = input.CategorieName
        };
        await _catProdRepo.AddAsync(cat);
        foreach (var sr in input.StorageRules)
        {
            var device = devices.FirstOrDefault(x => x.Id == sr.DeviceType);
            if (device != null)
            {
                var Sr = new StorageRule()
                {
                    DeviceType = device,
                    Multiplier = sr.Multiplier,
                    ProductCategory = cat,
                };
                await storageRuleRepo.AddAsync(Sr);
                cat.StorageRules.Add(Sr);
            }
            ;
        }
        var success = await _catProdRepo.SaveChangesAsync();
        if (!success) return null;
        //ToDo map to dto
        return _Map_product.Map(cat);
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
