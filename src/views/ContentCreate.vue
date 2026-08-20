<template>
    <div class="create-page">
      <!-- 页面标题 -->
      <div class="page-heading">
        <div>
          <div class="eyebrow">CONTENT CREATION</div>
  
          <h1>AI智能创作</h1>
  
          <p>
            将选题快速转化为可发布内容，并根据AI审核结果持续优化。
          </p>
        </div>
  
        <div :class="['status-badge', statusClass]">
          <span class="status-dot"></span>
          {{ statusText }}
        </div>
      </div>
  
      <!-- 当前选题 -->
      <section class="topic-panel">
        <div class="topic-label">
          当前选题
        </div>
  
        <div class="selected-topic">
          {{ selectedTopic || '暂未选择选题' }}
        </div>
  
        <button
          type="button"
          class="change-topic"
          @click="goToTopic"
        >
          更换选题
        </button>
      </section>
  
      <!-- 审核修改提示 -->
      <section
        v-if="showReviewSuggestions"
        class="review-notice"
      >
        <div class="notice-icon">!</div>
  
        <div class="notice-content">
          <strong>AI审核建议修改后重新提交</strong>
  
          <p>
            当前文章综合评分：
            <b>{{ reviewResult.score }}</b>
            分，审核结论：
            <b>{{ reviewResult.conclusion }}</b>
          </p>
        </div>
  
        <button
          type="button"
          class="notice-button"
          @click="scrollToEditor"
        >
          开始修改
        </button>
      </section>
  
      <!-- 主编辑区 -->
      <section class="editor-layout">
        <!-- 左侧设置 -->
        <aside class="settings-panel">
          <div class="panel-title">
            <h2>创作设置</h2>
            <p>调整AI生成内容的方向</p>
          </div>

          <div
            v-if="selectedTopic && !article.body"
            class="settings-guide"
          >
            <strong>请先确认创作设置</strong>
            <span>确认平台、风格和目标用户后，再开始生成内容。</span>
          </div>
  
          <div class="field-group">
            <label for="platform">发布平台</label>
  
            <select
              id="platform"
              v-model="settings.platform"
            >
              <option value="小红书">
                小红书
              </option>
  
              <option value="微信公众号">
                微信公众号
              </option>
  
              <option value="抖音">
                抖音
              </option>
            </select>
          </div>
  
          <div class="field-group">
            <label>内容风格</label>
  
            <div class="style-options">
              <button
                v-for="style in styles"
                :key="style"
                type="button"
                :class="[
                  'style-option',
                  {
                    active:
                      settings.style === style,
                  },
                ]"
                @click="settings.style = style"
              >
                {{ style }}
              </button>
            </div>
          </div>
  
          <div class="field-group">
            <label for="audience">目标用户</label>
  
            <select
              id="audience"
              v-model="settings.audience"
            >
              <option value="应届毕业生">
                应届毕业生
              </option>
  
              <option value="大一至大三学生">
                大一至大三学生
              </option>
  
              <option value="考公考编学生">
                考公考编学生
              </option>
  
              <option value="央国企求职学生">
                央国企求职学生
              </option>
            </select>
          </div>
  
          <button
            type="button"
            class="generate-button"
            :disabled="
              generating ||
              !selectedTopic
            "
            @click="generateContent"
          >
            <span v-if="!generating">
              {{ article.body ? '✦ 重新生成内容' : '✦ 开始生成内容' }}
            </span>
  
            <span v-else>
              正在创作...
            </span>
          </button>
  
          <div class="generation-tip">
            AI生成内容仅作为创作辅助，发布前建议人工审核。
          </div>
  
          <!-- 审核建议 -->
          <div
            v-if="showReviewSuggestions"
            class="side-review"
          >
            <div class="side-review-title">
              本次审核建议
            </div>
  
            <div
              v-for="(suggestion, index) in reviewResult.suggestions.slice(
                0,
                3,
              )"
              :key="index"
              class="side-suggestion"
            >
              <span>{{ index + 1 }}</span>
  
              <p>{{ suggestion }}</p>
            </div>
  
            <button
              type="button"
              class="view-review"
              @click="goToReview"
            >
              查看完整审核结果 →
            </button>
          </div>
        </aside>
  
        <!-- 右侧编辑器 -->
        <main
          ref="editorRef"
          class="editor-panel"
        >
          <div class="editor-header">
            <div>
              <h2>AI生成内容</h2>
  
              <p>
                内容可直接修改，修改后重新提交审核。
              </p>
            </div>
  
            <span class="draft-status">
              {{ statusText }}
            </span>
          </div>
  
          <!-- 标题 -->
          <div class="editor-field">
            <label for="article-title">
              标题
            </label>
  
            <input
              id="article-title"
              v-model="article.title"
              type="text"
              placeholder="输入内容标题"
            />
          </div>
  
          <!-- 正文 -->
          <div class="editor-field body-field">
            <div class="label-row">
              <label for="article-body">
                正文
              </label>
  
              <span>
                {{ article.body.length }} 字
              </span>
            </div>
  
            <textarea
              id="article-body"
              v-model="article.body"
              placeholder="请输入正文内容"
            ></textarea>
          </div>
  
          <!-- 标签 -->
          <div class="editor-field">
            <label>话题标签</label>
  
            <div class="tags-wrapper">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
  
              <span
                v-if="!article.tags.length"
                class="empty-tag"
              >
                暂无标签
              </span>
            </div>
          </div>
  
          <!-- 互动引导 -->
          <div class="editor-field">
            <label for="interaction">
              互动引导
            </label>
  
            <textarea
              id="interaction"
              v-model="article.interaction"
              class="interaction-input"
              rows="3"
            ></textarea>
          </div>
  
          <!-- 操作 -->
          <div class="editor-actions">
            <button
              type="button"
              class="secondary-button"
              @click="saveDraft"
            >
              保存草稿
            </button>
  
            <button
              type="button"
              class="primary-button"
              :disabled="
                !article.body ||
                generating
              "
              @click="submitReview"
            >
              {{
                showReviewSuggestions
                  ? '重新提交审核 →'
                  : '送去AI审核 →'
              }}
            </button>
          </div>
        </main>
      </section>
    </div>
  </template>
  
  <script setup>
  import {
    computed,
    onMounted,
    reactive,
    ref,
    watch,
  } from 'vue'
  
  import { useRouter } from 'vue-router'
  
  import { useContentStore } from '../stores/content'
  
  import { runCreateWorkflow } from '../api/cozeCreate'

  import { databaseApi } from '../api/database'
  
  const router = useRouter()
  const contentStore = useContentStore()
  
  const editorRef = ref(null)
  const generating = ref(false)
  
  const selectedTopic = computed(
    () => contentStore.selectedTopic,
  )
  
  const reviewResult = computed(
    () => contentStore.reviewResult,
  )
  
  const articleStatus = computed(
    () => contentStore.articleStatus,
  )
  
  const styles = [
    '干货',
    '实用指南',
    '经验分享',
  ]
  
  const settings = reactive({
    platform: '小红书',
    style: '实用指南',
    audience: '应届毕业生',
  })
  
  const article = reactive({
    title: '',
    body: '',
    tags: [],
    interaction: '',
  })
  
  const statusText = computed(() => {
    switch (articleStatus.value) {
      case 'draft':
        return '草稿'
  
      case 'reviewing':
        return '审核中'
  
      case 'revision_required':
        return '需要修改'
  
      case 'approved':
        return '已通过'
  
      default:
        return 'AI创作就绪'
    }
  })
  
  const statusClass = computed(() => {
    switch (articleStatus.value) {
      case 'approved':
        return 'approved'
  
      case 'revision_required':
        return 'warning'
  
      case 'reviewing':
        return 'reviewing'
  
      default:
        return ''
    }
  })
  
  const showReviewSuggestions = computed(() => {
    return (
      articleStatus.value ===
        'revision_required' &&
      reviewResult.value.suggestions.length > 0
    )
  })
  
  function parseArticle(output) {
    if (
      !output ||
      typeof output !== 'string'
    ) {
      throw new Error(
        'AI返回内容为空或格式异常',
      )
    }
  
    const titleMatch = output.match(
      /标题：([\s\S]*?)(?:\n\s*正文：|$)/,
    )
  
    const bodyMatch = output.match(
      /正文：([\s\S]*?)(?:\n\s*话题标签：|$)/,
    )
  
    const tagsMatch = output.match(
      /话题标签：([\s\S]*?)(?:\n\s*互动引导：|$)/,
    )
  
    const interactionMatch = output.match(
      /互动引导：([\s\S]*)/,
    )
  
    const title =
      titleMatch?.[1]?.trim() || ''
  
    const body =
      bodyMatch?.[1]?.trim() || ''
  
    const tagsText =
      tagsMatch?.[1]?.trim() || ''
  
    const interaction =
      interactionMatch?.[1]?.trim() || ''
  
    const tags = tagsText
      .split(/\s+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
  
    if (!title && !body) {
      throw new Error(
        'AI返回结果无法解析为文章内容',
      )
    }
  
    return {
      title,
      body,
      tags,
      interaction,
    }
  }
  
  async function generateContent() {
    if (!selectedTopic.value) {
      window.alert('请先选择一个选题。')
      return
    }
  
    generating.value = true
  
    contentStore.setArticleStatus('draft')
  
    try {
      const creationInput = [
        `选题：${selectedTopic.value}`,
        `发布平台：${settings.platform}`,
        `内容风格：${settings.style}`,
        `目标用户：${settings.audience}`,
        '请根据以上要求生成适配对应平台的完整内容。',
      ].join('\n')

      const output =
        await runCreateWorkflow(
          creationInput,
        )
  
      console.log(
        'Coze创作 output：',
        output,
      )
  
      const parsedArticle =
        parseArticle(output)
  
      article.title =
        parsedArticle.title
  
      article.body =
        parsedArticle.body
  
      article.tags = [
        ...parsedArticle.tags,
      ]
  
      article.interaction =
        parsedArticle.interaction
  
      contentStore.setCurrentArticle(
        {
          ...article,
          topic: selectedTopic.value,
          settings: {
            ...settings,
          },
        },
      )
  
      contentStore.resetReviewResult()
  
      contentStore.setArticleStatus(
        'draft',
      )
    } catch (error) {
      console.error(
        'AI创作调用失败：',
        error,
      )
  
      window.alert(
        error?.message ||
          'AI创作服务调用失败，请稍后重试。',
      )
    } finally {
      generating.value = false
    }
  }
  
  async function saveDraft() {
    contentStore.setCurrentArticle(
      {
        ...article,
        topic: selectedTopic.value,
        settings: {
          ...settings,
        },
      },
    )
  
    contentStore.setArticleStatus('draft')

    if (!article.title?.trim()) {
      window.alert('请先填写文章标题。')
      return
    }

    try {
      await databaseApi.saveArticle({
        title: article.title,
        body: article.body,
        tags: article.tags,
        status: 'draft',
      })
      window.alert('草稿已保存到 MySQL。')
    } catch (error) {
      console.error('草稿保存失败：', error)
      window.alert('草稿已保存在当前页面，但写入 MySQL 失败。请确认后端和 MySQL 已启动。')
    }
  }
  
  function submitReview() {
    if (!article.body) {
      return
    }
  
    contentStore.setCurrentArticle(
      article,
    )
  
    contentStore.setArticleStatus(
      'reviewing',
    )
  
    router.push('/review')
  }
  
  function goToTopic() {
    router.push('/topic')
  }
  
  function goToReview() {
    router.push('/review')
  }
  
  function scrollToEditor() {
    editorRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
  
  onMounted(() => {
    const savedArticle =
      contentStore.currentArticle
  
    if (
      savedArticle.title &&
      savedArticle.body &&
      savedArticle.topic === selectedTopic.value
    ) {
      article.title =
        savedArticle.title
  
      article.body =
        savedArticle.body
  
      article.tags = [
        ...savedArticle.tags,
      ]
  
      article.interaction =
        savedArticle.interaction

      if (savedArticle.settings) {
        Object.assign(
          settings,
          savedArticle.settings,
        )
      }
  
      return
    }
  })

  watch(
    selectedTopic,
    (nextTopic, previousTopic) => {
      if (
        nextTopic &&
        previousTopic &&
        nextTopic !== previousTopic
      ) {
        article.title = ''
        article.body = ''
        article.tags = []
        article.interaction = ''

        contentStore.setCurrentArticle({
          title: '',
          body: '',
          tags: [],
          interaction: '',
          topic: nextTopic,
        })

        contentStore.resetReviewResult()
        contentStore.setArticleStatus('draft')
      }
    },
  )
  </script>
  
  <style scoped>
  .create-page {
    max-width: 1450px;
    margin: 0 auto;
  }
  
  .page-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 22px;
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
  
  .status-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 11px;
    border-radius: 8px;
    background: #ecfdf3;
    color: #15803d;
    font-size: 11px;
  }
  
  .status-badge.warning {
    background: #fff7ed;
    color: #c2410c;
  }
  
  .status-badge.reviewing {
    background: #eef2ff;
    color: #4338ca;
  }
  
  .status-badge.approved {
    background: #ecfdf3;
    color: #15803d;
  }
  
  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
  }
  
  .topic-panel {
    position: relative;
    padding: 18px 20px;
    border: 1px solid #dfe4ee;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      #f8f8ff,
      #ffffff
    );
  }
  
  .topic-label {
    margin-bottom: 7px;
    color: #98a2b3;
    font-size: 11px;
  }
  
  .selected-topic {
    padding-right: 100px;
    color: #111827;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
  }
  
  .change-topic {
    position: absolute;
    right: 18px;
    bottom: 18px;
    padding: 7px 10px;
    border: 1px solid #e4e7ec;
    border-radius: 7px;
    background: #ffffff;
    color: #667085;
    font-size: 11px;
    cursor: pointer;
  }
  
  .review-notice {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    padding: 14px 16px;
    border: 1px solid #fed7aa;
    border-radius: 10px;
    background: #fffaf5;
  }
  
  .notice-icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    background: #ffedd5;
    color: #ea580c;
    font-weight: 700;
  }
  
  .notice-content {
    flex: 1;
  }
  
  .notice-content strong {
    color: #9a3412;
    font-size: 12px;
  }
  
  .notice-content p {
    margin: 4px 0 0;
    color: #9a3412;
    font-size: 10px;
  }
  
  .notice-button {
    padding: 7px 10px;
    border: 0;
    border-radius: 7px;
    background: #ea580c;
    color: #ffffff;
    font-size: 10px;
    cursor: pointer;
  }
  
  .editor-layout {
    display: grid;
    grid-template-columns: 290px minmax(0, 1fr);
    gap: 18px;
    margin-top: 18px;
  }
  
  .settings-panel,
  .editor-panel {
    border: 1px solid #e8ecf3;
    border-radius: 14px;
    background: #ffffff;
  }
  
  .settings-panel {
    height: fit-content;
    padding: 20px;
  }
  
  .panel-title h2,
  .editor-header h2 {
    margin: 0;
    color: #111827;
    font-size: 16px;
  }
  
  .panel-title p,
  .editor-header p {
    margin: 6px 0 0;
    color: #98a2b3;
    font-size: 12px;
  }

  .settings-guide {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 16px;
    padding: 11px 12px;
    border: 1px solid #c7d2fe;
    border-radius: 9px;
    background: #f5f7ff;
  }

  .settings-guide strong {
    color: #4338ca;
    font-size: 11px;
  }

  .settings-guide span {
    color: #667085;
    font-size: 10px;
    line-height: 1.5;
  }
  
  .field-group {
    margin-top: 22px;
  }
  
  .field-group label,
  .editor-field label {
    display: block;
    margin-bottom: 8px;
    color: #475467;
    font-size: 12px;
    font-weight: 600;
  }
  
  select {
    width: 100%;
    height: 38px;
    padding: 0 10px;
    border: 1px solid #e4e7ec;
    border-radius: 8px;
    background: #ffffff;
    color: #344054;
    outline: none;
  }
  
  .style-options {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  
  .style-option {
    padding: 9px 11px;
    border: 1px solid #e4e7ec;
    border-radius: 8px;
    background: #ffffff;
    color: #667085;
    text-align: left;
    font-size: 12px;
    cursor: pointer;
  }
  
  .style-option.active {
    border-color: #c7d2fe;
    background: #eef2ff;
    color: #4338ca;
    font-weight: 600;
  }
  
  .generate-button {
    width: 100%;
    height: 40px;
    margin-top: 24px;
    border: 0;
    border-radius: 8px;
    background: #4f46e5;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .generate-button:disabled {
    background: #c7c9d9;
    cursor: not-allowed;
  }
  
  .generation-tip {
    margin-top: 10px;
    color: #98a2b3;
    font-size: 10px;
    line-height: 1.5;
  }
  
  .side-review {
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid #f0f2f5;
  }
  
  .side-review-title {
    color: #9a3412;
    font-size: 11px;
    font-weight: 700;
  }
  
  .side-suggestion {
    display: flex;
    gap: 7px;
    margin-top: 10px;
  }
  
  .side-suggestion span {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 5px;
    background: #fff7ed;
    color: #c2410c;
    font-size: 9px;
    font-weight: 600;
  }
  
  .side-suggestion p {
    margin: 1px 0 0;
    color: #667085;
    font-size: 10px;
    line-height: 1.5;
  }
  
  .view-review {
    margin-top: 12px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #4f46e5;
    font-size: 10px;
    cursor: pointer;
  }
  
  .editor-panel {
    padding: 22px;
  }
  
  .editor-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 18px;
    border-bottom: 1px solid #f0f2f5;
  }
  
  .draft-status {
    padding: 5px 9px;
    border-radius: 7px;
    background: #f8fafc;
    color: #667085;
    font-size: 10px;
  }
  
  .editor-field {
    margin-top: 20px;
  }
  
  .label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .label-row span {
    color: #98a2b3;
    font-size: 10px;
  }
  
  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #e4e7ec;
    border-radius: 9px;
    background: #fbfcfe;
    color: #111827;
    font-family: inherit;
    outline: none;
  }
  
  input {
    height: 42px;
    padding: 0 12px;
    font-size: 13px;
  }
  
  textarea {
    padding: 12px;
    resize: vertical;
    font-size: 13px;
    line-height: 1.7;
  }
  
  input:focus,
  textarea:focus {
    border-color: #818cf8;
    background: #ffffff;
  }
  
  .body-field textarea {
    min-height: 350px;
  }
  
  .interaction-input {
    min-height: 90px;
  }
  
  .tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }
  
  .tag {
    padding: 6px 9px;
    border-radius: 7px;
    background: #f3f4f6;
    color: #475467;
    font-size: 11px;
  }
  
  .empty-tag {
    color: #98a2b3;
    font-size: 11px;
  }
  
  .editor-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid #f0f2f5;
  }
  
  .secondary-button,
  .primary-button {
    height: 40px;
    padding: 0 15px;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
  }
  
  .secondary-button {
    border: 1px solid #e4e7ec;
    background: #ffffff;
    color: #475467;
  }
  
  .primary-button {
    border: 0;
    background: #111827;
    color: #ffffff;
    font-weight: 600;
  }
  
  .primary-button:disabled {
    background: #c7c9d9;
    cursor: not-allowed;
  }
  
  @media (max-width: 900px) {
    .editor-layout {
      grid-template-columns: 1fr;
    }
  
    .settings-panel {
      height: auto;
    }
  
    .review-notice {
      align-items: flex-start;
      flex-direction: column;
    }
  
    .notice-button {
      align-self: flex-start;
    }
  }
  </style>
