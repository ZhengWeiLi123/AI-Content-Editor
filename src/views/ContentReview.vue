<template>
    <div class="review-page">
      <!-- 页面头部 -->
      <div class="page-heading">
        <div>
          <div class="eyebrow">CONTENT REVIEW</div>
  
          <h1>AI内容审核</h1>
  
          <p>
            发布前检查内容质量、事实风险与运营表现。
          </p>
        </div>
  
        <div class="review-status">
          <span class="status-dot"></span>
          {{ reviewing ? 'AI审核中' : 'AI审核引擎就绪' }}
        </div>
      </div>
  
      <!-- 当前文章 -->
      <section class="article-header">
        <div>
          <div class="article-label">
            当前审核内容
          </div>
  
          <h2>
            {{ article.title || '暂无待审核内容' }}
          </h2>
  
          <div class="article-meta">
            <span
              v-for="tag in article.tags"
              :key="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
  
        <div class="article-actions">
          <button
            class="secondary-button"
            @click="backToCreate"
          >
            ← 返回修改
          </button>
  
          <button
            class="primary-button"
            :disabled="reviewing || !article.body"
            @click="runReview"
          >
            {{ reviewing ? '审核中...' : '重新审核' }}
          </button>
        </div>
      </section>
  
      <!-- 核心审核区域 -->
      <section class="review-grid">
        <!-- 左侧文章 -->
        <div class="panel article-panel">
          <div class="panel-heading">
            <div>
              <h3>内容预览</h3>
              <p>当前提交审核的实际内容</p>
            </div>
  
            <span class="word-count">
              {{ article.body.length }} 字
            </span>
          </div>
  
          <div class="article-content">
            <h1>{{ article.title }}</h1>
  
            <div class="body-content">
              <p
                v-for="(paragraph, index) in paragraphs"
                :key="index"
              >
                {{ paragraph }}
              </p>
            </div>
  
            <div class="article-tags">
              <span
                v-for="tag in article.tags"
                :key="tag"
              >
                {{ tag }}
              </span>
            </div>
  
            <div class="interaction-box">
              <span>互动引导</span>
  
              <p>
                {{ article.interaction || '暂无互动引导' }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- 右侧评分 -->
        <div class="panel score-panel">
          <div class="score-header">
            <div>
              <h3>AI审核结果</h3>
              <p>基于GLM-4.7的内容质量分析</p>
            </div>
  
            <div class="ai-badge">
              GLM-4.7
            </div>
          </div>
  
          <!-- 综合评分 -->
          <div class="score-overview">
            <div class="score-circle">
              <div class="score-number">
                {{ reviewResult.score }}
              </div>
  
              <div class="score-label">
                综合评分
              </div>
            </div>
  
            <div class="conclusion">
              <span class="conclusion-label">
                审核结论
              </span>
  
              <strong :class="conclusionClass">
                {{ reviewResult.conclusion || '待审核' }}
              </strong>
  
              <p>
                综合5项维度评分与事实风险后给出审核建议。
              </p>
            </div>
          </div>
  
          <!-- 五项评分 -->
          <div class="score-list">
            <div class="score-item">
              <div class="score-title">
                <span>内容完整度</span>
                <strong>
                  {{ reviewResult.completeness }}
                </strong>
              </div>
  
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{
                    width: `${reviewResult.completeness}%`,
                  }"
                ></div>
              </div>
            </div>
  
            <div class="score-item">
              <div class="score-title">
                <span>用户价值</span>
                <strong>
                  {{ reviewResult.value }}
                </strong>
              </div>
  
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{
                    width: `${reviewResult.value}%`,
                  }"
                ></div>
              </div>
            </div>
  
            <div class="score-item">
              <div class="score-title">
                <span>可读性</span>
                <strong>
                  {{ reviewResult.readability }}
                </strong>
              </div>
  
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{
                    width: `${reviewResult.readability}%`,
                  }"
                ></div>
              </div>
            </div>
  
            <div class="score-item">
              <div class="score-title">
                <span>传播潜力</span>
                <strong>
                  {{ reviewResult.potential }}
                </strong>
              </div>
  
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{
                    width: `${reviewResult.potential}%`,
                  }"
                ></div>
              </div>
            </div>
  
            <div class="score-item">
              <div class="score-title">
                <span>
                  事实可信度
                  <em>风险重点</em>
                </span>
  
                <strong class="danger-score">
                  {{ reviewResult.credibility }}
                </strong>
              </div>
  
              <div class="progress">
                <div
                  class="progress-bar danger"
                  :style="{
                    width: `${reviewResult.credibility}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 事实风险 -->
      <section class="panel risk-panel">
        <div class="panel-heading">
          <div>
            <h3>事实风险</h3>
            <p>
              AI识别出的潜在事实准确性问题
            </p>
          </div>
  
          <span class="risk-count">
            {{ reviewResult.risks.length }} 处风险
          </span>
        </div>
  
        <div
          v-if="reviewResult.risks.length"
          class="risk-list"
        >
          <div
            v-for="(risk, index) in reviewResult.risks"
            :key="index"
            class="risk-item"
          >
            <div class="risk-icon">!</div>
  
            <div>
              <strong>{{ risk.title }}</strong>
  
              <p>{{ risk.description }}</p>
            </div>
          </div>
        </div>
  
        <div
          v-else
          class="empty-state"
        >
          暂未发现明显事实风险
        </div>
      </section>
  
      <!-- 内容问题 + 修改建议 -->
      <section class="recommendation-grid">
        <div class="panel">
          <div class="panel-heading">
            <div>
              <h3>内容问题</h3>
              <p>建议优先处理的问题</p>
            </div>
          </div>
  
          <div
            v-if="reviewResult.problems.length"
            class="problem-list"
          >
            <div
              v-for="(problem, index) in reviewResult.problems"
              :key="index"
              class="list-item"
            >
              <span>{{ index + 1 }}</span>
  
              <p>{{ problem }}</p>
            </div>
          </div>
  
          <div
            v-else
            class="empty-state"
          >
            暂未发现明显内容问题
          </div>
        </div>
  
        <div class="panel">
          <div class="panel-heading">
            <div>
              <h3>修改建议</h3>
              <p>AI给出的可执行优化方案</p>
            </div>
          </div>
  
          <div
            v-if="reviewResult.suggestions.length"
            class="problem-list"
          >
            <div
              v-for="(suggestion, index) in reviewResult.suggestions"
              :key="index"
              class="list-item"
            >
              <span class="suggestion-index">
                {{ index + 1 }}
              </span>
  
              <p>{{ suggestion }}</p>
            </div>
          </div>
  
          <div
            v-else
            class="empty-state"
          >
            暂无修改建议
          </div>
        </div>
      </section>
  
      <!-- 底部操作 -->
      <section class="bottom-actions">
        <div>
          <strong>
            确认审核结果后再发布
          </strong>
  
          <p>
            AI仅提供辅助判断，最终发布决定由运营人员确认。
          </p>
        </div>
  
        <div class="action-buttons">
          <button
            class="secondary-button"
            @click="backToCreate"
          >
            返回修改
          </button>
  
          <button
            class="primary-button"
            :disabled="reviewing || !article.body"
            @click="approve"
          >
            ✓ 通过审核
          </button>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import {
    computed,
    onMounted,
    ref,
  } from 'vue'
  
  import { useRouter } from 'vue-router'
  
  import { useContentStore } from '../stores/content'
  
  import { runReviewWorkflow } from '../api/cozeReview'

  import { databaseApi } from '../api/database'
  
  const router = useRouter()
  const contentStore = useContentStore()
  
  const article = computed(
    () => contentStore.currentArticle,
  )
  
  const reviewResult = computed(
    () => contentStore.reviewResult,
  )
  
  const reviewing = ref(false)
  
  const paragraphs = computed(() => {
    if (!article.value.body) {
      return []
    }
  
    return article.value.body
      .split(/\n+/)
      .filter(Boolean)
  })
  
  /**
   * 根据审核结论决定展示颜色
   */
  const conclusionClass = computed(() => {
    const conclusion =
      reviewResult.value.conclusion
  
    if (conclusion === '建议直接发布') {
      return 'safe'
    }
  
    if (conclusion === '修改后发布') {
      return 'warning'
    }
  
    if (conclusion === '不建议发布') {
      return 'danger'
    }
  
    if (conclusion === '已通过') {
      return 'safe'
    }
  
    return 'warning'
  })
  
  /**
   * 从 Coze 返回的 Markdown 文本中提取一个章节。
   */
  function getSection(
    output,
    startTitle,
    nextTitle,
  ) {
    const escapedStart = startTitle.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    )
  
    const escapedNext = nextTitle
      ? nextTitle.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&',
        )
      : ''
  
    const pattern = nextTitle
      ? new RegExp(
          `${escapedStart}[\\s\\S]*?(?=${escapedNext})`,
        )
      : new RegExp(
          `${escapedStart}[\\s\\S]*$`,
        )
  
    const match = output.match(pattern)
  
    if (!match) {
      return ''
    }
  
    return match[0]
      .replace(startTitle, '')
      .trim()
  }
  
  /**
   * 提取评分。
   */
  function parseScore(
    text,
    labels,
  ) {
    const normalizedText = String(text || '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')

    const labelList = Array.isArray(labels)
      ? labels
      : [labels]

    const labelPattern = labelList
      .map((label) =>
        label.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&',
        ),
      )
      .join('|')

    const pattern = new RegExp(
      `(?:${labelPattern})\\s*(?:评分)?\\s*[：:]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:分|/\\s*100)?`,
      'i',
    )

    const match = normalizedText.match(pattern)
  
    return match
      ? Number(match[1])
      : 0
  }
  
  /**
   * 从内容中提取 Markdown 列表。
   */
  function parseList(text) {
    if (!text) {
      return []
    }
  
    return text
      .split('\n')
      .map((line) =>
        line
          .trim()
          .replace(/^[-*]\s*/, '')
          .replace(/^\d+[.、]\s*/, '')
          .trim(),
      )
      .filter((line) => line)
  }
  
  /**
   * 解析事实风险。
   *
   * 当前真实返回格式是：
   *
   * - “具体内容”
   * - “具体内容”
   *
   * 第二个换行通常是风险说明。
   */
  function parseRisks(section) {
    if (!section) {
      return []
    }
  
    const lines = section
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  
    const risks = []
  
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]
  
      if (!line.startsWith('-')) {
        continue
      }
  
      const title = line
        .replace(/^-\s*/, '')
        .trim()
  
      let description =
        '该内容存在事实真实性风险。'
  
      if (
        lines[index + 1] &&
        !lines[index + 1].startsWith('-')
      ) {
        description = lines[index + 1]
      }
  
      risks.push({
        title,
        description,
      })
    }
  
    return risks
  }
  
  /**
   * 将 Coze 审核输出解析成前端需要的对象。
   */
  function parseReviewOutput(output) {
    if (
      !output ||
      typeof output !== 'string'
    ) {
      throw new Error(
        'AI审核返回内容为空。',
      )
    }
  
    const scoreSection = getSection(
      output,
      '### 一、维度评分（100分制）',
      '### 二、事实风险',
    )
  
    const riskSection = getSection(
      output,
      '### 二、事实风险',
      '### 三、内容问题',
    )
  
    const problemSection = getSection(
      output,
      '### 三、内容问题',
      '### 四、修改建议',
    )
  
    const suggestionSection = getSection(
      output,
      '### 四、修改建议',
      '### 五、审核结论',
    )
  
    const conclusionSection = getSection(
      output,
      '### 五、审核结论',
    )
  
    const completeness =
      parseScore(
        output,
        '内容完整度',
      )
  
    const value =
      parseScore(
        output,
        '用户价值',
      )
  
    const readability =
      parseScore(
        output,
        '可读性',
      )
  
    const potential =
      parseScore(
        output,
        [
          '运营传播潜力',
          '传播潜力',
          '传播力',
        ],
      )
  
    const credibility =
      parseScore(
        output,
        [
          '事实可信度',
          '内容可信度',
          '可信度',
        ],
      )
  
    const scores = [
      completeness,
      value,
      readability,
      potential,
      credibility,
    ].filter((score) => score > 0)

    if (!scores.length) {
      throw new Error(
        'AI已返回审核内容，但评分格式无法识别，请重新审核。',
      )
    }
  
    const score =
      scores.length
        ? Math.round(
            scores.reduce(
              (sum, item) => sum + item,
              0,
            ) / scores.length,
          )
        : 0
  
    const conclusion =
      conclusionSection
        .replace(/[#\s]+/g, ' ')
        .replace(
          '### 五、审核结论',
          '',
        )
        .trim()
  
    return {
      score,
      completeness,
      value,
      readability,
      potential,
      credibility,
  
      conclusion:
        conclusion ||
        '修改后发布',
  
      risks:
        parseRisks(riskSection),
  
      problems:
        parseList(problemSection),
  
      suggestions:
        parseList(suggestionSection),
    }
  }
  
  /**
   * 调用真实 Coze 审核工作流。
   */
  async function runReview() {
    if (!article.value.body) {
      window.alert(
        '当前没有可审核的文章内容。',
      )
  
      return
    }
  
    reviewing.value = true
  
    try {
      const input = [
        `标题：${article.value.title}`,
        '',
        '正文：',
        article.value.body,
        '',
        '话题标签：',
        article.value.tags.join(' '),
        '',
        '互动引导：',
        article.value.interaction,
      ].join('\n')
  
      const output =
        await runReviewWorkflow(input)
  
      console.log(
        'Coze审核 output：',
        output,
      )
  
      const parsedReview =
        parseReviewOutput(output)
  
      contentStore.setReviewResult(
        parsedReview,
      )

      databaseApi.saveReview({
        result: parsedReview,
      }).catch((error) => {
        console.warn('MySQL 审核记录保存失败：', error?.message)
      })
    } catch (error) {
      console.error(
        'AI审核调用失败：',
        error,
      )
  
      window.alert(
        error?.message ||
          'AI审核服务调用失败，请稍后重试。',
      )
    } finally {
      reviewing.value = false
    }
  }
  
  /**
   * 返回创作页面。
   */
   function backToCreate() {
  contentStore.setArticleStatus('revision_required')

  router.push('/create')
}
  
  /**
   * 人工确认通过。
   */
   function approve() {
  contentStore.setReviewResult({
    conclusion: '已通过',
  })

  contentStore.setArticleStatus('approved')
}
  
  onMounted(() => {
    if (
      article.value.body &&
      !reviewResult.value.score
    ) {
      runReview()
    }
  })
  </script>
  
  <style scoped>
  .review-page {
    max-width: 1450px;
    margin: 0 auto;
  }
  
  .page-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  
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
  
  .review-status {
    display: flex;
    align-items: center;
    gap: 7px;
  
    padding: 8px 11px;
  
    border-radius: 8px;
  
    background: #ecfdf3;
    color: #15803d;
  
    font-size: 11px;
  }
  
  .status-dot {
    width: 7px;
    height: 7px;
  
    border-radius: 50%;
    background: #22c55e;
  }
  
  .article-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  
    padding: 20px;
  
    border: 1px solid #e8ecf3;
    border-radius: 14px;
  
    background: #ffffff;
  }
  
  .article-label {
    margin-bottom: 7px;
  
    color: #98a2b3;
    font-size: 11px;
  }
  
  .article-header h2 {
    margin: 0;
  
    color: #111827;
  
    font-size: 17px;
  }
  
  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  
    margin-top: 10px;
  }
  
  .article-meta span {
    padding: 5px 8px;
  
    border-radius: 6px;
  
    background: #f3f4f6;
  
    color: #667085;
  
    font-size: 10px;
  }
  
  .article-actions,
  .action-buttons {
    display: flex;
    gap: 9px;
  }
  
  .primary-button,
  .secondary-button {
    height: 38px;
  
    padding: 0 14px;
  
    border-radius: 8px;
  
    font-size: 12px;
  
    cursor: pointer;
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
  
  .secondary-button {
    border: 1px solid #e4e7ec;
  
    background: #ffffff;
  
    color: #475467;
  }
  
  .review-grid {
    display: grid;
  
    grid-template-columns:
      minmax(0, 1.35fr)
      minmax(360px, 0.75fr);
  
    gap: 18px;
  
    margin-top: 18px;
  }
  
  .panel {
    padding: 22px;
  
    border: 1px solid #e8ecf3;
  
    border-radius: 14px;
  
    background: #ffffff;
  }
  
  .panel-heading {
    display: flex;
  
    align-items: flex-start;
  
    justify-content: space-between;
  }
  
  .panel-heading h3 {
    margin: 0;
  
    color: #111827;
  
    font-size: 15px;
  }
  
  .panel-heading p {
    margin: 6px 0 0;
  
    color: #98a2b3;
  
    font-size: 11px;
  }
  
  .word-count,
  .ai-badge,
  .risk-count {
    padding: 5px 8px;
  
    border-radius: 6px;
  
    background: #f8fafc;
  
    color: #667085;
  
    font-size: 10px;
  }
  
  .ai-badge {
    background: #eef2ff;
  
    color: #4338ca;
  
    font-weight: 700;
  }
  
  .article-content {
    margin-top: 22px;
  }
  
  .article-content h1 {
    margin: 0 0 20px;
  
    color: #111827;
  
    font-size: 20px;
  
    line-height: 1.5;
  }
  
  .body-content p {
    margin: 0 0 14px;
  
    color: #475467;
  
    font-size: 13px;
  
    line-height: 1.85;
  }
  
  .article-tags {
    display: flex;
  
    flex-wrap: wrap;
  
    gap: 7px;
  
    margin-top: 22px;
  
    padding-top: 18px;
  
    border-top: 1px solid #f0f2f5;
  }
  
  .article-tags span {
    padding: 5px 8px;
  
    border-radius: 6px;
  
    background: #f3f4f6;
  
    color: #667085;
  
    font-size: 10px;
  }
  
  .interaction-box {
    margin-top: 18px;
  
    padding: 14px;
  
    border-radius: 9px;
  
    background: #f8fafc;
  }
  
  .interaction-box span {
    color: #98a2b3;
  
    font-size: 10px;
  }
  
  .interaction-box p {
    margin: 6px 0 0;
  
    color: #475467;
  
    font-size: 12px;
  
    line-height: 1.6;
  }
  
  .score-header {
    display: flex;
  
    align-items: flex-start;
  
    justify-content: space-between;
  }
  
  .score-overview {
    display: flex;
  
    align-items: center;
  
    gap: 20px;
  
    margin-top: 24px;
  
    padding-bottom: 22px;
  
    border-bottom: 1px solid #f0f2f5;
  }
  
  .score-circle {
    width: 110px;
    height: 110px;
  
    display: flex;
  
    flex-direction: column;
  
    justify-content: center;
  
    align-items: center;
  
    flex-shrink: 0;
  
    border-radius: 50%;
  
    background:
      radial-gradient(
        circle,
        #ffffff 58%,
        transparent 59%
      ),
      conic-gradient(
        #f59e0b 0deg 288deg,
        #f1f5f9 288deg 360deg
      );
  }
  
  .score-number {
    color: #111827;
  
    font-size: 30px;
  
    font-weight: 700;
  }
  
  .score-label {
    color: #98a2b3;
  
    font-size: 10px;
  }
  
  .conclusion {
    display: flex;
  
    flex-direction: column;
  
    gap: 6px;
  }
  
  .conclusion-label {
    color: #98a2b3;
  
    font-size: 10px;
  }
  
  .conclusion strong {
    font-size: 15px;
  }
  
  .conclusion p {
    margin: 0;
  
    color: #98a2b3;
  
    font-size: 10px;
  
    line-height: 1.5;
  }
  
  .safe {
    color: #16a34a;
  }
  
  .warning {
    color: #d97706;
  }
  
  .danger {
    color: #dc2626;
  }
  
  .score-list {
    margin-top: 20px;
  
    display: flex;
  
    flex-direction: column;
  
    gap: 17px;
  }
  
  .score-title {
    display: flex;
  
    justify-content: space-between;
  
    align-items: center;
  
    margin-bottom: 6px;
  
    color: #667085;
  
    font-size: 11px;
  }
  
  .score-title strong {
    color: #111827;
  }
  
  .score-title em {
    margin-left: 5px;
  
    padding: 2px 5px;
  
    border-radius: 4px;
  
    background: #fff7ed;
  
    color: #ea580c;
  
    font-size: 9px;
  
    font-style: normal;
  }
  
  .danger-score {
    color: #dc2626 !important;
  }
  
  .progress {
    height: 6px;
  
    overflow: hidden;
  
    border-radius: 4px;
  
    background: #eef2f5;
  }
  
  .progress-bar {
    height: 100%;
  
    border-radius: inherit;
  
    background: #6366f1;
  }
  
  .progress-bar.danger {
    background: #f59e0b;
  }
  
  .risk-panel {
    margin-top: 18px;
  }
  
  .risk-list {
    display: grid;
  
    grid-template-columns: repeat(3, 1fr);
  
    gap: 12px;
  
    margin-top: 18px;
  }
  
  .risk-item {
    display: flex;
  
    gap: 10px;
  
    padding: 14px;
  
    border: 1px solid #fed7aa;
  
    border-radius: 9px;
  
    background: #fffaf5;
  }
  
  .risk-icon {
    width: 25px;
    height: 25px;
  
    display: flex;
  
    align-items: center;
  
    justify-content: center;
  
    flex-shrink: 0;
  
    border-radius: 50%;
  
    background: #ffedd5;
  
    color: #ea580c;
  
    font-size: 11px;
  
    font-weight: 700;
  }
  
  .risk-item strong {
    color: #9a3412;
  
    font-size: 11px;
  }
  
  .risk-item p {
    margin: 5px 0 0;
  
    color: #9a3412;
  
    font-size: 10px;
  
    line-height: 1.5;
  }
  
  .empty-state {
    margin-top: 18px;
  
    padding: 18px;
  
    border-radius: 8px;
  
    background: #f8fafc;
  
    color: #98a2b3;
  
    text-align: center;
  
    font-size: 11px;
  }
  
  .recommendation-grid {
    display: grid;
  
    grid-template-columns: 1fr 1fr;
  
    gap: 18px;
  
    margin-top: 18px;
  }
  
  .problem-list {
    margin-top: 18px;
  
    display: flex;
  
    flex-direction: column;
  
    gap: 12px;
  }
  
  .list-item {
    display: flex;
  
    gap: 10px;
  
    padding-bottom: 12px;
  
    border-bottom: 1px solid #f0f2f5;
  }
  
  .list-item > span {
    width: 22px;
    height: 22px;
  
    display: flex;
  
    align-items: center;
  
    justify-content: center;
  
    flex-shrink: 0;
  
    border-radius: 6px;
  
    background: #f3f4f6;
  
    color: #667085;
  
    font-size: 10px;
  
    font-weight: 600;
  }
  
  .suggestion-index {
    background: #eef2ff !important;
  
    color: #4338ca !important;
  }
  
  .list-item p {
    margin: 1px 0 0;
  
    color: #667085;
  
    font-size: 11px;
  
    line-height: 1.6;
  }
  
  .bottom-actions {
    display: flex;
  
    align-items: center;
  
    justify-content: space-between;
  
    margin-top: 18px;
  
    padding: 18px 20px;
  
    border: 1px solid #e8ecf3;
  
    border-radius: 14px;
  
    background: #ffffff;
  }
  
  .bottom-actions strong {
    color: #111827;
  
    font-size: 13px;
  }
  
  .bottom-actions p {
    margin: 5px 0 0;
  
    color: #98a2b3;
  
    font-size: 10px;
  }
  
  @media (max-width: 1000px) {
    .review-grid,
    .recommendation-grid {
      grid-template-columns: 1fr;
    }
  
    .risk-list {
      grid-template-columns: 1fr;
    }
  }
  </style>
