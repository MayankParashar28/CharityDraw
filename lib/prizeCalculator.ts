interface PrizePoolAllocation {
  total: number
  fiveMatch: number
  fourMatch: number
  threeMatch: number
}

// Assumes $10 average contribution or total dynamic pool. We'll default argument to a static subscription chunk.
export function calculatePrizePools(activeSubscribers: number, totalContributionPerSubscriber: number = 10): PrizePoolAllocation {
  const total = activeSubscribers * totalContributionPerSubscriber
  return {
    total,
    fiveMatch: total * 0.40,
    fourMatch: total * 0.35,
    threeMatch: total * 0.25
  }
}
