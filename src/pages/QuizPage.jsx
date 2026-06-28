import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { QuizProvider, useQuiz } from '../contexts/QuizContext'
import WelcomeScreen from '../components/quiz/WelcomeScreen'
import QuestionScreen from '../components/quiz/QuestionScreen'
import ProcessingScreen from '../components/quiz/ProcessingScreen'
import ResultScreen from '../components/quiz/ResultScreen'
import { CONFIG_DEMO } from '../services/demoConfig'
import { gerarDiagnostico } from '../services/geminiApi'
import { buscarQuiz, salvarSessao } from '../services/supabase'

const ETAPA = { BOAS_VINDAS: 'boas_vindas', QUIZ: 'quiz', PROCESSANDO: 'processando', RESULTADO: 'resultado' }

function QuizFlow({ config, quizId }) {
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
    let texto = ''

    try {
      texto = await gerarDiagnostico({ config, userData, respostas, scores: scoresFinal })
      setDiagnostico(texto)
    } catch (err) {
      console.error('Erro ao gerar diagnóstico:', err)
    }

    // Salva sessão no Supabase em background — não bloqueia o resultado
    salvarSessao({
      quizId,
      nome: userData.nome,
      email: userData.email,
      respostas,
      scores: scoresFinal,
      diagnostico: texto,
    }).catch(err => console.error('Erro ao salvar sessão:', err))

    setEtapa(ETAPA.RESULTADO)
  }

  return (
    <div style={{ background: '#0D1B2A', minHeight: '100vh' }}>
      {etapa === ETAPA.BOAS_VINDAS && (
        <WelcomeScreen config={config} onStart={() => setEtapa(ETAPA.QUIZ)} />
      )}
      {etapa === ETAPA.QUIZ && areas[areaAtual] && (
        <QuestionScreen
          key={areaAtual}
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
  const [config, setConfig] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      if (id === 'demo') {
        setConfig(CONFIG_DEMO)
        setCarregando(false)
        return
      }
      try {
        const cfg = await buscarQuiz(id)
        setConfig(cfg)
      } catch {
        // Quiz não encontrado — usa demo como fallback
        setConfig(CONFIG_DEMO)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#C9A84C', fontSize: 28 }}>◈</span>
      </div>
    )
  }

  return (
    <QuizProvider>
      <QuizFlow config={config} quizId={id} />
    </QuizProvider>
  )
}
