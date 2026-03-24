'use client'

import { useState } from 'react'
import { Form, InputNumber, DatePicker, Button, message } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export default function ScoreEntryForm({ onScoreAdded }: { onScoreAdded: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const playedOn = (values.playedOn as Dayjs).format('YYYY-MM-DD')
      const res = await fetch('/api/scores/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: values.score,
          playedOn: playedOn
        })
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      message.success('Score added successfully!')
      form.resetFields()
      onScoreAdded()
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter New Score</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
          name="score" 
          label="Score (1-45)" 
          rules={[
            { required: true, message: 'Please input your score!' },
            { type: 'number', min: 1, max: 45, message: 'Must be between 1 and 45' }
          ]}
        >
          <InputNumber className="w-full" size="large" />
        </Form.Item>
        <Form.Item 
          name="playedOn" 
          label="Date Played" 
          rules={[{ required: true, message: 'Please select the date!' }]}
        >
          <DatePicker 
            className="w-full" 
            size="large" 
            disabledDate={(current) => current && current.valueOf() > Date.now()}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          Submit Score
        </Button>
      </Form>
    </div>
  )
}
