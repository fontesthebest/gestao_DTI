import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    HardDrive,
    ShieldAlert,
    FileText,
    Server,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'COORDINATOR', 'TECHNICIAN', 'AUDITOR'] },
        { name: 'Equipe de Bancada', path: '/bancada', icon: HardDrive, roles: ['ADMIN', 'COORDINATOR', 'TECHNICIAN'] },
        { name: 'Segurança', path: '/security', icon: ShieldAlert, roles: ['ADMIN', 'COORDINATOR', 'AUDITOR'] },
        { name: 'Governança', path: '/governance', icon: FileText, roles: ['ADMIN', 'COORDINATOR', 'AUDITOR'] },
        { name: 'Infraestrutura', path: '/infra', icon: Server, roles: ['ADMIN', 'COORDINATOR', 'TECHNICIAN'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="sidebar">
            <div className="sidebar-logo">PAINEL TI</div>

            <nav style={{ flex: 1 }}>
                {filteredMenu.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <item.icon size={20} style={{ marginRight: '12px' }} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{user?.role}</div>
                </div>
                <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                    <LogOut size={20} style={{ marginRight: '12px' }} />
                    Sair
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
