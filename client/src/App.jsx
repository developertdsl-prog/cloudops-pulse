import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ClusterHealthOverview from './components/ClusterHealthOverview';
import ServiceMeshGrid from './components/ServiceMeshGrid';
import IncidentManagementTable from './components/IncidentManagementTable';
import SloErrorBudgetCard from './components/SloErrorBudgetCard';
import TriggerIncidentModal from './components/TriggerIncidentModal';
import AlertRulesView from './components/AlertRulesView';
import TelemetryStreamChart from './components/TelemetryStreamChart';
import { api } from './services/api';
import './styles/main.css';
import './styles/responsive.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [sloData, setSloData] = useState([]);
  const [alertRules, setAlertRules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [sumRes, sRes, iRes, sloRes, aRes] = await Promise.all([
      api.getMetricsSummary(),
      api.getServices(),
      api.getIncidents(),
      api.getSloSummary(),
      api.getAlertRules()
    ]);

    if (sumRes.success) setSummary(sumRes.data);
    if (sRes.success) setServices(sRes.data);
    if (iRes.success) setIncidents(iRes.data);
    if (sloRes.success) setSloData(sloRes.data);
    if (aRes.success) setAlertRules(aRes.data);
  };

  const handleTriggerIncident = async (data) => {
    const res = await api.triggerIncident(data);
    if (res.success) {
      setIncidents([res.data, ...incidents]);
      loadAllData();
    }
  };

  const handleAcknowledge = async (id) => {
    const res = await api.acknowledgeIncident(id);
    if (res.success) loadAllData();
  };

  const handleResolve = async (id) => {
    const res = await api.resolveIncident(id, 'Mitigated root-cause dependency failure.');
    if (res.success) loadAllData();
  };

  const activeP1Count = incidents.filter(i => i.severity === 'P1_CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;

  return (
    <div className="dashboard-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} activeP1Count={activeP1Count} />

      {activeTab === 'overview' && (
        <>
          <ClusterHealthOverview summary={summary} />
          <TelemetryStreamChart />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Critical Escalations</h3>
            <button className="btn-ops" onClick={() => setIsModalOpen(true)}>
              + Declare Incident
            </button>
          </div>
          <IncidentManagementTable
            incidents={incidents}
            onAcknowledge={handleAcknowledge}
            onResolve={handleResolve}
          />
          <ServiceMeshGrid services={services} />
        </>
      )}

      {activeTab === 'mesh' && (
        <ServiceMeshGrid services={services} />
      )}

      {activeTab === 'incidents' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Incident Response Hub</h3>
            <button className="btn-ops" onClick={() => setIsModalOpen(true)}>
              + Declare Incident
            </button>
          </div>
          <IncidentManagementTable
            incidents={incidents}
            onAcknowledge={handleAcknowledge}
            onResolve={handleResolve}
          />
        </div>
      )}

      {activeTab === 'slo' && (
        <SloErrorBudgetCard sloData={sloData} />
      )}

      {activeTab === 'alerts' && (
        <AlertRulesView rules={alertRules} />
      )}

      <TriggerIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTrigger={handleTriggerIncident}
        services={services}
      />
    </div>
  );
}
