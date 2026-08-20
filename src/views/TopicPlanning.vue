<template>
    <div class="topic-page">
      <!-- 页面头部 -->
      <div class="page-heading">
        <div>
          <div class="eyebrow">CONTENT PLANNING</div>
  
          <h1>AI智能选题</h1>
  
          <p>
            输入一个内容方向，让AI帮助你发现下一篇值得创作的内容。
          </p>
        </div>
      </div>
  
      <!-- 输入区域 -->
      <section class="input-panel">
        <div class="input-header">
          <div>
            <h2>告诉AI你想做什么</h2>
            <p>例如：大学生就业、国企秋招、简历优化</p>
          </div>
  
          <span class="ai-label">GLM-4.7</span>
        </div>
  
        <div class="topic-input-wrapper">
          <textarea
            v-model="topicInput"
            placeholder="输入你的内容方向，例如：大学生就业"
            rows="4"
          ></textarea>
  
          <div class="input-footer">
            <span class="input-tip">
              建议输入具体的内容方向
            </span>
  
            <button
              class="generate-button"
              :disabled="!topicInput.trim() || generating"
              @click="generateTopics"
            >
              <span v-if="!generating">✦ 生成选题</span>
              <span v-else>正在生成...</span>
            </button>
          </div>
        </div>
      </section>
  
      <!-- 推荐结果 -->
      <section
        v-if="topics.length"
        class="result-section"
      >
        <div class="section-heading">
          <div>
            <h2>AI推荐选题</h2>
  
            <p>
              根据“{{ currentTopic }}”生成的内容方向
            </p>
          </div>
  
          <span class="result-count">
            {{ topics.length }} 个选题
          </span>
        </div>
  
        <div class="topic-list">
          <article
            v-for="(topic, index) in topics"
            :key="`${topic.title}-${index}`"
            class="topic-card"
          >
            <div class="topic-number">
              {{ String(index + 1).padStart(2, '0') }}
            </div>
  
            <div class="topic-main">
              <h3>{{ topic.title }}</h3>
  
              <div class="reason-label">
                推荐理由
              </div>
  
              <p class="reason">
                {{ topic.reason }}
              </p>
  
              <div class="topic-actions">
                <button
                  class="favorite-button"
                  :class="{ active: topic.favorite }"
                  @click="toggleFavorite(index)"
                >
                  {{
                    topic.favorite
                      ? '★ 已收藏'
                      : '☆ 收藏'
                  }}
                </button>
  
                <button
                  class="create-button"
                  @click="startCreate(topic.title)"
                >
                  开始创作 →
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
  
      <!-- 空状态 -->
      <section
        v-else
        class="empty-panel"
      >
        <div class="empty-icon">✦</div>
  
        <h3>还没有生成选题</h3>
  
        <p>
          在上方输入一个内容方向，AI会为你生成可执行的内容选题。
        </p>
      </section>
    </div>
  </template>
  
  <script setup>
  import {
    computed,
    onMounted,
    ref,
  } from 'vue'
  
  import {
    useRoute,
    useRouter,
  } from 'vue-router'
  
  import { useContentStore } from '../stores/content'
  import { runTopicWorkflow } from '../api/coze'
  
  const route = useRoute()
  const router = useRouter()
  const contentStore = useContentStore()
  
  const topicInput = ref('')
  const generating = ref(false)
  const topics = ref([])
  
  const currentTopic = computed(() => {
    return topicInput.value.trim()
  })
  
  /**
   * 调用 Coze 智能选题工作流
   */
  async function generateTopics() {
    if (!topicInput.value.trim()) {
      return
    }
  
    generating.value = true
  
    try {
      const output = await runTopicWorkflow(
        topicInput.value,
      )
  
      console.log('Coze output：', output)
  
      const parsedTopics = parseTopics(output)
  
      if (!parsedTopics.length) {
        throw new Error(
          'AI返回了内容，但暂时无法解析为选题列表。',
        )
      }
  
      topics.value = parsedTopics
  
      contentStore.setGeneratedTopics(
        parsedTopics,
      )
    } catch (error) {
      console.error(
        'AI选题调用失败：',
        error,
      )
  
      window.alert(
        error?.message ||
          'AI选题服务调用失败，请稍后重试。',
      )
    } finally {
      generating.value = false
    }
  }
  
  /**
   * 解析 Coze 返回的自然语言文本
   *
   * 当前 Coze 输出格式：
   *
   * 选题一：
   * 标题：XXX
   * 一句话推荐理由：XXX
   *
   * 选题二：
   * 标题：XXX
   * 一句话推荐理由：XXX
   *
   * 选题三：
   * 标题：XXX
   * 一句话推荐理由：XXX
   */
  function parseTopics(output) {
    if (
      !output ||
      typeof output !== 'string'
    ) {
      return []
    }
  
    const result = []
  
    const topicBlocks = output
      .split(
        /选题[一二三四五六七八九十]\s*：/g,
      )
      .filter((block) => block.trim())
  
    topicBlocks.forEach((block) => {
      const titleMatch = block.match(
        /标题：([\s\S]*?)(?:\n一句话推荐理由：|$)/,
      )
  
      const reasonMatch = block.match(
        /一句话推荐理由：([\s\S]*)/,
      )
  
      const title =
        titleMatch?.[1]?.trim()
  
      const reason =
        reasonMatch?.[1]?.trim()
  
      if (title) {
        result.push({
          title,
          reason:
            reason || '暂无推荐理由',
          favorite: false,
        })
      }
    })
  
    return result
  }
  
  /**
   * 收藏 / 取消收藏
   */
  function toggleFavorite(index) {
    if (!topics.value[index]) {
      return
    }
  
    topics.value[index].favorite =
      !topics.value[index].favorite
  
    contentStore.setGeneratedTopics(
      topics.value,
    )
  }
  
  /**
   * 选择一个选题并进入 AI 创作页面
   */
  function startCreate(title) {
    if (!title) {
      return
    }
  
    contentStore.setSelectedTopic(title)
  
    router.push({
      path: '/create',
      query: {
        topic: title,
      },
    })
  }
  
  /**
   * 页面加载时检查 URL 中是否存在 topic 参数
   *
   * 例如：
   * /topic?topic=简历模块化精修
   */
  onMounted(() => {
    const topicFromQuery =
      route.query.topic

    if (
      typeof topicFromQuery === 'string' &&
      topicFromQuery.trim()
    ) {
      topicInput.value =
        topicFromQuery.trim()
    }
  })
  </script>
  
  <style scoped>
  .topic-page {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-heading {
    margin-bottom: 24px;
  }
  
  .eyebrow {
    margin-bottom: 6px;
  
    color: #4f46e5;
  
    font-size: 10px;
    font-weight: 700;
  
    letter-spacing: 0.12em;
  }
  
  .page-heading h1 {
    margin: 0;
  
    color: #111827;
  
    font-size: 28px;
  }
  
  .page-heading p {
    margin: 8px 0 0;
  
    color: #98a2b3;
  
    font-size: 13px;
  }
  
  .input-panel {
    padding: 24px;
  
    border: 1px solid #e8ecf3;
    border-radius: 14px;
  
    background: #ffffff;
  }
  
  .input-header {
    display: flex;
  
    justify-content: space-between;
  
    align-items: flex-start;
  }
  
  .input-header h2 {
    margin: 0;
  
    color: #111827;
  
    font-size: 16px;
  }
  
  .input-header p {
    margin: 6px 0 0;
  
    color: #98a2b3;
  
    font-size: 12px;
  }
  
  .ai-label {
    padding: 6px 9px;
  
    color: #4338ca;
  
    background: #eef2ff;
  
    border-radius: 7px;
  
    font-size: 11px;
  
    font-weight: 700;
  }
  
  .topic-input-wrapper {
    margin-top: 20px;
  }
  
  textarea {
    width: 100%;
  
    box-sizing: border-box;
  
    padding: 15px;
  
    border: 1px solid #e4e7ec;
  
    border-radius: 10px;
  
    background: #fbfcfe;
  
    color: #111827;
  
    font-family: inherit;
  
    font-size: 13px;
  
    line-height: 1.6;
  
    outline: none;
  
    resize: vertical;
  
    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }
  
  textarea:focus {
    border-color: #818cf8;
  
    background: #ffffff;
  }
  
  textarea::placeholder {
    color: #b0b7c3;
  }
  
  .input-footer {
    display: flex;
  
    align-items: center;
  
    justify-content: space-between;
  
    margin-top: 12px;
  }
  
  .input-tip {
    color: #98a2b3;
  
    font-size: 11px;
  }
  
  .generate-button {
    height: 38px;
  
    padding: 0 16px;
  
    border: 0;
  
    border-radius: 8px;
  
    background: #4f46e5;
  
    color: #ffffff;
  
    font-size: 12px;
  
    font-weight: 600;
  
    cursor: pointer;
  
    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }
  
  .generate-button:hover:not(:disabled) {
    background: #4338ca;
  
    transform: translateY(-1px);
  }
  
  .generate-button:disabled {
    background: #c7c9d9;
  
    cursor: not-allowed;
  
    transform: none;
  }
  
  .result-section {
    margin-top: 24px;
  }
  
  .section-heading {
    display: flex;
  
    align-items: center;
  
    justify-content: space-between;
  
    margin-bottom: 12px;
  }
  
  .section-heading h2 {
    margin: 0;
  
    color: #111827;
  
    font-size: 16px;
  }
  
  .section-heading p {
    margin: 5px 0 0;
  
    color: #98a2b3;
  
    font-size: 12px;
  }
  
  .result-count {
    padding: 5px 9px;
  
    color: #667085;
  
    background: #f8fafc;
  
    border-radius: 7px;
  
    font-size: 11px;
  }
  
  .topic-list {
    display: flex;
  
    flex-direction: column;
  
    gap: 12px;
  }
  
  .topic-card {
    display: flex;
  
    gap: 18px;
  
    padding: 20px;
  
    border: 1px solid #e8ecf3;
  
    border-radius: 14px;
  
    background: #ffffff;
  
    transition:
      border-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  
  .topic-card:hover {
    border-color: #c7d2fe;
  
    transform: translateY(-1px);
  
    box-shadow:
      0 8px 24px rgba(15, 23, 42, 0.04);
  }
  
  .topic-number {
    width: 44px;
    height: 44px;
  
    display: flex;
  
    align-items: center;
  
    justify-content: center;
  
    flex-shrink: 0;
  
    border-radius: 11px;
  
    background: #eef2ff;
  
    color: #4f46e5;
  
    font-size: 14px;
  
    font-weight: 700;
  }
  
  .topic-main {
    flex: 1;
  
    min-width: 0;
  }
  
  .topic-main h3 {
    margin: 2px 0 12px;
  
    color: #111827;
  
    font-size: 16px;
  
    line-height: 1.5;
  }
  
  .reason-label {
    margin-bottom: 5px;
  
    color: #98a2b3;
  
    font-size: 11px;
  }
  
  .reason {
    margin: 0;
  
    max-width: 850px;
  
    color: #667085;
  
    font-size: 12px;
  
    line-height: 1.7;
  
    white-space: pre-wrap;
  }
  
  .topic-actions {
    display: flex;
  
    align-items: center;
  
    gap: 8px;
  
    margin-top: 16px;
  }
  
  .favorite-button,
  .create-button {
    border-radius: 8px;
  
    font-size: 12px;
  
    cursor: pointer;
  
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
  }
  
  .favorite-button {
    padding: 8px 11px;
  
    border: 1px solid #e4e7ec;
  
    background: #ffffff;
  
    color: #667085;
  }
  
  .favorite-button:hover {
    border-color: #d0d5dd;
  
    background: #f8fafc;
  }
  
  .favorite-button.active {
    border-color: #fcd34d;
  
    background: #fffbeb;
  
    color: #d97706;
  }
  
  .create-button {
    padding: 8px 13px;
  
    border: 0;
  
    background: #111827;
  
    color: #ffffff;
  
    font-weight: 600;
  }
  
  .create-button:hover {
    background: #374151;
  }
  
  .empty-panel {
    margin-top: 24px;
  
    padding: 60px 30px;
  
    text-align: center;
  
    border: 1px dashed #d9dee8;
  
    border-radius: 14px;
  
    background: #ffffff;
  }
  
  .empty-icon {
    width: 48px;
    height: 48px;
  
    margin: 0 auto 14px;
  
    display: flex;
  
    align-items: center;
  
    justify-content: center;
  
    border-radius: 13px;
  
    background: #eef2ff;
  
    color: #4f46e5;
  
    font-size: 20px;
  }
  
  .empty-panel h3 {
    margin: 0;
  
    color: #111827;
  
    font-size: 15px;
  }
  
  .empty-panel p {
    margin: 8px auto 0;
  
    max-width: 420px;
  
    color: #98a2b3;
  
    font-size: 12px;
  
    line-height: 1.6;
  }
  
  @media (max-width: 700px) {
    .input-footer,
    .section-heading {
      align-items: flex-start;
  
      flex-direction: column;
  
      gap: 12px;
    }
  
    .topic-card {
      gap: 12px;
  
      padding: 16px;
    }
  
    .topic-actions {
      flex-wrap: wrap;
    }
  }
  </style>
