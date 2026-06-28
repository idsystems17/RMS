import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import ExpertPage from './pages/ExpertPage'

export default function App() {
  return (
    <BrowserRouter>
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
          minHeight: '100vh',
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
    </BrowserRouter>
  )
}
