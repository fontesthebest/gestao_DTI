import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import client from '../api/client';

const Bancada = () => {
    const [etList, setEtList] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        client.get('/bancada/et')
            .then(res => setEtList(res.data))
            .catch(err => console.error(err));
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN': return <span className="badge badge-open">ABERTA</span>;
            case 'IN_PROGRESS': return <span className="badge badge-progress">EM ANDAMENTO</span>;
            case 'FINISHED': return <span className="badge badge-done">FINALIZADA</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Estações de Trabalho (ET)</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
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
                <button style={{ background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                    <Filter size={18} style={{ marginRight: '8px' }} /> Filtros
                </button>
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
                            <th>Ações</th>
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
                                    <button style={{ fontSize: '0.75rem', padding: '4px 8px' }}>Ver Detalhes</button>
                                </td>
                            </tr>
                        ))}
                        {etList.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma Estação de Trabalho encontrada</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bancada;
