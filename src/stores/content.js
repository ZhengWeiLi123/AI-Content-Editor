import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContentStore = defineStore('content', () => {
  const selectedTopic = ref('')
  const generatedTopics = ref([])

  const currentArticle = ref({
    title: '',
    body: '',
    tags: [],
    interaction: '',
  })

  const articleStatus = ref('draft')

  const reviewResult = ref({
    score: 0,
    completeness: 0,
    value: 0,
    readability: 0,
    potential: 0,
    credibility: 0,
    conclusion: '',
    risks: [],
    problems: [],
    suggestions: [],
  })

  function setSelectedTopic(topic) {
    selectedTopic.value = topic
  }

  function setGeneratedTopics(topics) {
    generatedTopics.value = topics
  }

  function setCurrentArticle(article) {
    currentArticle.value = {
      ...currentArticle.value,
      ...article,
    }
  }

  function setReviewResult(result) {
    reviewResult.value = {
      ...reviewResult.value,
      ...result,
    }
  }

  function setArticleStatus(status) {
    articleStatus.value = status
  }

  function resetReviewResult() {
    reviewResult.value = {
      score: 0,
      completeness: 0,
      value: 0,
      readability: 0,
      potential: 0,
      credibility: 0,
      conclusion: '',
      risks: [],
      problems: [],
      suggestions: [],
    }
  }

  return {
    selectedTopic,
    generatedTopics,
    currentArticle,
    articleStatus,
    reviewResult,

    setSelectedTopic,
    setGeneratedTopics,
    setCurrentArticle,
    setReviewResult,
    setArticleStatus,
    resetReviewResult,
  }
})