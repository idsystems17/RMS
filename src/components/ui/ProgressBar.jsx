export default function ProgressBar({ progresso, nome }) {
  const frases = [
    { limite: 15, texto: 'Entendendo seus padrões...' },
    { limite: 40, texto: 'Identificando suas raízes...' },
    { limite: 70, texto: 'Seu perfil está se formando...' },
    { limite: 95, texto: 'Quase lá...' },
    { limite: 100, texto: `Análise concluída, ${nome}.` },
  ]

  const frase = frases.find(f => progresso <= f.limite)?.texto || `Análise concluída, ${nome}.`

  return (
    <div className="w-full px-6 pt-6 pb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-[#8BA4C0] font-medium tracking-wide">{frase}</span>
        <span className="text-xs text-[#C9A84C] font-semibold">{progresso}%</span>
      </div>
      <div className="w-full h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progresso}%`,
            background: 'linear-gradient(90deg, #1E3A5F, #C9A84C)',
          }}
        />
      </div>
    </div>
  )
}
