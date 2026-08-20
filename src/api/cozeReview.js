import axios from 'axios'

const cozeClient = axios.create({
  baseURL: import.meta.env.VITE_COZE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_COZE_TOKEN}`,
  },
})

export async function runReviewWorkflow(input) {
  if (!input || !input.trim()) {
    throw new Error('审核内容不能为空')
  }

  const response = await cozeClient.post(
    '/v1/workflow/run',
    {
      workflow_id: '7675381158985252864',

      parameters: {
        input: input.trim(),
      },

      connector_id: 1024,
    },
  )

  console.log(
    'Coze审核完整响应：',
    response.data,
  )

  if (response.data?.code !== 0) {
    throw new Error(
      response.data?.msg ||
        `Coze审核工作流调用失败：${response.data?.code}`,
    )
  }

  let workflowData = response.data?.data

  if (typeof workflowData === 'string') {
    try {
      workflowData = JSON.parse(workflowData)
    } catch {
      throw new Error(
        'Coze审核工作流返回数据解析失败',
      )
    }
  }

  const output = workflowData?.output

  if (!output) {
    throw new Error(
      'Coze审核工作流返回结果中没有找到 output',
    )
  }

  return output
}