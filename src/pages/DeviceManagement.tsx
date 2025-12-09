import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, EditIcon, MoreHorizontalIcon } from 'lucide-react';
import { AddDeviceModal } from '../components/AddDeviceModal';

interface DeviceManagementProps {
  zones: any[];
  setZones: (zones: any[]) => void;
}

export function DeviceManagement({ zones, setZones }: DeviceManagementProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any>(null);
  const [editingZoneId, setEditingZoneId] = useState<number | null>(null);
  const [editingDeviceName, setEditingDeviceName] = useState('');
  const [showEditInput, setShowEditInput] = useState(false);

  const handleAddDevice = (deviceData: any) => {
    const zoneToUpdate = deviceData.zone || deviceData.newZone;
    
    setZones(zones.map(zone => {
      if (zone.name === zoneToUpdate) {
        const newDevice = {
          id: Math.max(...zone.devices.map(d => d.id), 0) + 1,
          name: deviceData.deviceName,
          type: deviceData.deviceType,
          sockets: deviceData.sockets || 0,
          minVoltage: deviceData.minVoltage,
          maxVoltage: deviceData.maxVoltage,
          power: deviceData.power
        };
        return {
          ...zone,
          devices: [...zone.devices, newDevice]
        };
      }
      return zone;
    }).concat(
      // If creating a new zone
      !zones.find(z => z.name === zoneToUpdate) && deviceData.newZone ? [{
        id: Math.max(...zones.map(z => z.id), 0) + 1,
        name: deviceData.newZone,
        devices: [{
          id: 1,
          name: deviceData.deviceName,
          type: deviceData.deviceType,
          sockets: deviceData.sockets || 0,
          minVoltage: deviceData.minVoltage,
          maxVoltage: deviceData.maxVoltage,
          power: deviceData.power
        }]
      }] : []
    ));
  };

  const handleDeleteDevice = (zoneId: number, deviceId: number) => {
    setZones(zones.map(zone => {
      if (zone.id === zoneId) {
        return {
          ...zone,
          devices: zone.devices.filter((d: any) => d.id !== deviceId)
        };
      }
      return zone;
    }));
  };

  const handleEditDeviceName = (zoneId: number, deviceId: number, newName: string) => {
    if (newName.trim()) {
      setZones(zones.map(zone => {
        if (zone.id === zoneId) {
          return {
            ...zone,
            devices: zone.devices.map((d: any) =>
              d.id === deviceId ? { ...d, name: newName } : d
            )
          };
        }
        return zone;
      }));
    }
    setShowEditInput(false);
    setEditingDevice(null);
  };

  const startEditingDeviceName = (device: any, zoneId: number) => {
    setEditingDevice({ id: device.id, zoneId });
    setEditingDeviceName(device.name);
    setShowEditInput(true);
  };
  return <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Device Management
          </h1>
          <p className="text-gray-600 mt-1">Manage zones and devices</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Add Device
        </button>
      </div>
      <div className="space-y-6">
        {zones.map(zone => <div key={zone.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{zone.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {zone.devices.length} devices
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zone.devices.map(device => (
                  <div key={device.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex flex-col h-full">
                    {editingDevice?.id === device.id && showEditInput ? (
                      <div className="mb-3 flex gap-2">
                        <input
                          type="text"
                          value={editingDeviceName}
                          onChange={(e) => setEditingDeviceName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditDeviceName(zone.id, device.id, editingDeviceName);
                            }
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditDeviceName(zone.id, device.id, editingDeviceName)}
                          className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {device.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {device.type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditingDeviceName(device, zone.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit device name"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDevice(zone.id, device.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete device"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 text-sm mb-4 flex-1">
                      {device.type === 'outlet' && <div className="flex justify-between">
                          <span className="text-gray-600">Sockets:</span>
                          <span className="font-medium text-gray-900">
                            {device.sockets}
                          </span>
                        </div>}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Voltage:</span>
                        <span className="font-medium text-gray-900">
                          {device.minVoltage && device.maxVoltage ? `${device.minVoltage}V - ${device.maxVoltage}V` : `${device.voltage}V`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Power:</span>
                        <span className="font-medium text-gray-900">
                          {device.power}kW
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/device-details/${zone.id}/${device.id}`)}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-auto"
                    >
                      <MoreHorizontalIcon className="w-4 h-4" />
                      More Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>)}
      </div>
      <AddDeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddDevice} existingZones={zones.map(z => z.name)} />
    </div>;
}