import axios from 'axios'

const cozeClient = axios.create({
  baseURL: import.meta.env.VITE_COZE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_COZE_TOKEN}`,
  },
})

export async function runAnalyticsWorkflow(data) {
  if (!data || !data.trim()) {
    throw new Error('数据内容不能为空')
  }

  const response = await cozeClient.post(
    '/v1/workflow/run',
    {
      workflow_id:
        '7675390249362931746',

      parameters: {
        data: data.trim(),
      },

      connector_id: 1024,
    },
  )

  console.log(
    'Coze数据分析完整响应：',
    response.data,
  )

  if (response.data?.code !== 0) {
    throw new Error(
      response.data?.msg ||
        `Coze数据分析工作流调用失败：${response.data?.code}`,
    )
  }

  let workflowData = response.data?.data

  if (typeof workflowData === 'string') {
    try {
      workflowData =
        JSON.parse(workflowData)
    } catch {
      throw new Error(
        'Coze数据分析返回数据解析失败',
      )
    }
  }

  if (
    !workflowData ||
    typeof workflowData !== 'object'
  ) {
    throw new Error(
      'Coze数据分析没有返回有效数据',
    )
  }

  console.log(
    'Coze结构化分析结果：',
    workflowData,
  )

  return workflowData
}