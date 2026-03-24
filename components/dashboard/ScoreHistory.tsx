'use client'

import { Table } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface ScoreHistoryProps {
  scores: Array<{ id: string; score: number; played_on: string }>
  loading: boolean
}

export default function ScoreHistory({ scores, loading }: ScoreHistoryProps) {
  const columns = [
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (text: number) => <span className="font-semibold text-blue-600">{text}</span>
    },
    {
      title: 'Date Played',
      dataIndex: 'played_on',
      key: 'played_on',
      render: (text: string) => dayjs(text).format('MMM D, YYYY')
    },
    {
      title: 'Time Ago',
      key: 'time_ago',
      render: (_: any, record: any) => <span className="text-gray-500">{dayjs(record.played_on).fromNow()}</span>
    }
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Last 5 Scores</h2>
      <Table 
        columns={columns} 
        dataSource={scores} 
        rowKey="id" 
        pagination={false} 
        loading={loading}
      />
      {scores.length < 5 && (
        <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
          You have {scores.length} score(s). You need 5 scores to enter the draw.
        </div>
      )}
    </div>
  )
}
