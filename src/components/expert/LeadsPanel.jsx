import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../services/supabase'

export default function LeadsPanel() {
  const [leads, setLeads] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from('sessoes')
        .select('nome, email, scores, criado_em')
        .order('criado_em', { ascending: false })

      if (!error) setLeads(data || [])
      setCarregando(false)
    }
    buscar()
  }, [])

  function copiarEmails() {
    const lista = leads.map(l => `${l.nome} <${l.email}>`).join('\n')
    navigator.clipboard.writeText(lista)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function exportarCSV() {
    const header = 'Nome,Email,Data\n'
    const linhas = leads.map(l => {
      const data = new Date(l.criado_em).toLocaleDateString('pt-BR')
      return `"${l.nome}","${l.email}","${data}"`
    }).join('\n')
    const blob = new Blob([header + linhas], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-rms-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ padding: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#F0F4F8' }}>Leads captados</p>
          <p style={{ fontSize: 11, color: 'rgba(240,244,248,0.4)' }}>
            {carregando ? 'Carregando...' : `${leads.length} pessoa${leads.length !== 1 ? 's' : ''} responderam o quiz`}
          </p>
        </div>
        {leads.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={copiarEmails}
              style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '8px 12px', color: '#C9A84C', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}
            >
              {copiado ? '✓ Copiado' : 'Copiar emails'}
            </button>
            <button
              onClick={exportarCSV}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#F0F4F8', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}
            >
              Exportar CSV
            </button>
          </div>
        )}
      </div>

      {/* Lista */}
      {carregando ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C' }}
          />
        </div>
      ) : leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(240,244,248,0.3)' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>◈</p>
          <p style={{ fontSize: 14 }}>Nenhum lead ainda.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Os emails aparecem aqui assim que alguém completar o quiz.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leads.map((lead, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#F0F4F8', marginBottom: 2 }}>{lead.nome}</p>
                <p style={{ fontSize: 12, color: 'rgba(240,244,248,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</p>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(240,244,248,0.3)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {formatarData(lead.criado_em)}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
