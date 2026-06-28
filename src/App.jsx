import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import ExpertPage from './pages/ExpertPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz/:id/*" element={<QuizPage />} />
        <Route path="/expert/*" element={<ExpertPage />} />
        <Route path="*" element={<Navigate to="/quiz/demo" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
