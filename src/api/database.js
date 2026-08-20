import axios from 'axios'

const databaseClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 8000,
})

export const databaseApi = {
  getTopics: () => databaseClient.get('/topics').then(({ data }) => data),
  saveTopic: (topic) => databaseClient.post('/topics', topic).then(({ data }) => data),
  getArticles: () => databaseClient.get('/articles').then(({ data }) => data),
  saveArticle: (article) => databaseClient.post('/articles', article).then(({ data }) => data),
  updateArticle: (id, article) => databaseClient.put(`/articles/${id}`, article).then(({ data }) => data),
  saveReview: (payload) => databaseClient.post('/reviews', payload).then(({ data }) => data),
  getAnalyses: () => databaseClient.get('/analyses').then(({ data }) => data),
  getLatestAnalysis: () => databaseClient.get('/analyses/latest').then(({ data }) => data),
  saveAnalysis: (payload) => databaseClient.post('/analyses', payload).then(({ data }) => data),
}
