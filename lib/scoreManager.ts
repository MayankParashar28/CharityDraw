import { createServerSupabaseClient } from './supabase'

export async function addScore(userId: string, targetScore: number, playedOn: string) {
  const supabase = await createServerSupabaseClient()

  if (targetScore < 1 || targetScore > 45) {
    throw new Error('Score must be between 1 and 45')
  }

  const playedDate = new Date(playedOn)
  const today = new Date()
  if (playedDate > today) {
    throw new Error('Played date cannot be in the future')
  }

  const { data: scores, error: fetchError } = await supabase
    .from('scores')
    .select('id, played_on')
    .eq('user_id', userId)
    .order('played_on', { ascending: true })

  if (fetchError) throw fetchError

  if (scores && scores.length >= 5) {
    const toDeleteCount = scores.length - 4
    const oldestScores = scores.slice(0, toDeleteCount)
    const oldestScoreIds = oldestScores.map(s => s.id)

    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .in('id', oldestScoreIds)

    if (deleteError) throw deleteError
  }

  const { data, error: insertError } = await supabase
    .from('scores')
    .insert({
      user_id: userId,
      score: targetScore,
      played_on: playedOn
    })
    .select()
    .single()

  if (insertError) throw insertError

  return data
}
