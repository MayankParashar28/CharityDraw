'use client'

import { useState } from 'react'
import { Select, Button, message, Divider, Statistic, Row, Col } from 'antd'

export default function DrawSimulator() {
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [drawType, setDrawType] = useState('random')
  const [simulation, setSimulation] = useState<any>(null)

  const handleSimulate = async () => {
    setLoading(true)
    setSimulation(null)
    try {
      const res = await fetch('/api/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: drawType })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setSimulation(data)
      message.success('Simulation ran efficiently')
    } catch (e: any) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!simulation) return
    setPublishing(true)
    try {
      const res = await fetch('/api/draws/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: drawType,
          winningNumbers: simulation.winningNumbers
        })
      })
      if (!res.ok) throw new Error(await res.text())
      message.success('Draw officially published!')
      setSimulation(null)
    } catch (e: any) {
      message.error(e.message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Launch a New Draw</h2>
      <div className="flex gap-4 items-end mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Draw Type Engine</label>
          <Select 
            className="w-full"
            value={drawType} 
            onChange={setDrawType}
            size="large"
            options={[
              { value: 'random', label: '100% Pure Random' },
              { value: 'algorithmic', label: 'Algorithmic (Frequency Weighted)' },
            ]}
          />
        </div>
        <Button size="large" type="default" onClick={handleSimulate} loading={loading}>
          Run Simulation
        </Button>
      </div>

      {simulation && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              Simulation Results Ready
            </h3>
            <div className="flex gap-2">
              {simulation.winningNumbers.map((num: number, i: number) => (
                <span key={i} className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg border border-purple-200 shadow-sm">
                  {num}
                </span>
              ))}
            </div>
          </div>

          <Row gutter={16} className="mb-6">
            <Col span={8}>
              <Statistic title="Total Pool" value={simulation.pools?.total} precision={2} prefix="$" />
            </Col>
            <Col span={8}>
              <Statistic title="Jackpot (5 Matches)" value={simulation.pools?.fiveMatch} precision={2} prefix="$" valueStyle={{ color: '#cf1322' }} />
            </Col>
            <Col span={8}>
              <Statistic title="3 Match Tier" value={simulation.pools?.threeMatch} precision={2} prefix="$" />
            </Col>
          </Row>

          <Divider />

          <Row gutter={16} className="mb-6">
            <Col span={8}>
              <Statistic title="5-Match Winners" value={simulation.simulatedWinners?.fiveMatch} />
            </Col>
            <Col span={8}>
              <Statistic title="4-Match Winners" value={simulation.simulatedWinners?.fourMatch} />
            </Col>
            <Col span={8}>
              <Statistic title="3-Match Winners" value={simulation.simulatedWinners?.threeMatch} />
            </Col>
          </Row>

          <Button type="primary" size="large" danger onClick={handlePublish} loading={publishing} className="w-full h-12 text-lg font-semibold shadow-md cursor-pointer hover:shadow-lg transition">
            CONFIRM & PUBLISH DRAW OFFICIALLY
          </Button>
        </div>
      )}
    </div>
  )
}
