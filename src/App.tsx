import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DeviceManagement } from './pages/DeviceManagement';
import { DeviceDetails } from './pages/DeviceDetails';
import { Priorities } from './pages/Priorities';
import { Scheduling } from './pages/Scheduling';
import { History } from './pages/History';
export function App() {
  const [zones, setZones] = useState([{
    id: 1,
    name: 'Industrial',
    devices: [{
      id: 1,
      name: 'Main Conveyor',
      type: 'switch',
      sockets: 0,
      minVoltage: 200,
      maxVoltage: 240,
      power: 15.2
    }, {
      id: 2,
      name: 'Packaging Unit',
      type: 'outlet',
      sockets: 4,
      minVoltage: 200,
      maxVoltage: 240,
      power: 8.5
    }]
  }, {
    id: 2,
    name: 'Workshop 1',
    devices: [{
      id: 3,
      name: 'CNC Machine',
      type: 'switch',
      sockets: 0,
      minVoltage: 200,
      maxVoltage: 240,
      power: 22.3
    }]
  }, {
    id: 3,
    name: 'Office',
    devices: [{
      id: 4,
      name: 'Server Room',
      type: 'switch',
      sockets: 0,
      minVoltage: 200,
      maxVoltage: 240,
      power: 12.5
    }, {
      id: 5,
      name: 'Workstation Cluster',
      type: 'outlet',
      sockets: 6,
      minVoltage: 200,
      maxVoltage: 240,
      power: 5.3
    }]
  }]);

  return <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard zones={zones} />} />
            <Route path="/device-management" element={<DeviceManagement zones={zones} setZones={setZones} />} />
            <Route path="/device-details/:zoneId/:deviceId" element={<DeviceDetails zones={zones} />} />
            <Route path="/priorities" element={<Priorities zones={zones} />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>;
}