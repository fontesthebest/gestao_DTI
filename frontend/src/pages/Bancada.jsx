import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import client from '../api/client';

const Bancada = () => {
    const [osList, setOsList] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        client.get('/bancada/os')
            .then(res => setOsList(res.data))
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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Equipe de Bancada</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Nova OS
                </button>
            </div>

            <div className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por patrimônio, defeito..."
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
                            <th>ID / Data</th>
                            <th>Patrimônio</th>
                            <th>Equipamento</th>
                            <th>Defeito</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {osList.map(os => (
                            <tr key={os.id}>
                                <td>
                                    <div style={{ fontSize: '0.85rem' }}>{os.id.substring(0, 8)}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(os.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td>{os.equipment.patrimony}</td>
                                <td>{os.equipment.type}</td>
                                <td>{os.reportedDefect}</td>
                                <td>{getStatusBadge(os.status)}</td>
                                <td>
                                    <button style={{ fontSize: '0.75rem', padding: '4px 8px' }}>Ver Detalhes</button>
                                </td>
                            </tr>
                        ))}
                        {osList.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma ordem de serviço encontrada</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bancada;
