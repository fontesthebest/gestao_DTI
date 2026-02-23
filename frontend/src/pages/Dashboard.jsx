import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Server,
    HardDrive,
    Wrench,
    Package,
    ShieldAlert,
    FileText
} from 'lucide-react';
import client from '../api/client';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalETOpen: 0,
        totalETInProgress: 0,
        totalETWaitingParts: 0,
        totalETFinishedToday: 0,
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
        { name: 'Abertas', value: stats.totalETOpen, color: '#3b82f6' },
        { name: 'Em Reparo', value: stats.totalETInProgress, color: '#8b5cf6' },
        { name: 'Peças', value: stats.totalETWaitingParts, color: '#f59e0b' },
        { name: 'Incidentes', value: stats.securityIncidentsActive, color: '#ef4444' },
    ];

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Dashboard Operacional</h1>
                <p style={{ color: 'var(--text-muted)' }}>Status em tempo real das operações de TI</p>
            </header>

            {/* Seção: Equipe de Bancada - Destaque */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', marginBottom: '20px', color: 'var(--primary)' }}>
                    <HardDrive size={24} />
                    Status da Bancada
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div className="card glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ETs Pendentes</span>
                                <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.totalETOpen}</div>
                            </div>
                            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                                <Clock size={20} color="#3b82f6" />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '8px' }}>Aguardando início</div>
                    </div>

                    <div className="card glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Em Reparo</span>
                                <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.totalETInProgress}</div>
                            </div>
                            <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                                <Wrench size={20} color="#8b5cf6" />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '8px' }}>Atividade técnica</div>
                    </div>

                    <div className="card glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aguardando Peças</span>
                                <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.totalETWaitingParts}</div>
                            </div>
                            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                                <Package size={20} color="#f59e0b" />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '8px' }}>Pendência de hardware</div>
                    </div>

                    <div className="card glass-card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Concluídas Hoje</span>
                                <div className="stat-value" style={{ color: '#10b981' }}>{stats.totalETFinishedToday}</div>
                            </div>
                            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                                <CheckCircle size={20} color="#10b981" />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '8px' }}>Meta de produtividade</div>
                    </div>
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Outros Departamentos */}
                <section>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Resumo Geral</h2>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px' }}>
                            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                                <ShieldAlert size={24} color="#ef4444" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Incidentes de Segurança</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.securityIncidentsActive} Ativos</div>
                            </div>
                        </div>

                        <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px' }}>
                            <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                                <Server size={24} color="#6366f1" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Infraestrutura</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.serversOffline} Servidores Offline</div>
                            </div>
                        </div>

                        <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px' }}>
                            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                                <FileText size={24} color="#f59e0b" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Governança (Contratos)</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.contractsExpiring} Próximos ao Vencimento</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gráfico */}
                <section className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Carga de Trabalho por Status</h3>
                    <div style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
