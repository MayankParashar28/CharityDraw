'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Switch, message } from 'antd'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const fetchCharities = async () => {
    setLoading(true)
    const res = await fetch('/api/charity/list')
    const data = await res.json()
    setCharities(data.charities || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCharities()
  }, [])

  const handleAdd = async (values: any) => {
    try {
      const res = await fetch('/api/charity/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) throw new Error('Failed to add charity')
      message.success('Charity successfully added to network!')
      setIsModalOpen(false)
      form.resetFields()
      fetchCharities()
    } catch (error: any) {
      message.error(error.message)
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: 'Featured', 
      dataIndex: 'is_featured', 
      key: 'featured',
      render: (val: boolean) => <Switch checked={val || false} disabled />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button type="link">Edit</Button>
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Charity Management</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Add Charity</Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Table columns={columns} dataSource={charities} rowKey="id" loading={loading} />
      </div>

      <Modal title="Add New Charity" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Charity Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
          <Form.Item name="website" label="Website URL"><Input /></Form.Item>
          <Form.Item name="image_url" label="Image URL"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
