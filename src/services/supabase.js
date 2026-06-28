import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)

// Busca configuração do quiz pelo id
export async function buscarQuiz(id) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('config')
    .eq('id', id)
    .single()

  if (error) throw error
  return data.config
}

// Salva sessão do usuário (respostas + diagnóstico)
export async function salvarSessao({ quizId, nome, email, respostas, scores, diagnostico }) {
  const { data, error } = await supabase
    .from('sessoes')
    .insert({
      quiz_id: quizId,
      nome,
      email,
      respostas,
      scores,
      diagnostico,
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// Salva configuração gerada pelo expert
export async function salvarQuiz(id, config) {
  const { error } = await supabase
    .from('quizzes')
    .upsert({ id, config })

  if (error) throw error
  return id
}
