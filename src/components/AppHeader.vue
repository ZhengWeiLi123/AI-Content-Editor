<template>
    <header class="header">
      <div>
        <div class="title">AI内容编辑部</div>
        <div class="subtitle">
          智能内容生产与运营决策工作台
        </div>
      </div>
  
      <div class="actions">
        <button class="icon-button">⌕</button>
        <button class="icon-button">♢</button>
  
        <div class="avatar">
          运
        </div>
      </div>
    </header>
  </template>
  
  <style scoped>
  .header {
    height: 82px;
  
    padding: 0 32px;
  
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    background: #ffffff;
    border-bottom: 1px solid #e8ecf3;
  }
  
  .title {
    color: #111827;
    font-size: 18px;
    font-weight: 700;
  }
  
  .subtitle {
    margin-top: 4px;
    color: #9ca3af;
    font-size: 12px;
  }
  
  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .icon-button {
    width: 36px;
    height: 36px;
  
    border: 0;
    border-radius: 9px;
  
    background: #f8fafc;
    color: #64748b;
  
    cursor: pointer;
  }
  
  .icon-button:hover {
    background: #eef2ff;
    color: #4f46e5;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
  
    display: flex;
    justify-content: center;
    align-items: center;
  
    border-radius: 50%;
  
    background: #111827;
    color: #ffffff;
  
    font-size: 13px;
    font-weight: 600;
  }
  </style>