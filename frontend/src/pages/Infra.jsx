import React, { useEffect, useState } from 'react';
import { Server as ServerIcon, X } from 'lucide-react';
import client from '../api/client';

const Infra = () => {
    const [servers, setServers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);
    const [selectedServer, setSelectedServer] = useState(null);

    const [formData, setFormData] = useState({
        hostname: '',
        ip: '',
        os: '',
        physicalLocation: '',
        responsible: '',
        status: 'ONLINE'
    });

    const fetchServers = async () => {
        try {
            const res = await client.get('/infra/servers');
            setServers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchServers();

        const interval = setInterval(() => {
            fetchServers();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ONLINE':
                return '#10b981';
            case 'OFFLINE':
                return '#ef4444';
            case 'MAINTENANCE':
                return '#f59e0b';
            default:
                return 'var(--text-muted)';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            hostname: '',
            ip: '',
            os: '',
            physicalLocation: '',
            responsible: '',
            status: 'ONLINE'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await client.post('/infra/servers', formData);
            await fetchServers();
            resetForm();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openDowntimeModal = (server) => {
        setSelectedServer(server);
        setIsDowntimeModalOpen(true);
    };

    const closeDowntimeModal = () => {
        setSelectedServer(null);
        setIsDowntimeModalOpen(false);
    };

    const formatDateTime = (date) => {
        if (!date) return '-';

        return new Date(date).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium'
        });
    };

    const formatDuration = (start, end) => {
        if (!start) return '-';

        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();

        const diffMs = endDate - startDate;
        const totalSeconds = Math.floor(diffMs / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];

        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}min`);
        if (seconds > 0 && days === 0) parts.push(`${seconds}s`);

        return parts.length > 0 ? parts.join(' ') : '0s';
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}
            >
                <h1>Infraestrutura</h1>

                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <ServerIcon size={18} style={{ marginRight: '8px' }} />
                    Adicionar Ativo
                </button>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}
            >
                {servers.map((server) => (
                    <div
                        key={server.id}
                        className="card"
                        style={{ borderTop: `4px solid ${getStatusColor(server.status)}` }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start'
                            }}
                        >
                            <div>
                                <h3 style={{ marginBottom: '4px' }}>{server.hostname}</h3>
                                <code
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {server.ip}
                                </code>
                            </div>

                            <div
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: getStatusColor(server.status),
                                    boxShadow: `0 0 10px ${getStatusColor(server.status)}`
                                }}
                            ></div>
                        </div>

                        <div
                            style={{
                                marginTop: '20px',
                                fontSize: '0.85rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
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

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                                <span style={{ color: getStatusColor(server.status), fontWeight: 600 }}>
                                    {server.status}
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: '20px',
                                paddingTop: '16px',
                                borderTop: '1px solid var(--border)',
                                display: 'flex',
                                gap: '10px'
                            }}
                        >
                            <button
                                onClick={() => openDowntimeModal(server)}
                                style={{
                                    flex: 1,
                                    fontSize: '0.75rem',
                                    background: 'var(--primary-hover)',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            >
                                Downtime Log
                            </button>

                            <button
                                style={{
                                    flex: 1,
                                    fontSize: '0.75rem',
                                    background: 'var(--surface-hover)'
                                }}
                            >
                                Configurar
                            </button>
                        </div>
                    </div>
                ))}

                {servers.length === 0 && (
                    <div
                        className="card"
                        style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '40px'
                        }}
                    >
                        <ServerIcon
                            size={48}
                            color="var(--border)"
                            style={{ marginBottom: '16px' }}
                        />
                        <p style={{ color: 'var(--text-muted)' }}>
                            Nenhum servidor monitorado no momento
                        </p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                    onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                    }}
                >
                    <div
                        className="card"
                        style={{
                            width: '100%',
                            maxWidth: '520px',
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            padding: '24px',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                resetForm();
                            }}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text)'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ marginBottom: '20px' }}>Adicionar Ativo</h2>

                        <form onSubmit={handleSubmit}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px'
                                }}
                            >
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        Hostname
                                    </label>
                                    <input
                                        type="text"
                                        name="hostname"
                                        value={formData.hostname}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        IP
                                    </label>
                                    <input
                                        type="text"
                                        name="ip"
                                        value={formData.ip}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        Sistema Operacional
                                    </label>
                                    <input
                                        type="text"
                                        name="os"
                                        value={formData.os}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        Localização Física
                                    </label>
                                    <input
                                        type="text"
                                        name="physicalLocation"
                                        value={formData.physicalLocation}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        Responsável
                                    </label>
                                    <input
                                        type="text"
                                        name="responsible"
                                        value={formData.responsible}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px' }}>
                                        Status Inicial
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    >
                                        <option value="ONLINE">ONLINE</option>
                                        <option value="OFFLINE">OFFLINE</option>
                                        <option value="MAINTENANCE">MAINTENANCE</option>
                                    </select>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '12px',
                                    marginTop: '24px'
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'transparent',
                                        color: 'var(--text)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDowntimeModalOpen && selectedServer && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        padding: '20px'
                    }}
                    onClick={closeDowntimeModal}
                >
                    <div
                        className="card"
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            padding: '24px',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeDowntimeModal}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text)'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ marginBottom: '6px' }}>Relatório de Downtimes</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                            {selectedServer.hostname} ({selectedServer.ip})
                        </p>

                        {selectedServer.downtimes && selectedServer.downtimes.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[...selectedServer.downtimes]
                                    .sort((a, b) => new Date(b.start) - new Date(a.start))
                                    .map((downtime) => (
                                        <div
                                            key={downtime.id}
                                            style={{
                                                border: '1px solid var(--border)',
                                                borderRadius: '10px',
                                                padding: '16px',
                                                background: 'var(--background)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                                    gap: '12px',
                                                    marginBottom: '12px'
                                                }}
                                            >
                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        Início
                                                    </span>
                                                    <div style={{ marginTop: '4px', fontWeight: 600 }}>
                                                        {formatDateTime(downtime.start)}
                                                    </div>
                                                </div>

                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        Fim
                                                    </span>
                                                    <div style={{ marginTop: '4px', fontWeight: 600 }}>
                                                        {downtime.end ? formatDateTime(downtime.end) : 'Em andamento'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        Duração
                                                    </span>
                                                    <div style={{ marginTop: '4px', fontWeight: 600 }}>
                                                        {formatDuration(downtime.start, downtime.end)}
                                                    </div>
                                                </div>

                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        Situação
                                                    </span>
                                                    <div
                                                        style={{
                                                            marginTop: '4px',
                                                            fontWeight: 600,
                                                            color: downtime.end ? '#10b981' : '#f59e0b'
                                                        }}
                                                    >
                                                        {downtime.end ? 'Finalizado' : 'Aberto'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    Motivo
                                                </span>
                                                <div style={{ marginTop: '4px' }}>
                                                    {downtime.reason || 'Não informado'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: 'var(--text-muted)',
                                    border: '1px dashed var(--border)',
                                    borderRadius: '10px'
                                }}
                            >
                                Nenhum downtime registrado para este servidor.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Infra;