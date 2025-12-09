import React, { useState } from 'react';
import { AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface PrioritiesProps {
  zones: any[];
}

export function Priorities({ zones }: PrioritiesProps) {
  // Track zone order - array of zone IDs in priority order
  const [zoneOrder, setZoneOrder] = useState<number[]>(zones.map(z => z.id));
  
  // Track device order per zone - map of zoneId to array of device IDs in priority order
  const [deviceOrder, setDeviceOrder] = useState<{ [key: number]: number[] }>(
    zones.reduce((acc, zone) => {
      acc[zone.id] = zone.devices.map(d => d.id);
      return acc;
    }, {} as any)
  );

  const [expandedZones, setExpandedZones] = useState<Set<number>>(new Set(zones.map(z => z.id)));

  const toggleZoneExpanded = (zoneId: number) => {
    const newExpanded = new Set(expandedZones);
    if (newExpanded.has(zoneId)) {
      newExpanded.delete(zoneId);
    } else {
      newExpanded.add(zoneId);
    }
    setExpandedZones(newExpanded);
  };

  const moveZonePriority = (zoneId: number, direction: 'up' | 'down') => {
    const currentIndex = zoneOrder.indexOf(zoneId);
    if (direction === 'up' && currentIndex > 0) {
      const newOrder = [...zoneOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      setZoneOrder(newOrder);
    } else if (direction === 'down' && currentIndex < zoneOrder.length - 1) {
      const newOrder = [...zoneOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setZoneOrder(newOrder);
    }
  };

  const moveDevicePriority = (zoneId: number, deviceId: number, direction: 'up' | 'down') => {
    const devices = deviceOrder[zoneId] || [];
    const currentIndex = devices.indexOf(deviceId);
    
    if (direction === 'up' && currentIndex > 0) {
      const newDeviceOrder = [...devices];
      [newDeviceOrder[currentIndex], newDeviceOrder[currentIndex - 1]] = [newDeviceOrder[currentIndex - 1], newDeviceOrder[currentIndex]];
      setDeviceOrder({ ...deviceOrder, [zoneId]: newDeviceOrder });
    } else if (direction === 'down' && currentIndex < devices.length - 1) {
      const newDeviceOrder = [...devices];
      [newDeviceOrder[currentIndex], newDeviceOrder[currentIndex + 1]] = [newDeviceOrder[currentIndex + 1], newDeviceOrder[currentIndex]];
      setDeviceOrder({ ...deviceOrder, [zoneId]: newDeviceOrder });
    }
  };

  // Get zone objects sorted by priority order
  const sortedZones = zoneOrder.map(zoneId => zones.find(z => z.id === zoneId)).filter(Boolean) as any[];
  return <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Priority Management
        </h1>
        <p className="text-gray-600 mt-1">
          Set zone priorities for automatic power management
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
        <AlertTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">How Priority Works</p>
          <p>
            During power overload, zones with lower priority will be
            automatically shut down first. The highest priority zone (Priority
            1) will remain active until power consumption returns to safe
            levels.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Zone Priorities</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag to reorder priorities (1 = highest)
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {sortedZones.map((zone, displayIndex) => (
              <div key={zone.id}>
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveZonePriority(zone.id, 'up')}
                      disabled={displayIndex === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronUpIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveZonePriority(zone.id, 'down')}
                      disabled={displayIndex === sortedZones.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <span className="text-xl font-bold text-blue-600">
                      {displayIndex + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                    <p className="text-sm text-gray-600">
                      {zone.devices.length} devices
                    </p>
                  </div>
                  <button
                    onClick={() => toggleZoneExpanded(zone.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedZones.has(zone.id) ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                  </button>
                </div>

                {expandedZones.has(zone.id) && (
                  <div className="ml-8 mt-3 space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Device Priorities (1st device off last)</p>
                    {(() => {
                      const deviceIds = deviceOrder[zone.id] || zone.devices.map(d => d.id);
                      return deviceIds.map((deviceId, deviceIndex) => {
                        const device = zone.devices.find((d: any) => d.id === deviceId);
                        if (!device) return null;
                        
                        return (
                          <div key={device.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveDevicePriority(zone.id, device.id, 'up')}
                                disabled={deviceIndex === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronUpIcon className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => moveDevicePriority(zone.id, device.id, 'down')}
                                disabled={deviceIndex === (deviceOrder[zone.id]?.length || zone.devices.length) - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronDownIcon className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded text-sm font-semibold text-green-600">
                              {deviceIndex + 1}
                            </div>
                            <span className="flex-1 text-sm text-gray-700">{device.name}</span>
                            <span className="text-xs text-gray-500">{device.power}kW</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Power Overload Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safe Power Limit (kW)
            </label>
            <input type="number" defaultValue={100} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warning Threshold (%)
            </label>
            <input type="number" defaultValue={85} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>;
}