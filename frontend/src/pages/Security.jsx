import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import client from '../api/client';

const Security = () => {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        client.get('/security/incidents')
            .then(res => setIncidents(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Segurança da Informação</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <Shield size={18} style={{ marginRight: '8px' }} /> Registrar Incidente
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ameaças Críticas</div>
                    <div className="stat-value">{incidents.filter(i => i.criticality === 'CRITICAL').length}</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Vulnerabilidades do Mês</div>
                    <div className="stat-value">12</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Auditorias OK</div>
                    <div className="stat-value">4</div>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Incidente</th>
                            <th>Sistema</th>
                            <th>Criticidade</th>
                            <th>Responsável</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map(inc => (
                            <tr key={inc.id}>
                                <td>{inc.type}</td>
                                <td>{inc.systemAffected}</td>
                                <td>
                                    <span className={`badge ${inc.criticality === 'CRITICAL' ? 'badge-critical' : 'badge-open'}`}>
                                        {inc.criticality}
                                    </span>
                                </td>
                                <td>{inc.analysisResponsible.name}</td>
                                <td>{inc.status}</td>
                            </tr>
                        ))}
                        {incidents.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum incidente registrado</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Security;
