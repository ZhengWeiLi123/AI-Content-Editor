<template>
    <div class="metric-card">
      <div class="top">
        <span class="label">{{ label }}</span>
        <span class="symbol">{{ symbol }}</span>
      </div>
  
      <div class="value">
        {{ value }}
      </div>
  
      <div class="bottom">
        <span
          v-if="trend"
          :class="['trend', trendType]"
        >
          {{ trend }}
        </span>
  
        <span class="description">
          {{ description }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    trend: {
      type: String,
      default: '',
    },
    trendType: {
      type: String,
      default: 'up',
    },
    symbol: {
      type: String,
      default: '◈',
    },
  })
  </script>
  
  <style scoped>
  .metric-card {
    padding: 20px;
    border: 1px solid #e8ecf3;
    border-radius: 14px;
    background: #ffffff;
  }
  
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .label {
    color: #667085;
    font-size: 13px;
  }
  
  .symbol {
    width: 32px;
    height: 32px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    border-radius: 9px;
  
    background: #eef2ff;
    color: #4f46e5;
    font-size: 14px;
  }
  
  .value {
    margin-top: 14px;
  
    color: #111827;
  
    font-size: 28px;
    font-weight: 700;
  }
  
  .bottom {
    margin-top: 10px;
  
    display: flex;
    align-items: center;
    gap: 8px;
  
    font-size: 12px;
  }
  
  .trend {
    font-weight: 600;
  }
  
  .trend.up {
    color: #16a34a;
  }
  
  .trend.down {
    color: #dc2626;
  }
  
  .description {
    color: #98a2b3;
  }
  </style>