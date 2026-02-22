import React, { useEffect, useState } from 'react';
import { Server as ServerIcon, Network, HardDrive } from 'lucide-react';
import client from '../api/client';

const Infra = () => {
    const [servers, setServers] = useState([]);

    useEffect(() => {
        client.get('/infra/servers')
            .then(res => setServers(res.data))
            .catch(err => console.error(err));
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ONLINE': return '#10b981';
            case 'OFFLINE': return '#ef4444';
            case 'MAINTENANCE': return '#f59e0b';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Infraestrutura</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <ServerIcon size={18} style={{ marginRight: '8px' }} /> Adicionar Ativo
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {servers.map(server => (
                    <div key={server.id} className="card" style={{ borderTop: `4px solid ${getStatusColor(server.status)}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ marginBottom: '4px' }}>{server.hostname}</h3>
                                <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{server.ip}</code>
                            </div>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: getStatusColor(server.status),
                                boxShadow: `0 0 10px ${getStatusColor(server.status)}`
                            }}></div>
                        </div>

                        <div style={{ marginTop: '20px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>SO:</span>
                                <span>{server.os}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Localização:</span>
                                <span>{server.physicalLocation}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Responsável:</span>
                                <span>{server.responsible}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                            <button style={{ flex: 1, fontSize: '0.75rem', background: 'var(--surface-hover)' }}>Downtime Log</button>
                            <button style={{ flex: 1, fontSize: '0.75rem', background: 'var(--surface-hover)' }}>Configurar</button>
                        </div>
                    </div>
                ))}
                {servers.length === 0 && (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        <ServerIcon size={48} color="var(--border)" style={{ marginBottom: '16px' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Nenhum servidor monitorado no momento</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Infra;
