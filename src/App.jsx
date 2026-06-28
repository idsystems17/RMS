import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import ExpertPage from './pages/ExpertPage'

function Layout() {
  const { pathname } = useLocation()
  const isExpert = pathname.startsWith('/expert')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1B2A',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        // Expert usa altura exata da tela sem scroll externo
        height: isExpert ? '100vh' : undefined,
        minHeight: isExpert ? undefined : '100vh',
        overflow: isExpert ? 'hidden' : undefined,
        position: 'relative',
        boxShadow: '0 0 60px rgba(0,0,0,0.5)',
      }}>
        <Routes>
          <Route path="/quiz/:id/*" element={<QuizPage />} />
          <Route path="/expert/*" element={<ExpertPage />} />
          <Route path="*" element={<Navigate to="/quiz/demo" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
