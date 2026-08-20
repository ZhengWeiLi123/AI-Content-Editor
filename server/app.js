import { config } from 'dotenv'
import cors from 'cors'
import express from 'express'
import { checkDatabase, query } from './db.js'

config({ path: ['.env.local', '.env'] })

const app = express()
const port = Number(process.env.SERVER_PORT || 3000)

app.use(cors({ origin: true }))
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', async (_request, response, next) => {
  try {
    await checkDatabase()
    response.json({ ok: true, database: 'connected' })
  } catch (error) { next(error) }
})

app.get('/api/topics', async (_request, response, next) => {
  try { response.json(await query('SELECT * FROM topics ORDER BY created_at DESC')) } catch (error) { next(error) }
})
app.post('/api/topics', async (request, response, next) => {
  try {
    const { title, direction = '', reason = '', status = 'candidate' } = request.body
    if (!title?.trim()) return response.status(400).json({ message: '选题标题不能为空' })
    const result = await query('INSERT INTO topics (title, direction, reason, status) VALUES (?, ?, ?, ?)', [title.trim(), direction, reason, status])
    response.status(201).json({ id: result.insertId })
  } catch (error) { next(error) }
})

app.get('/api/articles', async (_request, response, next) => {
  try { response.json(await query('SELECT * FROM articles ORDER BY updated_at DESC')) } catch (error) { next(error) }
})
app.post('/api/articles', async (request, response, next) => {
  try {
    const { topicId = null, title, body = '', tags = [], status = 'draft' } = request.body
    if (!title?.trim()) return response.status(400).json({ message: '文章标题不能为空' })
    const result = await query('INSERT INTO articles (topic_id, title, body, tags, status) VALUES (?, ?, ?, ?, ?)', [topicId, title.trim(), body, JSON.stringify(tags), status])
    response.status(201).json({ id: result.insertId })
  } catch (error) { next(error) }
})
app.put('/api/articles/:id', async (request, response, next) => {
  try {
    const { title, body = '', tags = [], status = 'draft' } = request.body
    await query('UPDATE articles SET title = ?, body = ?, tags = ?, status = ? WHERE id = ?', [title, body, JSON.stringify(tags), status, request.params.id])
    response.json({ ok: true })
  } catch (error) { next(error) }
})

app.post('/api/reviews', async (request, response, next) => {
  try {
    const { articleId = null, result } = request.body
    if (!result) return response.status(400).json({ message: '审核结果不能为空' })
    const saved = await query('INSERT INTO review_results (article_id, score, result_json) VALUES (?, ?, ?)', [articleId, Number(result.score || 0), JSON.stringify(result)])
    response.status(201).json({ id: saved.insertId })
  } catch (error) { next(error) }
})

app.get('/api/analyses', async (_request, response, next) => {
  try { response.json(await query('SELECT id, file_name, article_count, total_views, interaction_rate, created_at FROM analysis_records ORDER BY created_at DESC LIMIT 20')) } catch (error) { next(error) }
})
app.get('/api/analyses/latest', async (_request, response, next) => {
  try {
    const rows = await query('SELECT id, file_name, result_json, created_at FROM analysis_records ORDER BY created_at DESC LIMIT 1')
    response.json(rows[0] || null)
  } catch (error) { next(error) }
})
app.post('/api/analyses', async (request, response, next) => {
  try {
    const { fileName = '', result } = request.body
    if (!result) return response.status(400).json({ message: '分析结果不能为空' })
    const saved = await query('INSERT INTO analysis_records (file_name, article_count, total_views, interaction_rate, result_json) VALUES (?, ?, ?, ?, ?)', [fileName, Number(result.article_count || 0), Number(result.total_views || 0), Number(result.interaction_rate || 0), JSON.stringify(result)])
    response.status(201).json({ id: saved.insertId })
  } catch (error) { next(error) }
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: '服务器处理失败，请检查 MySQL 是否启动及环境变量配置', detail: process.env.NODE_ENV === 'development' ? error.message : undefined })
})

app.listen(port, () => console.log(`API server: http://localhost:${port}`))
