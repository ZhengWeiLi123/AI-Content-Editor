<template>
    <div class="dashboard">
      <div class="page-heading">
        <div>
          <h1>工作台</h1>
          <p>
            今天也来看看内容表现，找到下一篇值得创作的内容。
          </p>
        </div>
  
        <div class="heading-actions">
          <button
            type="button"
            class="secondary-button"
            @click="$router.push('/analysis')"
          >
            查看报告
          </button>
  
          <button
            class="primary-button"
            @click="$router.push('/topic')"
          >
            ＋ AI智能选题
          </button>
        </div>
      </div>
  
      <!-- 指标 -->
      <section class="metric-grid">
        <MetricCard
          label="内容数量"
          :value="formatNumber(dashboardData.articleCount)"
          description="当前分析周期"
          symbol="◈"
        />
  
        <MetricCard
          label="总阅读量"
          :value="formatNumber(dashboardData.totalViews)"
          description="累计阅读"
          symbol="◉"
        />
  
        <MetricCard
          label="平均互动率"
          :value="formatRate(dashboardData.interactionRate)"
          description="点赞、收藏、评论、分享"
          symbol="◇"
        />
  
        <MetricCard
          label="高表现内容"
          :value="formatNumber(topContents.length)"
          description="阅读量与互动率Top内容"
          symbol="★"
        />
      </section>
  
      <!-- 中间区域 -->
      <section class="main-grid">
        <div class="panel trend-panel">
          <div class="panel-heading">
            <div>
              <h2>内容表现趋势</h2>
              <p>最近内容的阅读量变化</p>
            </div>
  
            <span class="period">{{ topContents.length }} 篇</span>
          </div>
  
          <div v-if="topContents.length" class="trend-bars">
            <div v-for="(item, index) in topContents" :key="`${item.title}-${index}`" class="trend-column">
              <span class="trend-value">{{ formatNumber(item.views) }}</span>
              <div class="trend-bar" :style="{ height: `${barHeight(item.views)}%` }"></div>
              <span class="trend-label">{{ shortTitle(item.title) }}</span>
            </div>
          </div>
          <div v-else class="dashboard-empty">完成一次数据分析后显示真实内容趋势。</div>
        </div>
  
        <div class="panel insight-panel">
          <div class="panel-heading">
            <div>
              <h2>AI运营洞察</h2>
              <p>基于当前内容数据生成</p>
            </div>
  
            <span class="ai-badge">AI</span>
          </div>
  
          <div v-if="insights.length" class="insights">
            <div v-for="(insight, index) in insights" :key="`${insight}-${index}`" class="insight-item">
              <div :class="['insight-icon', insightTones[index % insightTones.length]]">{{ index + 1 }}</div>
              <div><strong>运营洞察 {{ index + 1 }}</strong><p>{{ insight }}</p></div>
            </div>
          </div>
          <div v-else class="dashboard-empty compact">暂无AI运营洞察。</div>
  
          <button
            class="text-button"
            @click="$router.push('/analysis')"
          >
            查看完整分析 →
          </button>
        </div>
      </section>
  
      <!-- 快速操作 -->
      <section class="section-block">
        <div class="section-heading">
          <div>
            <h2>快速操作</h2>
            <p>使用AI快速完成内容工作</p>
          </div>
        </div>
  
        <div class="action-grid">
          <button
            class="action-card"
            @click="$router.push('/topic')"
          >
            <div class="action-icon purple">
              ✦
            </div>
  
            <div class="action-content">
              <strong>AI智能选题</strong>
              <span>
                输入一个方向，发现3个值得创作的选题
              </span>
            </div>
  
            <span class="arrow">→</span>
          </button>
  
          <button
            class="action-card"
            @click="$router.push('/create')"
          >
            <div class="action-icon blue">
              ✎
            </div>
  
            <div class="action-content">
              <strong>AI智能创作</strong>
              <span>
                根据选题快速生成标题、正文和标签
              </span>
            </div>
  
            <span class="arrow">→</span>
          </button>
  
          <button
            class="action-card"
            @click="$router.push('/review')"
          >
            <div class="action-icon orange">
              ✓
            </div>
  
            <div class="action-content">
              <strong>AI内容审核</strong>
              <span>
                检查内容质量和潜在事实风险
              </span>
            </div>
  
            <span class="arrow">→</span>
          </button>
        </div>
      </section>
  
      <!-- Top 内容 -->
      <section class="panel">
        <div class="panel-heading">
          <div>
            <h2>高表现内容</h2>
            <p>阅读量与互动表现最好的内容</p>
          </div>
  
          <button
            class="text-button"
            @click="$router.push('/analysis')"
          >
            查看全部 →
          </button>
        </div>
  
        <div v-if="topContents.length" class="content-list">
          <div
            v-for="(item, index) in topContents"
            :key="item.title"
            class="content-row"
          >
            <div class="rank">
              {{ String(index + 1).padStart(2, '0') }}
            </div>
  
            <div class="content-info">
              <strong>{{ item.title }}</strong>
  
              <span>
                AI分析高表现内容
              </span>
            </div>
  
            <div class="content-stat">
              <strong>{{ formatNumber(item.views) }}</strong>
              <span>阅读</span>
            </div>
  
            <div class="content-stat">
              <strong>{{ formatRate(item.rate) }}</strong>
              <span>互动率</span>
            </div>
  
            <div class="performance-tag">
              高表现
            </div>
          </div>
        </div>
        <div v-else class="dashboard-empty">暂无高表现内容，请先上传运营数据完成分析。</div>
      </section>
    </div>
  </template>
  
  <script setup>
  import {
    computed,
    onActivated,
    onMounted,
    ref,
  } from 'vue'

  import MetricCard from '../components/MetricCard.vue'

  import { databaseApi } from '../api/database'
  import { useAnalysisStore } from '../stores/analysis'

  const analysisStore = useAnalysisStore()
  const rawAnalysis = ref(null)
  const insightTones = ['success', 'warning', 'primary']

  const numberValue = (value) => {
    const match = String(value ?? '')
      .replaceAll(',', '')
      .match(/[\d.]+/)

    return match ? Number(match[0]) || 0 : 0
  }

  function parseMaybeJson(value) {
    if (typeof value !== 'string') return value

    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  function parseTopViews(value) {
    const parsed = parseMaybeJson(value)

    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        title:
          item?.title ||
          item?.name ||
          `内容 ${index + 1}`,
        views: numberValue(
          item?.views ?? item?.view_count,
        ),
        rate: numberValue(
          item?.interaction_rate ?? item?.rate,
        ),
      }))
    }

    return String(parsed || '')
      .split(/\r?\n/)
      .map((line) => {
        const cleaned = line
          .replace(/^[-*]?\s*\d+[.、)]\s*/, '')
          .trim()

        return {
          title: cleaned.split('|')[0]?.trim(),
          views: numberValue(
            cleaned.match(/阅读量[：:]\s*([\d,.]+)/)?.[1],
          ),
          rate: numberValue(
            cleaned.match(/互动率[：:]\s*([\d.]+)/)?.[1],
          ),
        }
      })
      .filter((item) => item.title)
  }

  const dashboardData = computed(() => {
    let source = parseMaybeJson(rawAnalysis.value)

    if (!source || typeof source !== 'object') {
      source = {}
    }

    const parsedOutput = parseMaybeJson(source.output)
    const nested =
      parsedOutput && typeof parsedOutput === 'object'
        ? parsedOutput
        : {}
    const result = { ...nested, ...source }

    return {
      articleCount: numberValue(result.article_count),
      totalViews: numberValue(result.total_views),
      interactionRate: numberValue(result.interaction_rate),
      topViews: parseTopViews(result.top_views),
      output:
        typeof source.output === 'string' &&
        typeof parsedOutput === 'string'
          ? source.output
          : String(result.report || nested.output || ''),
    }
  })

  const topContents = computed(
    () => dashboardData.value.topViews.slice(0, 10),
  )

  const insights = computed(() => {
    const report = dashboardData.value.output

    if (!report) return []

    const section =
      report.match(
        /(?:核心发现|运营洞察|内容洞察)[^\n]*\n([\s\S]*?)(?=\n#{1,4}|\n[一二三四五六七八九十]+、|$)/,
      )?.[1] || report

    return section
      .split(/\r?\n/)
      .map((line) =>
        line
          .replace(/^\s*(?:[-*•]|\d+[.、)])\s*/, '')
          .replace(/[#*]/g, '')
          .trim(),
      )
      .filter((line) => line.length >= 8 && line.length <= 120)
      .slice(0, 3)
  })

  function formatNumber(value) {
    return numberValue(value).toLocaleString('zh-CN')
  }

  function formatRate(value) {
    const number = numberValue(value)
    return `${Number.isInteger(number) ? number : number.toFixed(2)}%`
  }

  function barHeight(value) {
    const maximum = Math.max(
      ...topContents.value.map((item) => item.views),
      1,
    )

    return Math.max(8, (numberValue(value) / maximum) * 78)
  }

  function shortTitle(title) {
    return title.length > 7
      ? `${title.slice(0, 7)}…`
      : title
  }

  async function loadLatestAnalysis() {
    if (analysisStore.analysisResult) {
      rawAnalysis.value = analysisStore.analysisResult
      return
    }

    try {
      const latest = await databaseApi.getLatestAnalysis()
      rawAnalysis.value =
        parseMaybeJson(latest?.result_json) || null
    } catch (error) {
      console.warn('工作台读取最新分析失败：', error?.message)
      rawAnalysis.value = null
    }
  }

  onMounted(loadLatestAnalysis)
  onActivated(loadLatestAnalysis)
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 1500px;
    margin: 0 auto;
  }
  
  .page-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .page-heading h1 {
    margin: 0;
    font-size: 28px;
    color: #111827;
  }
  
  .page-heading p {
    margin: 8px 0 0;
    color: #98a2b3;
    font-size: 13px;
  }
  
  .heading-actions {
    display: flex;
    gap: 10px;
  }
  
  .primary-button,
  .secondary-button {
    height: 40px;
    padding: 0 16px;
    border-radius: 9px;
    font-size: 13px;
    cursor: pointer;
  }
  
  .primary-button {
    border: 0;
    background: #4f46e5;
    color: #ffffff;
  }
  
  .primary-button:hover {
    background: #4338ca;
  }
  
  .secondary-button {
    border: 1px solid #e4e7ec;
    background: #ffffff;
    color: #475467;
  }
  
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 18px;
  }
  
  .main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(320px, 1fr);
    gap: 18px;
    margin-bottom: 18px;
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
  
  .panel-heading h2 {
    margin: 0;
    font-size: 16px;
    color: #111827;
  }
  
  .panel-heading p {
    margin: 6px 0 0;
    color: #98a2b3;
    font-size: 12px;
  }
  
  .period,
  .ai-badge {
    padding: 5px 9px;
    border-radius: 7px;
    font-size: 11px;
  }
  
  .period {
    background: #f8fafc;
    color: #667085;
  }
  
  .ai-badge {
    background: #eef2ff;
    color: #4338ca;
    font-weight: 700;
  }
  
  .chart-placeholder {
    position: relative;
    height: 250px;
    margin-top: 22px;
    border-left: 1px solid #edf0f5;
    border-bottom: 1px solid #edf0f5;
    background:
      linear-gradient(#f6f7fb 1px, transparent 1px),
      linear-gradient(90deg, #f6f7fb 1px, transparent 1px);
    background-size: 100% 50px, 10% 100%;
  }
  
  .chart-line {
    position: absolute;
    left: 2%;
    right: 2%;
    bottom: 52px;
    height: 135px;
  
    clip-path: polygon(
      0 75%,
      10% 55%,
      20% 65%,
      30% 35%,
      40% 45%,
      50% 20%,
      60% 55%,
      70% 12%,
      80% 28%,
      90% 5%,
      100% 0,
      100% 3%,
      90% 8%,
      80% 31%,
      70% 18%,
      60% 61%,
      50% 26%,
      40% 51%,
      30% 41%,
      20% 71%,
      10% 61%,
      0 82%
    );
  
    background: #6366f1;
    opacity: 0.9;
  }
  
  .chart-labels {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -22px;
  
    display: flex;
    justify-content: space-between;
  
    color: #98a2b3;
    font-size: 10px;
  }

  .trend-bars {
    height: 272px;
    margin-top: 20px;
    padding: 26px 8px 0;
    display: flex;
    align-items: flex-end;
    gap: 12px;
    border-left: 1px solid #edf0f5;
    border-bottom: 1px solid #edf0f5;
    background:
      linear-gradient(#f6f7fb 1px, transparent 1px);
    background-size: 100% 50px;
  }

  .trend-column {
    position: relative;
    height: 100%;
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
  }

  .trend-value {
    margin-bottom: 5px;
    color: #667085;
    font-size: 9px;
  }

  .trend-bar {
    width: min(36px, 70%);
    min-height: 8px;
    border-radius: 6px 6px 0 0;
    background: linear-gradient(180deg, #818cf8, #4f46e5);
  }

  .trend-label {
    position: absolute;
    top: calc(100% + 8px);
    width: 100%;
    overflow: hidden;
    color: #98a2b3;
    font-size: 9px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dashboard-empty {
    margin-top: 18px;
    padding: 36px 20px;
    border-radius: 10px;
    background: #f8fafc;
    color: #98a2b3;
    font-size: 11px;
    text-align: center;
  }

  .dashboard-empty.compact {
    padding: 26px 16px;
  }
  
  .insights {
    margin-top: 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .insight-item {
    display: flex;
    gap: 10px;
  }
  
  .insight-icon {
    width: 28px;
    height: 28px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    flex-shrink: 0;
  
    border-radius: 8px;
  
    font-size: 12px;
    font-weight: 700;
  }
  
  .success {
    background: #ecfdf3;
    color: #16a34a;
  }
  
  .warning {
    background: #fff7ed;
    color: #ea580c;
  }
  
  .primary {
    background: #eef2ff;
    color: #4f46e5;
  }
  
  .insight-item strong {
    font-size: 13px;
    color: #111827;
  }
  
  .insight-item p {
    margin: 4px 0 0;
    color: #98a2b3;
    font-size: 12px;
    line-height: 1.5;
  }
  
  .text-button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #4f46e5;
    font-size: 12px;
    cursor: pointer;
  }
  
  .section-block {
    margin-bottom: 18px;
  }
  
  .section-heading {
    margin-bottom: 12px;
  }
  
  .section-heading h2 {
    margin: 0;
    font-size: 16px;
  }
  
  .section-heading p {
    margin: 5px 0 0;
    font-size: 12px;
    color: #98a2b3;
  }
  
  .action-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  
  .action-card {
    min-height: 112px;
    display: flex;
    align-items: center;
    gap: 14px;
  
    padding: 18px;
  
    border: 1px solid #e8ecf3;
    border-radius: 14px;
  
    background: #ffffff;
  
    text-align: left;
    cursor: pointer;
  
    transition:
      transform 0.2s ease,
      border-color 0.2s ease;
  }
  
  .action-card:hover {
    transform: translateY(-2px);
    border-color: #c7d2fe;
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    flex-shrink: 0;
  
    border-radius: 10px;
  
    font-weight: 700;
  }
  
  .purple {
    background: #f3e8ff;
    color: #9333ea;
  }
  
  .blue {
    background: #eff6ff;
    color: #2563eb;
  }
  
  .orange {
    background: #fff7ed;
    color: #ea580c;
  }
  
  .action-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }
  
  .action-content strong {
    color: #111827;
    font-size: 14px;
  }
  
  .action-content span {
    color: #98a2b3;
    font-size: 11px;
    line-height: 1.4;
  }
  
  .arrow {
    color: #98a2b3;
  }
  
  .content-list {
    margin-top: 18px;
  }
  
  .content-row {
    display: grid;
    grid-template-columns: 48px 1fr 110px 110px 70px;
    align-items: center;
    gap: 10px;
  
    padding: 15px 0;
  
    border-top: 1px solid #f0f2f5;
  }
  
  .rank {
    color: #98a2b3;
    font-size: 13px;
    font-weight: 600;
  }
  
  .content-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .content-info strong {
    color: #111827;
    font-size: 13px;
  }
  
  .content-info span {
    color: #98a2b3;
    font-size: 11px;
  }
  
  .content-stat {
    text-align: right;
  }
  
  .content-stat strong {
    display: block;
    color: #111827;
    font-size: 13px;
  }
  
  .content-stat span {
    color: #98a2b3;
    font-size: 10px;
  }
  
  .performance-tag {
    padding: 4px 7px;
    border-radius: 6px;
    background: #ecfdf3;
    color: #16a34a;
    font-size: 10px;
    text-align: center;
  }
  
  @media (max-width: 1100px) {
    .metric-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  
    .main-grid {
      grid-template-columns: 1fr;
    }
  
    .action-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
