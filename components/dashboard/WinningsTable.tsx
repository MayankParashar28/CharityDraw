'use client'

import { useState, useEffect } from 'react'
import { Table, Tag, Button, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { createBrowserClient } from '@supabase/ssr'

export default function WinningsTable() {
  const [winnings, setWinnings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchWinnings = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('winners')
        .select('*, draws(draw_date)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setWinnings(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWinnings()
  }, [])

  const customUpload = async (options: any, record: any) => {
    const { file, onSuccess, onError } = options
    const fileExt = file.name.split('.').pop()
    const fileName = `${record.id}-${Math.random()}.${fileExt}`
    const filePath = `proofs/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage.from('winner-proofs').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('winner-proofs').getPublicUrl(filePath)
      
      const { error: updateError } = await supabase.from('winners').update({ proof_url: publicUrl }).eq('id', record.id)
      if (updateError) throw updateError

      message.success('Proof uploaded successfully! Awaiting review.')
      onSuccess('Ok')
      fetchWinnings()
    } catch (e: any) {
      onError({ error: e })
      message.error(`Upload failed: ${e.message}`)
    }
  }

  const columns = [
    {
      title: 'Draw Date',
      dataIndex: ['draws', 'draw_date'],
      key: 'date',
    },
    {
      title: 'Tier',
      dataIndex: 'prize_tier',
      key: 'tier',
    },
    {
      title: 'Amount',
      dataIndex: 'prize_amount',
      key: 'amount',
      render: (val: number) => <span className="text-green-600 font-bold">${val?.toFixed(2)}</span>
    },
    {
      title: 'Status',
      dataIndex: 'verification_status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'
        return <Tag color={color}>{status?.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => {
        if (record.verification_status === 'pending' && !record.proof_url) {
          return (
            <Upload customRequest={(options) => customUpload(options, record)} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Proof</Button>
            </Upload>
          )
        }
        if (record.proof_url) {
          return <span className="text-gray-500 text-sm">Proof Submitted</span>
        }
        return null
      }
    }
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Winnings</h2>
      <Table 
        columns={columns} 
        dataSource={winnings} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}
