import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { useQuiz } from '../../contexts/QuizContext'
import Button from '../ui/Button'

export default function ResultScreen({ config }) {
  const { userData, scores, diagnostico } = useQuiz()

  const areas = config?.areas || [
    { id: 'prosperidade', nome: 'Prosperidade' },
    { id: 'blindagem', nome: 'Blindagem Emocional' },
    { id: 'performance', nome: 'Performance' },
    { id: 'superacao', nome: 'Superação de Ciclos' },
  ]

  const dadosRadar = areas.map(area => ({
    area: area.nome,
    valor: scores[area.id] || 0,
    fullMark: 100,
  }))

  const menorArea = dadosRadar.reduce((menor, atual) =>
    atual.valor < menor.valor ? atual : menor, dadosRadar[0])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col min-h-screen max-w-md mx-auto px-6 py-10"
    >
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest">
          Diagnóstico Personalizado
        </span>
        <h1 className="text-2xl font-bold text-[#F0F4F8] mt-2 mb-3">
          {userData.nome}, seu perfil RMS é único.
        </h1>
        <p className="text-[#8BA4C0] text-sm leading-relaxed">
          Das pessoas que fizeram esse diagnóstico,<br />
          nenhuma tem exatamente essa combinação.
        </p>
      </div>

      {/* Gráfico Radar */}
      <div className="w-full h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={dadosRadar}>
            <PolarGrid stroke="#1E3A5F" />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fill: '#8BA4C0', fontSize: 11 }}
            />
            <Radar
              name="Perfil"
              dataKey="valor"
              stroke="#C9A84C"
              fill="#C9A84C"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Scores por área */}
      <div className="space-y-3 mb-8">
        {dadosRadar.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#8BA4C0]">{item.area}</span>
              <span className="text-[#C9A84C] font-semibold">{item.valor}%</span>
            </div>
            <div className="h-1.5 bg-[#1E3A5F] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#C9A84C]"
                initial={{ width: 0 }}
                animate={{ width: `${item.valor}%` }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Diagnóstico */}
      <div className="bg-[#112238] border border-[#1E3A5F] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#C9A84C]">◈</span>
          <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest">
            Seu diagnóstico
          </span>
        </div>
        <p className="text-[#F0F4F8] text-sm leading-relaxed whitespace-pre-line">
          {diagnostico || `${userData.nome}, sua análise revela um padrão muito específico que poucos conseguem identificar com essa clareza. A área de ${menorArea?.area} pede atenção prioritária — é onde o trabalho mais profundo de reprogramação pode acontecer.`}
        </p>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Button
          onClick={() => window.open(config?.metodo?.cta_link || '#', '_blank')}
        >
          {config?.metodo?.cta_texto || 'Quero transformar meu perfil →'}
        </Button>
        <p className="text-[#4A6A8A] text-xs text-center">
          Resultado enviado para {userData.email}
        </p>
      </div>
    </motion.div>
  )
}
