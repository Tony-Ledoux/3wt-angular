using System;
using backend.Entities;

using backend.Mappers;
using backend.Models;
using backend.Repository;

namespace backend.Services;

public interface IInventoryService
{
    // DeviceTypes
    Task<IEnumerable<DeviceTypeDto>> GetAllDeviceTypesAsync();

    // StorageLocations
    Task<IEnumerable<StorageLocation>> GetStoragelocationsOfHouseholdsAsync(int householdId);

    // StorageRules

    // Products

    // ProductCategories

    // Inventory

}

public class InventoryService(
    IGeneric<DeviceType> dev,
    IStoragelocationRepository stg,
    IMapper<DeviceType,DeviceTypeDto> devmap
    ) : IInventoryService
{
    private readonly IGeneric<DeviceType> devicetypeRepo = dev;
    private readonly IStoragelocationRepository storagelocation = stg;
    private readonly IMapper<DeviceType, DeviceTypeDto> _deviceMapper= devmap;

    public async Task<IEnumerable<DeviceTypeDto>> GetAllDeviceTypesAsync()
    {
        var devices = await devicetypeRepo.GetAllAsync();
        return _deviceMapper.MapList(devices);
    }

    public async Task<IEnumerable<StorageLocation>> GetStoragelocationsOfHouseholdsAsync(int householdId)
    {
        return await storagelocation.GetStorageLocationsByHouseholdIdAsync(householdId);
    }
}
