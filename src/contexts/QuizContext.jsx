import { createContext, useContext, useState } from 'react'

const QuizContext = createContext(null)

export function QuizProvider({ children }) {
  const [userData, setUserData] = useState({ nome: '', email: '' })
  const [respostas, setRespostas] = useState([])
  const [scores, setScores] = useState({})
  const [diagnostico, setDiagnostico] = useState('')
  const [quizConfig, setQuizConfig] = useState(null)

  function registrarResposta(resposta) {
    setRespostas(prev => [...prev, resposta])
  }

  function calcularScores() {
    const totais = {}
    respostas.forEach(r => {
      if (!totais[r.area]) totais[r.area] = { soma: 0, total: 0 }
      totais[r.area].soma += r.pontuacao
      totais[r.area].total += 3 // pontuação máxima por pergunta
    })
    const resultado = {}
    Object.keys(totais).forEach(area => {
      resultado[area] = Math.round((totais[area].soma / totais[area].total) * 100)
    })
    setScores(resultado)
    return resultado
  }

  return (
    <QuizContext.Provider value={{
      userData, setUserData,
      respostas, registrarResposta,
      scores, calcularScores,
      diagnostico, setDiagnostico,
      quizConfig, setQuizConfig,
    }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz deve estar dentro de QuizProvider')
  return ctx
}
