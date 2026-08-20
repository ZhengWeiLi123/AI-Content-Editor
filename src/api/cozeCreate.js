import axios from 'axios'

const cozeClient = axios.create({
  baseURL: import.meta.env.VITE_COZE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_COZE_TOKEN}`,
  },
})

export async function runCreateWorkflow(input) {
  if (!input || !input.trim()) {
    throw new Error('创作输入不能为空')
  }

  const response = await cozeClient.post(
    '/v1/workflow/run',
    {
      workflow_id: '7675378504804876315',

      parameters: {
        input: input.trim(),
      },

      connector_id: 1024,
    },
  )

  console.log('Coze创作完整响应：', response.data)

  if (response.data?.code !== 0) {
    throw new Error(
      response.data?.msg ||
        `Coze创作工作流调用失败：${response.data?.code}`,
    )
  }

  let workflowData = response.data?.data

  if (typeof workflowData === 'string') {
    try {
      workflowData = JSON.parse(workflowData)
    } catch {
      throw new Error(
        'Coze创作工作流返回数据解析失败',
      )
    }
  }

  const output = workflowData?.output

  if (!output) {
    throw new Error(
      'Coze创作工作流返回结果中没有找到 output',
    )
  }

  return output
}