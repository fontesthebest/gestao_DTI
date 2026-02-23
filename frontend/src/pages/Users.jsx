import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    UserPlus,
    Search,
    Mail,
    Shield,
    Briefcase,
    Trash2,
    Edit2,
    X,
    CheckCircle
} from 'lucide-react';
import client from '../api/client';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'TECHNICIAN',
        team: ''
    });

    const roles = ['ADMIN', 'COORDINATOR', 'TECHNICIAN', 'AUDITOR'];
    const teams = ['Bancada', 'Seguranca', 'Governanca', 'Infra'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await client.get('/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Não mostrar senha
                role: user.role,
                team: user.team || ''
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'TECHNICIAN',
                team: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await client.put(`/users/${editingUser.id}`, formData);
            } else {
                await client.post('/users', formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Erro ao salvar usuário');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja remover este usuário?')) {
            try {
                await client.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Erro ao remover usuário');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Carregando usuários...</div>;

    return (
        <div className="users-page">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>Gestão de Usuários</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Controle de acessos e permissões do sistema</p>
                </div>
                <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={18} />
                    Novo Usuário
                </button>
            </header>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div className="card glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '12px', color: '#3498db' }}>
                            <UsersIcon size={24} />
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold' }}>{users.length}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Usuários Totais</span>
                        </div>
                    </div>
                </div>
                {/* Adicionar mais estatísticas se desejar */}
            </div>

            <div className="card glass-card">
                <div className="search-bar" style={{ marginBottom: '24px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', paddingLeft: '40px' }}
                    />
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Papel (Role)</th>
                                <th>Equipe</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="avatar" style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: 'var(--gradient-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Mail size={14} />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${user.role.toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                                            <Shield size={12} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.team ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Briefcase size={14} />
                                                {user.team}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-icon" onClick={() => handleOpenModal(user)} title="Editar">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn-icon" style={{ color: '#e74c3c' }} onClick={() => handleDelete(user.id)} title="Excluir">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card animate-scale" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {editingUser ? <Edit2 size={24} /> : <UserPlus size={24} />}
                                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                            </h2>
                            <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>E-mail Corporativo</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Senha {editingUser && '(deixe em branco para manter)'}</label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div className="form-group">
                                    <label>Papel (Role)</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Equipe</label>
                                    <select
                                        value={formData.team}
                                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                    >
                                        <option value="">Sem Equipe</option>
                                        {teams.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <CheckCircle size={18} />
                                    {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
