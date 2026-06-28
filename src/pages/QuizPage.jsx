import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuizProvider, useQuiz } from '../contexts/QuizContext'
import WelcomeScreen from '../components/quiz/WelcomeScreen'
import QuestionScreen from '../components/quiz/QuestionScreen'
import ProcessingScreen from '../components/quiz/ProcessingScreen'
import ResultScreen from '../components/quiz/ResultScreen'
import { CONFIG_DEMO } from '../services/demoConfig'

const ETAPAS = { BOAS_VINDAS: 'boas_vindas', QUIZ: 'quiz', PROCESSANDO: 'processando', RESULTADO: 'resultado' }

function QuizFlow({ config }) {
  const [etapa, setEtapa] = useState(ETAPAS.BOAS_VINDAS)
  const [areaAtual, setAreaAtual] = useState(0)
  const { registrarResposta, calcularScores, setDiagnostico } = useQuiz()

  const areas = config.areas || []

  function avancarArea() {
    if (areaAtual + 1 >= areas.length) {
      setEtapa(ETAPAS.PROCESSANDO)
    } else {
      setAreaAtual(i => i + 1)
    }
  }

  async function gerarDiagnostico() {
    const scoresFinal = calcularScores()
    // TODO: chamar Claude API / Gemini API com as respostas
    // Por ora usa texto placeholder
    setDiagnostico('')
    setEtapa(ETAPAS.RESULTADO)
  }

  const totalPerguntas = areas.reduce((s, a) => s + (a.perguntas?.length || 0), 0)
  const perguntasAnteriores = areas.slice(0, areaAtual).reduce((s, a) => s + (a.perguntas?.length || 0), 0)
  const progresso = {
    base: Math.round((perguntasAnteriores / totalPerguntas) * 90),
    passo: Math.round(((areas[areaAtual]?.perguntas?.length || 0) / totalPerguntas) * 90),
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {etapa === ETAPAS.BOAS_VINDAS && (
        <WelcomeScreen config={config} onStart={() => setEtapa(ETAPAS.QUIZ)} />
      )}
      {etapa === ETAPAS.QUIZ && areas[areaAtual] && (
        <QuestionScreen
          perguntas={areas[areaAtual].perguntas}
          areaId={areas[areaAtual].id}
          areaNome={areas[areaAtual].nome}
          progresso={progresso}
          onResponder={registrarResposta}
          onConcluir={avancarArea}
        />
      )}
      {etapa === ETAPAS.PROCESSANDO && (
        <ProcessingScreen onConcluido={gerarDiagnostico} />
      )}
      {etapa === ETAPAS.RESULTADO && (
        <ResultScreen config={config} />
      )}
    </div>
  )
}

export default function QuizPage() {
  const { id } = useParams()
  // TODO: buscar config do Firebase pelo id
  const config = CONFIG_DEMO

  return (
    <QuizProvider>
      <QuizFlow config={config} />
    </QuizProvider>
  )
}
