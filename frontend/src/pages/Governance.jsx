import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Briefcase, Calendar, DollarSign, Activity } from 'lucide-react';
import client from '../api/client';

const Governance = () => {
    const [contracts, setContracts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [showContractForm, setShowContractForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [users, setUsers] = useState([]);

    const [newContract, setNewContract] = useState({
        name: '', provider: '', termStart: '', termEnd: '', value: '', responsibleId: '', status: 'Ativo', costCenter: '', slaMetrics: ''
    });

    const [newProject, setNewProject] = useState({
        name: '', description: '', status: 'Em Planejamento', budget: ''
    });

    const fetchData = async () => {
        try {
            const [contractsRes, projectsRes, usersRes] = await Promise.all([
                client.get('/governance/contracts'),
                client.get('/governance/projects'),
                client.get('/users')
            ]);
            setContracts(contractsRes.data);
            setProjects(projectsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateContract = async (e) => {
        e.preventDefault();
        try {
            await client.post('/governance/contracts', newContract);
            setShowContractForm(false);
            setNewContract({ name: '', provider: '', termStart: '', termEnd: '', value: '', responsibleId: '', status: 'Ativo', costCenter: '', slaMetrics: '' });
            fetchData();
        } catch (err) {
            alert('Erro ao criar contrato');
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await client.post('/governance/projects', newProject);
            setShowProjectForm(false);
            setNewProject({ name: '', description: '', status: 'Em Planejamento', budget: '' });
            fetchData();
        } catch (err) {
            alert('Erro ao criar projeto');
        }
    };

    const handleDeleteContract = async (id) => {
        if (window.confirm('Excluir este contrato?')) {
            await client.delete(`/governance/contracts/${id}`);
            fetchData();
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Excluir este projeto?')) {
            await client.delete(`/governance/projects/${id}`);
            fetchData();
        }
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Governança de TI</h1>
                <p style={{ color: 'var(--text-muted)' }}>Gestão de contratos, projetos e conformidade</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                {/* Contratos */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={22} color="var(--primary)" /> Contratos
                        </h2>
                        <button className="btn-primary" onClick={() => setShowContractForm(!showContractForm)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                            <Plus size={16} /> Novo
                        </button>
                    </div>

                    {showContractForm && (
                        <form onSubmit={handleCreateContract} className="glass-card" style={{ padding: '20px', marginBottom: '20px', display: 'grid', gap: '12px' }}>
                            <input type="text" placeholder="Nome do Contrato" className="form-input" required value={newContract.name} onChange={e => setNewContract({ ...newContract, name: e.target.value })} />
                            <input type="text" placeholder="Fornecedor" className="form-input" required value={newContract.provider} onChange={e => setNewContract({ ...newContract, provider: e.target.value })} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="date" className="form-input" required value={newContract.termStart} onChange={e => setNewContract({ ...newContract, termStart: e.target.value })} />
                                <input type="date" className="form-input" required value={newContract.termEnd} onChange={e => setNewContract({ ...newContract, termEnd: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="number" placeholder="Valor Anual" className="form-input" required value={newContract.value} onChange={e => setNewContract({ ...newContract, value: e.target.value })} />
                                <select className="form-input" required value={newContract.responsibleId} onChange={e => setNewContract({ ...newContract, responsibleId: e.target.value })}>
                                    <option value="">Responsável</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <input type="text" placeholder="Centro de Custo" className="form-input" required value={newContract.costCenter} onChange={e => setNewContract({ ...newContract, costCenter: e.target.value })} />
                            <button type="submit" className="btn-primary">Salvar Contrato</button>
                        </form>
                    )}

                    <div className="table-container shadow-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome / Fornecedor</th>
                                    <th>Vencimento</th>
                                    <th>Valor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts.map(c => (
                                    <tr key={c.id}>
                                        <td>
                                            <div style={{ fontWeight: '600' }}>{c.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.provider}</div>
                                        </td>
                                        <td>{new Date(c.termEnd).toLocaleDateString()}</td>
                                        <td>R$ {c.value.toLocaleString()}</td>
                                        <td>
                                            <button onClick={() => handleDeleteContract(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {contracts.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Nenhum contrato</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Projetos */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Briefcase size={22} color="var(--primary)" /> Projetos Estratégicos
                        </h2>
                        <button className="btn-primary" onClick={() => setShowProjectForm(!showProjectForm)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                            <Plus size={16} /> Novo
                        </button>
                    </div>

                    {showProjectForm && (
                        <form onSubmit={handleCreateProject} className="glass-card" style={{ padding: '20px', marginBottom: '20px', display: 'grid', gap: '12px' }}>
                            <input type="text" placeholder="Nome do Projeto" className="form-input" required value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
                            <textarea placeholder="Descrição" className="form-input" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <select className="form-input" required value={newProject.status} onChange={e => setNewProject({ ...newProject, status: e.target.value })}>
                                    <option value="Em Planejamento">Em Planejamento</option>
                                    <option value="Em Execução">Em Execução</option>
                                    <option value="Suspenso">Suspenso</option>
                                    <option value="Concluído">Concluído</option>
                                </select>
                                <input type="number" placeholder="Orçamento (Opcional)" className="form-input" value={newProject.budget} onChange={e => setNewProject({ ...newProject, budget: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary">Salvar Projeto</button>
                        </form>
                    )}

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {projects.map(p => (
                            <div key={p.id} className="card glass-card" style={{ padding: '16px', borderLeft: `4px solid ${p.status === 'Concluído' ? '#10b981' : '#3b82f6'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{p.description}</div>
                                    </div>
                                    <button onClick={() => handleDeleteProject(p.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                                    <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>{p.status}</span>
                                    {p.budget && <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>R$ {p.budget.toLocaleString()}</div>}
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="card glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Nenhum projeto estratégico</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Governance;
