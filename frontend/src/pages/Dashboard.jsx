import  { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    CheckCircle, Server, ShieldAlert, FileText, Briefcase, Database, Activity
} from 'lucide-react';
import client from '../api/client';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalETOpen: 0,
        totalETToGetOut: 0,
        totalETWaitingParts: 0,
        totalETFinishedToday: 0,
        securityIncidentsActive: 0,
        contractsExpiring: 0,
        serversOffline: 0,
        totalProjects: 0,
        totalInventory: 0
    });
    const navigate = (href) => {
        if (href) window.location.href = href;
    }

    useEffect(() => {
        client.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    const chartData = [
        { name: 'Abertas', value: stats.totalETOpen, color: '#3b82f6' },
        { name: 'Para Retirada', value: stats.totalETFinishedToday, color: '#8b5cf6' },
        { name: 'Aguardando Peças', value: stats.totalETWaitingParts, color: '#f59e0b' },
        { name: 'Incidentes', value: stats.securityIncidentsActive, color: '#ef4444' },
    ];

    const summaryCards = [
        { title: 'Inventário Total', value: stats.totalInventory, icon: Database, color: '#3b82f6', sub: 'Ativos mapeados', href: '/' },
        { title: 'Projetos Ativos', value: stats.totalProjects, icon: Briefcase, color: '#8b5cf6', sub: 'Em andamento', href: '#/governance' },
        { title: 'Segurança', value: stats.securityIncidentsActive, icon: ShieldAlert, color: '#ef4444', sub: 'Alertas críticos' , href: '#/security' },
        { title: 'Infraestrutura', value: stats.serversOffline, icon: Server, color: '#f59e0b', sub: 'Servidores down' , href: '#/infra' },
        { title: 'Contratos', value: stats.contractsExpiring, icon: FileText, color: '#10b981', sub: 'Vencendo logo' , href: '#/governance' },
    ];

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Dashboard Operacional</h1>
                <p style={{ color: 'var(--text-muted)' }}>Métricas consolidadas de todas as frentes de TI</p>
            </header>

            {/* Sequência de Cards de Resumo */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                {summaryCards.map((card, idx) => (
                    <div key={idx} className="card glass-card hover-lift" style={{ borderLeft: `4px solid ${card.color}` }} onClick={() => navigate(card.href)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{card.title}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{card.value}</h3>
                                <p style={{ fontSize: '0.7rem', color: card.color, marginTop: '4px' }}>{card.sub}</p>
                            </div>
                            <div style={{ padding: '10px', background: `${card.color}15`, borderRadius: '12px' }}>
                                <card.icon size={24} color={card.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
                {/* Status da Bancada */}
                <section className="glass-card" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Activity size={20} color="var(--primary)" /> Fluxo da Bancada Técnica
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalETOpen}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aguardando</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalETFinishedToday}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Para Retirada</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalETWaitingParts}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aguardando Peças</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                            <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalETToGetOut}</div>
                            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Saída Hoje</div>
                        </div>
                    </div>

                    <div style={{ height: '300px', marginTop: '30px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Incidentes Recentes / Governança */}
                <section style={{ display: 'grid', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert size={18} color="#ef4444" /> Segurança
                        </h3>
                        {stats.securityIncidentsActive > 0 ? (
                            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef4444' }}>{stats.securityIncidentsActive} Incidentes Ativos</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(239, 68, 68, 0.8)' }}>Requer atenção imediata da equipe</div>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhum incidente crítico</div>
                        )}
                    </div>

                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} color="#10b981" /> Governança
                        </h3>
                        <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                            <b>{stats.contractsExpiring}</b> contratos vencendo em 30 dias.
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <b>{stats.totalProjects}</b> projetos estratégicos ativos.
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Backup & Restore</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={16} color="#10b981" />
                            <span style={{ fontSize: '0.85rem' }}>Último backup: OK (2h atrás)</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
