import React, { useEffect, useState } from 'react';
import { Shield, X } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const Security = () => {
  const [incidents, setIncidents] = useState([]);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  // Form states (INCIDENT)
  const [type, setType] = useState('');
  const [systemAffected, setSystemAffected] = useState('');
  const [criticality, setCriticality] = useState('LOW'); // LOW | MEDIUM | HIGH | CRITICAL
  const [impact, setImpact] = useState('');
  const [status, setStatus] = useState('OPEN'); // OPEN | IN_PROGRESS | RESOLVED

  const fetchIncidents = async () => {
    try {
      const res = await client.get('/security/incidents');
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const resetForm = () => {
    setType('');
    setSystemAffected('');
    setCriticality('LOW');
    setImpact('');
    setStatus('OPEN');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/security/incidents', {
        type,
        systemAffected,
        criticality,
        impact,
        analysisResponsibleId: user.id,
        status,
      });

      setIsModalOpen(false);
      resetForm();
      fetchIncidents();
    } catch (err) {
      alert('Erro ao registrar incidente: ' + (err?.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Segurança da Informação</h1>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={() => setIsModalOpen(true)}
        >
          <Shield size={18} style={{ marginRight: '8px' }} /> Registrar Incidente
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}> 
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ameaças Críticas</div> 
            <div className="stat-value">{incidents.filter(i => i.criticality === 'CRITICAL').length}</div> 
        </div> 
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}> 
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Vulnerabilidades do Mês</div> 
            <div className="stat-value">{incidents.filter(i => (i.detectionDate.split('T')[0].split('-')[1] === new Date().toISOString().split('T')[0].split('-')[1]) && i.resolutionDate === null).length}</div> 
        </div>
            <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}> 
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Auditorias OK
                </div>
                 <div className="stat-value">
                    4
                </div> 
            </div> 
        </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Incidente</th>
              <th>Sistema</th>
              <th>Criticidade</th>
              <th>Responsável</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id}>
                <td>{inc.type}</td>
                <td>{inc.systemAffected}</td>
                <td>
                  <span className={`badge ${inc.criticality === 'CRITICAL' ? 'badge-critical' : 'badge-open'}`}>
                    {inc.criticality}
                  </span>
                </td>
                <td>{inc.analysisResponsible?.name || '-'}</td>
                <td>{inc.status}</td>
              </tr>
            ))}

            {incidents.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhum incidente registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
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
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => !loading && setIsModalOpen(false)}
        >
          <div
            className="glass animate-fade"
            style={{ width: '520px', padding: '30px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', color: 'var(--text-muted)' }}
              disabled={loading}
            >
              <X size={20} />
            </button>

            <h2 style={{ marginBottom: '24px' }}>Registrar Incidente</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Tipo do incidente</label>
                <input
                  type="text"
                  style={{ width: '100%' }}
                  placeholder="Ex: Phishing, Malware, Acesso indevido..."
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Sistema afetado</label>
                <input
                  type="text"
                  style={{ width: '100%' }}
                  placeholder="Ex: SIGAD, E-mail, Servidor X..."
                  value={systemAffected}
                  onChange={(e) => setSystemAffected(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Criticidade</label>
                  <select
                    style={{ width: '100%' }}
                    value={criticality}
                    onChange={(e) => setCriticality(e.target.value)}
                    required
                  >
                    <option value="LOW">BAIXA</option>
                    <option value="MEDIUM">MÉDIA</option>
                    <option value="HIGH">ALTA</option>
                    <option value="CRITICAL">CRÍTICA</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Status</label>
                  <select style={{ width: '100%' }} value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="OPEN">ABERTO</option>
                    <option value="IN_PROGRESS">EM ANDAMENTO</option>
                    <option value="RESOLVED">RESOLVIDO</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Impacto</label>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '110px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '10px',
                  }}
                  placeholder="Descreva o impacto do incidente..."
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                {loading ? 'Salvando...' : 'Registrar Incidente'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;