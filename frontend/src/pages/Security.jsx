import React, { useEffect, useState } from 'react';
import { Shield, X, CheckCircle, Truck, Trash2, Ellipsis,NotebookText } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const Security = () => {
  const [incidents, setIncidents] = useState([]);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);

  // Form states (INCIDENT)
  const [type, setType] = useState('');
  const [systemAffected, setSystemAffected] = useState('');
  const [criticality, setCriticality] = useState('LOW'); // LOW | MEDIUM | HIGH | CRITICAL
  const [impact, setImpact] = useState('');
  const [status, setStatus] = useState('OPEN'); // OPEN | IN_PROGRESS | RESOLVED

  // Form states (RESOLUTION)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolveLoading, setResolveLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [correctiveMeasures, setCorrectiveMeasures] = useState('');

  // Report modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportIncident, setReportIncident] = useState(null);

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

  // Função para resetar os campos do formulário de registro de incidente
  const resetForm = () => {
    setType('');
    setSystemAffected('');
    setCriticality('LOW');
    setImpact('');
    setStatus('OPEN');
  };

  // Função para lidar com o envio do formulário de registro de incidente
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

  // Funções para lidar com a resolução de incidentes
  const openResolveModal = (inc) => {
    setSelectedIncident(inc);
    setCorrectiveMeasures('');
    setIsResolveModalOpen(true);
    setOpenActionId(null);
  };

  const closeResolveModal = () => {
    if (resolveLoading) return;
    setIsResolveModalOpen(false);
    setSelectedIncident(null);
    setCorrectiveMeasures('');
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIncident) return;

    setResolveLoading(true);
    try {
      await client.put(`/security/incidents/${selectedIncident.id}/resolve`, {
        correctiveMeasures,              // explicação do que foi feito
        resolutionDate: new Date(),    // ou o backend seta sozinho
        status: 'RESOLVED',
      });

      closeResolveModal();
      fetchIncidents();
    } catch (err) {
      alert('Erro ao concluir incidente: ' + (err?.message || 'Erro desconhecido'));
    } finally {
      setResolveLoading(false);
    }
  };

  // Funções para lidar com o modal de relatório/entrega
  const openReportModal = (inc) => {
    setReportIncident(inc);
    setIsReportModalOpen(true);
    setOpenActionId(null);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportIncident(null);
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
            <div className="stat-value">{incidents.filter(i => (i.criticality === 'CRITICAL' && i.resolutionDate === null)).length}</div> 
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
                    {incidents.filter(i => i.status === 'RESOLVED').length}
                </div> 
            </div> 
        </div>

      <div className="table-container" style={{ minHeight: "60vh"}}>
        <table>
          <thead>
            <tr>
              <th>Incidente</th>
              <th>Sistema</th>
              <th>Criticidade</th>
              <th>Responsável</th>
              <th>Status</th>
              <th>Ações</th>
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
                <td style={{position: 'relative'}}>
                  <div style={{justifyContent: 'center', display: 'flex'}}>
                      <Ellipsis onClick={() => 
                          setOpenActionId(openActionId === inc.id ? null : inc.id)
                      }  />
                  </div>
                  {openActionId === inc.id && (
                        <div style={{ position: 'absolute', gap: '8px', justifyContent: 'center', display: 'flex', flexDirection: 'column', right: "2%", top: "5%", background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', zIndex: 10 }}>
                            {inc.status === 'OPEN' && (
                                <>
                                    <button
                                        onClick={() => openResolveModal(inc)}
                                        style={{ background: 'var(--accent)', color: 'white', padding: '4px', justifyContent: 'center', display: 'flex' }}
                                        title="Concluir Reparo"
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                </>
                            )}
                            {inc.resolutionDate && (
                                <button
                                    onClick={() => openReportModal(inc)}
                                    style={{ background: 'var(--info)', color: 'white', padding: '4px', justifyContent: 'center', display: 'flex' }}
                                    title="Entregar/Saída"
                                >
                                    <NotebookText size={16} />
                                </button>
                            )}
                            <button
                                
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
      {isResolveModalOpen && (
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
            zIndex: 1100,
            backdropFilter: 'blur(4px)',
          }}
          onClick={closeResolveModal}
        >
          <div
            className="glass animate-fade"
            style={{ width: '520px', padding: '30px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeResolveModal}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', color: 'var(--text-muted)' }}
              disabled={resolveLoading}
            >
              <X size={20} />
            </button>

            <h2 style={{ marginBottom: '10px' }}>Concluir Incidente</h2>

            <div style={{ marginBottom: '18px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <div><b>Incidente:</b> {selectedIncident?.type}</div>
              <div><b>Sistema:</b> {selectedIncident?.systemAffected}</div>
              <div><b>Criticidade:</b> {selectedIncident?.criticality}</div>
            </div>

            <form onSubmit={handleResolveSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Explique o que foi feito para resolver
                </label>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '130px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '10px',
                  }}
                  placeholder="Ex: Bloqueado IP no firewall, redefinidas credenciais, aplicada correção, varredura antimalware, etc..."
                  value={correctiveMeasures}
                  onChange={(e) => setCorrectiveMeasures(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeResolveModal}
                  disabled={resolveLoading}
                  style={{ padding: '10px 14px' }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={resolveLoading}
                  style={{ padding: '10px 14px' }}
                >
                  {resolveLoading ? 'Concluindo...' : 'Concluir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isReportModalOpen && (
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
            zIndex: 1200,
            backdropFilter: 'blur(4px)',
          }}
          onClick={closeReportModal}
        >
          <div
            className="glass animate-fade"
            style={{ width: '620px', padding: '30px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeReportModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                color: 'var(--text-muted)',
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ marginBottom: '10px' }}>Relatório do Incidente</h2>

            <div style={{ marginBottom: '18px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <div><b>Incidente:</b> {reportIncident?.type}</div>
              <div><b>Sistema:</b> {reportIncident?.systemAffected}</div>
              <div><b>Criticidade:</b> {reportIncident?.criticality}</div>
              <div><b>Status:</b> {reportIncident?.status}</div>
              <div>
                <b>Data de detecção:</b>{' '}
                {reportIncident?.detectionDate ? new Date(reportIncident.detectionDate).toLocaleString('pt-BR') : '-'}
              </div>
              <div>
                <b>Data de resolução:</b>{' '}
                {reportIncident?.resolutionDate ? new Date(reportIncident.resolutionDate).toLocaleString('pt-BR') : '-'}
              </div>
              <div><b>Responsável:</b> {reportIncident?.analysisResponsible?.name || '-'}</div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Impacto</label>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'white',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {reportIncident?.impact || '-'}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Solução / Medidas Corretivas</label>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'white',
                  whiteSpace: 'pre-wrap',
                  minHeight: '120px',
                }}
              >
                {reportIncident?.correctiveMeasures || 'Nenhuma medida corretiva registrada.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn-primary" onClick={closeReportModal} style={{ padding: '10px 14px' }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;