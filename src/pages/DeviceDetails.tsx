import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DeviceDetailsProps {
  zones: any[];
}

const mockVoltageVsPowerData = [
  { voltage: 200, power: 8.5 },
  { voltage: 210, power: 10.2 },
  { voltage: 220, power: 12.1 },
  { voltage: 230, power: 15.2 },
  { voltage: 240, power: 18.5 },
];

const mockUsageHistory = [
  { timestamp: '2025-01-01 08:00', kwh: 0.5 },
  { timestamp: '2025-01-01 09:00', kwh: 1.2 },
  { timestamp: '2025-01-01 10:00', kwh: 1.8 },
  { timestamp: '2025-01-01 11:00', kwh: 2.3 },
  { timestamp: '2025-01-01 12:00', kwh: 2.1 },
  { timestamp: '2025-01-01 13:00', kwh: 1.9 },
  { timestamp: '2025-01-01 14:00', kwh: 2.5 },
  { timestamp: '2025-01-01 15:00', kwh: 3.1 },
];

export function DeviceDetails({ zones }: DeviceDetailsProps) {
  const { zoneId, deviceId } = useParams();
  const navigate = useNavigate();

  const zone = zones.find(z => z.id === Number(zoneId));
  const device = zone?.devices.find((d: any) => d.id === Number(deviceId));

  if (!device || !zone) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Device Not Found</h2>
          <button
            onClick={() => navigate('/device-management')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Device Management
          </button>
        </div>
      </div>
    );
  }

  const downloadCSV = () => {
    const csvContent = [
      ['Timestamp', 'kWh Usage'],
      ...mockUsageHistory.map(h => [h.timestamp, h.kwh.toString()])
    ].map(row => row.join(',')).join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `${device.name}_history.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/device-management')}
        className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{device.name}</h1>
        <p className="text-gray-600 mt-1">{zone.name} Zone</p>
      </div>

      {/* Device Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Device Type</p>
          <p className="text-2xl font-bold text-gray-900 capitalize">{device.type}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Current Power</p>
          <p className="text-2xl font-bold text-gray-900">{device.power} kW</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Voltage Range</p>
          <p className="text-2xl font-bold text-gray-900">
            {device.minVoltage || device.voltage}V - {device.maxVoltage || device.voltage}V
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Daily Usage</p>
          <p className="text-2xl font-bold text-gray-900">
            {mockUsageHistory.reduce((sum, h) => sum + h.kwh, 0).toFixed(1)} kWh
          </p>
        </div>
      </div>

      {/* Voltage vs Power Graph */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Voltage vs Power Relationship</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockVoltageVsPowerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="voltage" stroke="#6b7280" label={{ value: 'Voltage (V)', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#6b7280" label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={2} name="Power (kW)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Usage History */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Usage History (Last 8 hours)</h2>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Timestamp</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">kWh Usage</th>
              </tr>
            </thead>
            <tbody>
              {mockUsageHistory.map((record, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">{record.timestamp}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{record.kwh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
