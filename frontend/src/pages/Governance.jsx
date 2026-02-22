import React, { useEffect, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import client from '../api/client';

const Governance = () => {
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        client.get('/governance/contracts')
            .then(res => setContracts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Governança de TI</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Novo Contrato
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Contrato</th>
                            <th>Fornecedor</th>
                            <th>Vigência</th>
                            <th>Valor Anual</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(c => (
                            <tr key={c.id}>
                                <td style={{ fontWeight: '600' }}>{c.name}</td>
                                <td>{c.provider}</td>
                                <td>{new Date(c.termStart).toLocaleDateString()} - {new Date(c.termEnd).toLocaleDateString()}</td>
                                <td>R$ {c.value.toLocaleString()}</td>
                                <td>
                                    <span className="badge badge-done">{c.status}</span>
                                </td>
                            </tr>
                        ))}
                        {contracts.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum contrato cadastrado</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Governance;
