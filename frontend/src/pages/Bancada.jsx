import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, CheckCircle, Truck, Trash2, X } from 'lucide-react';
import client from '../api/client';

const Bancada = () => {
    const [etList, setEtList] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [etNumber, setEtNumber] = useState('');
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportedDefect, setReportedDefect] = useState('');

    const fetchETs = () => {
        client.get('/bancada/et')
            .then(res => setEtList(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchETs();
    }, []);

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

    const handleConcluir = async (id) => {
        if (!window.confirm('Confirmar conclusão do reparo?')) return;
        try {
            await client.put(`/bancada/et/${id}`, {
                status: 'FINISHED',
                repairDate: new Date()
            });
            fetchETs();
        } catch (err) {
            alert('Erro ao concluir reparo: ' + err.message);
        }
    };

    const handleEntregar = async (id) => {
        if (!window.confirm('Confirmar entrega/saída da estação?')) return;
        try {
            await client.put(`/bancada/et/${id}`, {
                exitDate: new Date()
            });
            fetchETs();
        } catch (err) {
            alert('Erro ao registrar saída: ' + err.message);
        }
    };

    const handleExcluir = async (id) => {
        if (!window.confirm('Deseja realmente excluir este registro?')) return;
        try {
            // Assumindo que criaremos a rota DELETE no backend
            await client.delete(`/bancada/et/${id}`);
            fetchETs();
        } catch (err) {
            alert('Erro ao excluir: ' + err.message);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN': return <span className="badge badge-open">ABERTA</span>;
            case 'IN_PROGRESS': return <span className="badge badge-progress">EM ANDAMENTO</span>;
            case 'FINISHED': return <span className="badge badge-done">REPARADA</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
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

            <div className="table-container">
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
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        {!et.repairDate && (
                                            <button
                                                onClick={() => handleConcluir(et.id)}
                                                style={{ background: 'var(--accent)', color: 'white', padding: '6px' }}
                                                title="Concluir Reparo"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        {et.repairDate && !et.exitDate && (
                                            <button
                                                onClick={() => handleEntregar(et.id)}
                                                style={{ background: 'var(--info)', color: 'white', padding: '6px' }}
                                                title="Entregar/Saída"
                                            >
                                                <Truck size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleExcluir(et.id)}
                                            style={{ background: 'var(--danger)', color: 'white', padding: '6px' }}
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
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
        </div>
    );
};

export default Bancada;
