'use client'

import { useState, useEffect } from 'react'
import { Table, Tag, Button, message, Space, Modal } from 'antd'

export default function WinnerVerificationTable() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const fetchWinners = async () => {
    setLoading(true)
    const res = await fetch('/api/winners/list')
    const data = await res.json()
    setWinners(data.winners || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchWinners()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/winners/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId: id, status })
      })
      if (!res.ok) throw new Error('Failed to update')
      message.success(`Winner marked as ${status}`)
      fetchWinners()
    } catch (e: any) {
      message.error(e.message)
    }
  }

  const columns = [
    { title: 'User (Full Name)', dataIndex: ['users', 'full_name'], key: 'user' },
    { title: 'Amount', dataIndex: 'prize_amount', key: 'amount', render: (val: number) => `$${val?.toFixed(2)}` },
    { 
      title: 'Proof', 
      key: 'proof', 
      render: (_: any, record: any) => record.proof_url ? (
        <a onClick={() => { setPreviewImage(record.proof_url); setPreviewOpen(true) }} className="text-blue-500 cursor-pointer">View</a>
      ) : 'None' 
    },
    { 
      title: 'Status', 
      dataIndex: 'verification_status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'pending' ? 'warning' : status === 'approved' ? 'success' : 'error'}>{status}</Tag>
    },
    { 
      title: 'Payment', 
      dataIndex: 'payment_status', 
      key: 'payment',
      render: (status: string) => <Tag color={status === 'paid' ? 'success' : 'default'}>{status}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.verification_status === 'pending' && (
            <>
              <Button size="small" type="primary" className="bg-green-600" onClick={() => updateStatus(record.id, 'approved')}>Approve</Button>
              <Button size="small" danger onClick={() => updateStatus(record.id, 'rejected')}>Reject</Button>
            </>
          )}
          {record.verification_status === 'approved' && record.payment_status === 'pending' && (
            <Button size="small" onClick={() => updateStatus(record.id, 'paid')}>Mark Paid</Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Verification Queue</h2>
      <Table columns={columns} dataSource={winners} rowKey="id" loading={loading} />
      
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="Proof" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}
