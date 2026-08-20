import axios from 'axios'

const cozeClient = axios.create({
  baseURL: import.meta.env.VITE_COZE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_COZE_TOKEN}`,
  },
})

export async function runTopicWorkflow(topic) {
  if (!topic || !topic.trim()) {
    throw new Error('内容方向不能为空')
  }

  const workflowId =
    import.meta.env.VITE_COZE_WORKFLOW_ID

  if (!workflowId?.trim()) {
    throw new Error(
      '智能选题 Workflow ID 未配置，请在 .env.local 中填写 VITE_COZE_WORKFLOW_ID 并重启前端。',
    )
  }

  const response = await cozeClient.post(
    '/v1/workflow/run',
    {
      workflow_id: workflowId.trim(),

      parameters: {
        topic: topic.trim(),
      },

      connector_id: 1024,
    },
  )

  console.log('Coze完整响应：', response.data)

  if (response.data?.code !== 0) {
    throw new Error(
      response.data?.msg ||
        `Coze 工作流调用失败：${response.data?.code}`,
    )
  }

  let workflowData = response.data?.data

  if (typeof workflowData === 'string') {
    try {
      workflowData = JSON.parse(workflowData)
    } catch (error) {
      throw new Error('Coze 返回数据解析失败')
    }
  }

  const output = workflowData?.output

  if (!output) {
    throw new Error('Coze 返回结果中没有找到 output')
  }

  return output
}
