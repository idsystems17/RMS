import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { useQuiz } from '../../contexts/QuizContext'

const AREAS_META = [
  { id: 'prosperidade', nome: 'Prosperidade' },
  { id: 'blindagem', nome: 'Blindagem\nEmocional' },
  { id: 'performance', nome: 'Performance\nde Elite' },
  { id: 'superacao', nome: 'Superação\nde Ciclos' },
]

export default function ResultScreen({ config }) {
  const { userData, scores, diagnostico, respostas } = useQuiz()

  const dadosRadar = AREAS_META.map(a => ({
    area: a.nome,
    valor: scores[a.id] ?? 0,
    fullMark: 100,
  }))

  const sorted = [...AREAS_META].map(a => ({ ...a, valor: scores[a.id] ?? 0 }))
  const critica = sorted.reduce((m, a) => a.valor < m.valor ? a : m, sorted[0])
  const forte = sorted.reduce((m, a) => a.valor > m.valor ? a : m, sorted[0])

  // Pega texto livre se houver
  const textoLivre = respostas.find(r => r.textoLivre)?.textoLivre || ''

  const diagnosticoTexto = diagnostico || `${userData.nome}, sua análise revela um padrão muito específico que poucos conseguem identificar com essa clareza. A área de ${critica.nome.replace('\n', ' ')} pede atenção prioritária — é onde o trabalho mais profundo de reprogramação pode acontecer.`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#0D1B2A', minHeight: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header dark */}
      <div style={{ padding: '1.5rem 1.75rem 1.25rem', textAlign: 'center' }}>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#C9A84C', marginBottom: 6 }}>
          Diagnóstico exclusivo
        </p>
        <p style={{ fontSize: 20, fontWeight: 600, color: '#F0F4F8', marginBottom: 4 }}>
          {userData.nome}, seu perfil RMS está pronto
        </p>
        <p style={{ fontSize: 13, color: 'rgba(240,244,248,0.55)' }}>
          Nenhuma pessoa tem exatamente essa combinação.
        </p>
      </div>

      {/* Radar */}
      <div style={{ padding: '0 2rem', display: 'flex', justifyContent: 'center' }}>
        <ResponsiveContainer width={220} height={220}>
          <RadarChart data={dadosRadar} style={{ margin: '0 auto' }}>
            <PolarGrid stroke="rgba(240,244,248,0.1)" />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fill: 'rgba(240,244,248,0.7)', fontSize: 11, whiteSpace: 'pre' }}
            />
            <Radar
              dataKey="valor"
              stroke="#C9A84C"
              fill="#C9A84C"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 5, fill: '#C9A84C', stroke: '#0D1B2A', strokeWidth: 2 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Corpo claro */}
      <div style={{ background: '#F5F3EE', borderRadius: '24px 24px 0 0', marginTop: '1.5rem', padding: '1.5rem 1.75rem 2.5rem', flex: 1 }}>

        {/* Chips 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
          <div style={{ background: '#FFFBF0', border: '1.5px solid #F0A500', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 10, color: 'rgba(26,35,50,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Área crítica</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#C9A84C' }}>{critica.valor}</div>
            <div style={{ fontSize: 11, color: '#4A5568', marginTop: 2, lineHeight: 1.3 }}>{critica.nome.replace('\n', ' ')}</div>
          </div>
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 10, color: 'rgba(26,35,50,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Ponto forte</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A2332' }}>{forte.valor}</div>
            <div style={{ fontSize: 11, color: '#4A5568', marginTop: 2, lineHeight: 1.3 }}>{forte.nome.replace('\n', ' ')}</div>
          </div>
          {sorted.filter(a => a.id !== critica.id && a.id !== forte.id).map(area => (
            <div key={area.id} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 10, color: 'rgba(26,35,50,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{area.nome.replace('\n', ' ')}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1A2332' }}>{area.valor}</div>
            </div>
          ))}
        </div>

        {/* Diagnóstico */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, borderLeft: '3px solid #C9A84C', marginBottom: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1E3A5F', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Sua área de maior urgência
          </p>
          <p style={{ fontSize: 13, color: '#1A2332', lineHeight: 1.65 }}>
            {diagnosticoTexto}
            {textoLivre && (
              <>
                <br /><br />
                Você mesmo me disse: <em style={{ color: '#1E3A5F' }}>"{textoLivre}"</em> Esse padrão tem origem. E tem solução.
              </>
            )}
          </p>
        </div>

        {/* CTA box */}
        <div style={{ background: '#1E3A5F', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <p style={{ fontSize: 10, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Próximo passo
          </p>
          <p style={{ fontSize: 13, color: 'rgba(240,244,248,0.85)', lineHeight: 1.6 }}>
            {config?.metodo?.cta_texto || 'A sessão de mentoria RMS é o espaço onde trabalhamos esse padrão diretamente na raiz — sem força de vontade, sem esforço repetido.'}
          </p>
        </div>

        <button
          onClick={() => window.open(config?.metodo?.cta_link || '#', '_blank')}
          style={{ width: '100%', background: '#C9A84C', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 0.2, transition: 'opacity 0.2s' }}
          onMouseOver={e => e.target.style.opacity = '0.88'}
          onMouseOut={e => e.target.style.opacity = '1'}
        >
          Quero minha sessão de mentoria →
        </button>
        <p style={{ fontSize: 11, color: 'rgba(26,35,50,0.4)', textAlign: 'center', marginTop: 10 }}>
          Resultado enviado para {userData.email} · Vagas limitadas por agenda
        </p>
      </div>
    </motion.div>
  )
}
