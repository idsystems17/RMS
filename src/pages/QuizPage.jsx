import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuizProvider, useQuiz } from '../contexts/QuizContext'
import WelcomeScreen from '../components/quiz/WelcomeScreen'
import QuestionScreen from '../components/quiz/QuestionScreen'
import ProcessingScreen from '../components/quiz/ProcessingScreen'
import ResultScreen from '../components/quiz/ResultScreen'
import { CONFIG_DEMO } from '../services/demoConfig'
import { gerarDiagnostico } from '../services/geminiApi'

const ETAPA = { BOAS_VINDAS: 'boas_vindas', QUIZ: 'quiz', PROCESSANDO: 'processando', RESULTADO: 'resultado' }

function QuizFlow({ config }) {
  const [etapa, setEtapa] = useState(ETAPA.BOAS_VINDAS)
  const [areaAtual, setAreaAtual] = useState(0)
  const { userData, respostas, registrarResposta, calcularScores, setDiagnostico } = useQuiz()

  const areas = config.areas || []

  const totalPerguntas = areas.reduce((s, a) => s + (a.perguntas?.length || 0), 0)
  const perguntasAnteriores = areas.slice(0, areaAtual).reduce((s, a) => s + (a.perguntas?.length || 0), 0)
  const progresso = {
    base: totalPerguntas > 0 ? Math.round((perguntasAnteriores / totalPerguntas) * 90) : 0,
    passo: totalPerguntas > 0 ? Math.round(((areas[areaAtual]?.perguntas?.length || 0) / totalPerguntas) * 90) : 0,
  }

  function avancarArea() {
    if (areaAtual + 1 >= areas.length) {
      setEtapa(ETAPA.PROCESSANDO)
    } else {
      setAreaAtual(i => i + 1)
    }
  }

  async function chamarIA() {
    const scoresFinal = calcularScores()
    try {
      const texto = await gerarDiagnostico({
        config,
        userData,
        respostas,
        scores: scoresFinal,
      })
      setDiagnostico(texto)
    } catch (err) {
      console.error('Erro ao gerar diagnóstico:', err)
      setDiagnostico('')
    }
    setEtapa(ETAPA.RESULTADO)
  }

  return (
    <div style={{ background: '#0D1B2A', minHeight: '100vh' }}>
      {etapa === ETAPA.BOAS_VINDAS && (
        <WelcomeScreen config={config} onStart={() => setEtapa(ETAPA.QUIZ)} />
      )}
      {etapa === ETAPA.QUIZ && areas[areaAtual] && (
        <QuestionScreen
          perguntas={areas[areaAtual].perguntas}
          areaId={areas[areaAtual].id}
          areaNome={areas[areaAtual].nome}
          indiceArea={areaAtual}
          totalAreas={areas.length}
          progresso={progresso}
          onResponder={registrarResposta}
          onConcluir={avancarArea}
        />
      )}
      {etapa === ETAPA.PROCESSANDO && (
        <ProcessingScreen onConcluido={chamarIA} />
      )}
      {etapa === ETAPA.RESULTADO && (
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
