import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Server
} from 'lucide-react';
import client from '../api/client';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalETOpen: 0,
        securityIncidentsActive: 0,
        contractsExpiring: 0,
        serversOffline: 0
    });

    useEffect(() => {
        client.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    const chartData = [
        { name: 'ETs Abertas', value: stats.totalETOpen, color: '#3b82f6' },
        { name: 'Incidentes', value: stats.securityIncidentsActive, color: '#ef4444' },
        { name: 'Contratos/Venc', value: stats.contractsExpiring, color: '#f59e0b' },
        { name: 'Servidores Off', value: stats.serversOffline, color: '#6366f1' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Dashboard Geral</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>ETs em Aberto</span>
                        <Clock size={20} color="var(--info)" />
                    </div>
                    <div className="stat-value">{stats.totalETOpen}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Equipe de Bancada</div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Incidentes Ativos</span>
                        <AlertCircle size={20} color="var(--danger)" />
                    </div>
                    <div className="stat-value">{stats.securityIncidentsActive}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cibersegurança</div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Contratos Próx. Venc.</span>
                        <CheckCircle size={20} color="var(--warning)" />
                    </div>
                    <div className="stat-value">{stats.contractsExpiring}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Governança de TI</div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Servidores Offline</span>
                        <Server size={20} color="var(--primary)" />
                    </div>
                    <div className="stat-value">{stats.serversOffline}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Infraestrutura</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '24px', height: '400px' }}>
                <h3 style={{ marginBottom: '20px' }}>Métricas de Operação</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
