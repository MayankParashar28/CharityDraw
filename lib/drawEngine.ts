import { createServerSupabaseClient } from './supabase'

export function generateRandomNumbers(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    const random = new Uint32Array(1)
    crypto.getRandomValues(random)
    const num = (random[0] % 45) + 1
    numbers.add(num)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export async function generateAlgorithmicNumbers(weightedByMostFrequent: boolean = true): Promise<number[]> {
  const supabase = await createServerSupabaseClient()

  // Find active subscribers
  const { data: activeUsers } = await supabase
    .from('users')
    .select('id')
    .eq('subscription_status', 'active')

  if (!activeUsers || activeUsers.length === 0) {
    return generateRandomNumbers()
  }

  const activeIds = activeUsers.map(u => u.id)

  const { data: scores } = await supabase
    .from('scores')
    .select('score')
    .in('user_id', activeIds)
  
  const frequency: Record<number, number> = {}
  for (let i = 1; i <= 45; i++) frequency[i] = 0
  
  scores?.forEach(s => {
    frequency[s.score]++
  })

  let candidates = []
  for (let i = 1; i <= 45; i++) {
    // If weighted by least frequent, weight is inverse of frequency (+1 to avoid div by zero)
    let weight = weightedByMostFrequent ? (frequency[i] + 1) : 1 / (frequency[i] + 1)
    candidates.push({ value: i, weight })
  }

  const selected = new Set<number>()
  while (selected.size < 5) {
    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0)
    let random = Math.random() * totalWeight
    for (let c of candidates) {
      if (random < c.weight) {
        selected.add(c.value)
        // Remove picked candidate
        candidates = candidates.filter(cand => cand.value !== c.value)
        break
      }
      random -= c.weight
    }
  }

  return Array.from(selected).sort((a, b) => a - b)
}

export function countMatches(userNumbers: number[], winningNumbers: number[]): number {
  return userNumbers.filter(n => winningNumbers.includes(n)).length
}
