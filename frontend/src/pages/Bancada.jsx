import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, CheckCircle, Truck, Trash2, X,Ellipsis,Cog } from 'lucide-react';
import client from '../api/client';

const Bancada = () => {
    const [etList, setEtList] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form states
    const [etNumber, setEtNumber] = useState('');
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportedDefect, setReportedDefect] = useState('');

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        loading: false,
        onConfirm: null,
    });

    const fetchETs = (searchTerm) => {
        client.get(`/bancada/et?search=${searchTerm}`)
            .then(res => setEtList(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchETs(search);
    }, [search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.post('/bancada/et', {
                etNumber,
                entryDate,
                reportedDefect
            });
            setIsModalOpen(false);
            setEtNumber('');
            setReportedDefect('');
            fetchETs();
        } catch (err) {
            alert('Erro ao salvar ET: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConcluir = (id) => {
        openConfirm({
            title: 'Concluir reparo',
            message: 'Confirmar conclusão do reparo?',
            confirmText: 'Concluir',
            onConfirm: async () => {
            await client.put(`/bancada/et/${id}`, {
                status: 'FINISHED',
                repairDate: new Date(),
            });
            fetchETs();
            },
        });
    };
    
    const handleAguardarPecas = (id) => {
        openConfirm({
            title: 'Aguardar peças',
            message: 'Registrar que esta ET está aguardando peças?',
            confirmText: 'Registrar',
            onConfirm: async () => {
            await client.put(`/bancada/et/${id}`, {
                status: 'WAITING_PARTS',
            });
            fetchETs();
            },
        });
    }
    const handleEntregar = (id) => {
        openConfirm({
            title: 'Registrar saída',
            message: 'Confirmar entrega/saída da estação?',
            confirmText: 'Registrar',
            onConfirm: async () => {
            await client.put(`/bancada/et/${id}`, {
                exitDate: new Date(),
            });
            fetchETs();
            },
        });
    };

    const handleExcluir = (id) => {
        openConfirm({
            title: 'Excluir registro',
            message: 'Deseja realmente excluir este registro? Essa ação não pode ser desfeita.',
            confirmText: 'Excluir',
            onConfirm: async () => {
            await client.delete(`/bancada/et/${id}`);
            fetchETs();
            },
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN': return <span className="badge badge-open">ABERTA</span>;
            case 'WAITING_PARTS': return <span className="badge badge-progress">AGUARDANDO PEÇAS</span>;
            case 'IN_PROGRESS': return <span className="badge badge-progress">EM ANDAMENTO</span>;
            case 'FINISHED': return <span className="badge badge-done">REPARADA</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const openConfirm = ({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm }) => {
        setConfirmModal({
            open: true,
            title,
            message,
            confirmText,
            cancelText,
            loading: false,
            onConfirm,
        });
    };

    const closeConfirm = () => {
        setConfirmModal((prev) => ({ ...prev, open: false, loading: false, onConfirm: null }));
    };

    const handleConfirmYes = async () => {
        if (!confirmModal.onConfirm) return;

        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
            await confirmModal.onConfirm();
            closeConfirm();
        } catch (err) {
            // você pode trocar por toast depois
            alert('Erro: ' + (err?.message || 'Erro desconhecido'));
            setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Estações de Trabalho (ET)</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Nova ET
                </button>
            </div>

            <div className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por número da ET..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '40px' }}
                    />
                </div>
            </div>

            <div className="table-container" style={{ minHeight: "70vh"}}>
                <table>
                    <thead>
                        <tr>
                            <th>Data Entrada</th>
                            <th>ID da ET</th>
                            <th>Conclusão Reparo</th>
                            <th>Data de Saída</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {etList.map(et => (
                            <tr key={et.id}>
                                <td>{formatDate(et.entryDate)}</td>
                                <td style={{ fontWeight: 600 }}>{et.etNumber}</td>
                                <td>{formatDate(et.repairDate)}</td>
                                <td>{formatDate(et.exitDate)}</td>
                                <td>{getStatusBadge(et.status)}</td>
                                <td style={{ position: 'relative' }}>
                                    <div style={{justifyContent: 'center', display: 'flex'}}>
                                        <Ellipsis onClick={() => 
                                            setOpenActionId(openActionId === et.id ? null : et.id)
                                        }  />
                                    </div>
                                    {openActionId === et.id && (
                                        <div style={{ position: 'absolute', gap: '8px', justifyContent: 'center', display: 'flex', flexDirection: 'column', right: "2%", top: "5%", background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', zIndex: 10 }}>
                                            {!et.repairDate && (
                                                <>
                                                    <button
                                                        onClick={() => handleConcluir(et.id)}
                                                        style={{ background: 'var(--accent)', color: 'white', padding: '4px', justifyContent: 'center', display: 'flex' }}
                                                        title="Concluir Reparo"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    {et.status !== 'WAITING_PARTS' && (
                                                        <button
                                                            onClick={() => handleAguardarPecas(et.id)}
                                                            style={{ background: 'var(--warning)', color: 'white', padding: '4px', justifyContent: 'center', display: 'flex' }}
                                                            title="Aguardando Peças"
                                                        >
                                                            <Cog size={16} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            {et.repairDate && !et.exitDate && (
                                                <button
                                                    onClick={() => handleEntregar(et.id)}
                                                    style={{ background: 'var(--info)', color: 'white', padding: '4px', justifyContent: 'center', display: 'flex' }}
                                                    title="Entregar/Saída"
                                                >
                                                    <Truck size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleExcluir(et.id)}
                                                style={{ background: 'var(--danger)', color: 'white', padding: '4px', justifyContent: 'center', display: 'flex' }}
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Cadastro */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass animate-fade" style={{ width: '450px', padding: '30px', position: 'relative' }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', color: 'var(--text-muted)' }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ marginBottom: '24px' }}>Cadastrar Nova ET</h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Número da ET</label>
                                <input
                                    type="text"
                                    style={{ width: '100%' }}
                                    placeholder="Ex: ET-2024-001"
                                    value={etNumber}
                                    onChange={(e) => setEtNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Data de Entrada</label>
                                <input
                                    type="date"
                                    style={{ width: '100%' }}
                                    value={entryDate}
                                    onChange={(e) => setEntryDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Defeito / Observação</label>
                                <textarea
                                    style={{ width: '100%', minHeight: '100px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', padding: '10px' }}
                                    placeholder="Descreva o problema..."
                                    value={reportedDefect}
                                    onChange={(e) => setReportedDefect(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                                {loading ? 'Salvando...' : 'Cadastrar Estação'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {confirmModal.open && (
                <div
                    style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(4px)',
                    }}
                    onClick={closeConfirm} // clicar fora fecha
                >
                    <div
                    className="glass animate-fade"
                    style={{ width: '420px', padding: '24px', position: 'relative' }}
                    onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
                    >
                    <button
                        onClick={closeConfirm}
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', color: 'var(--text-muted)' }}
                        disabled={confirmModal.loading}
                    >
                        <X size={20} />
                    </button>

                    <h2 style={{ marginBottom: '10px' }}>{confirmModal.title}</h2>
                    <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>{confirmModal.message}</p>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                        onClick={closeConfirm}
                        className="btn-secondary"
                        style={{ padding: '10px 14px' }}
                        disabled={confirmModal.loading}
                        >
                        {confirmModal.cancelText}
                        </button>

                        <button
                        onClick={handleConfirmYes}
                        className="btn-primary"
                        style={{ padding: '10px 14px' }}
                        disabled={confirmModal.loading}
                        >
                        {confirmModal.loading ? 'Processando...' : confirmModal.confirmText}
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bancada;
