<template>
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">AI</div>
  
        <div class="brand-info">
          <div class="brand-name">AI内容编辑部</div>
          <div class="brand-desc">Content Studio</div>
        </div>
      </div>
  
      <nav class="nav">
        <div class="nav-group">
          <div class="group-title">工作空间</div>
  
          <RouterLink to="/dashboard" class="nav-item">
            <span class="icon">⌂</span>
            <span>工作台</span>
          </RouterLink>
        </div>
  
        <div class="nav-group">
          <div class="group-title">内容策划</div>
  
          <RouterLink to="/topic" class="nav-item">
            <span class="icon">✦</span>
            <span>AI智能选题</span>
          </RouterLink>
        </div>
  
        <div class="nav-group">
          <div class="group-title">内容生产</div>
  
          <RouterLink to="/create" class="nav-item">
            <span class="icon">✎</span>
            <span>AI智能创作</span>
          </RouterLink>
  
          <RouterLink to="/review" class="nav-item">
            <span class="icon">✓</span>
            <span>AI内容审核</span>
          </RouterLink>
        </div>
  
        <div class="nav-group">
          <div class="group-title">内容运营</div>
  
          <RouterLink to="/analysis" class="nav-item">
            <span class="icon">◇</span>
            <span>数据分析</span>
          </RouterLink>
        </div>
      </nav>
  
      <div class="sidebar-footer">
        <div class="status">
          <span class="status-dot"></span>
          <span>AI服务正常</span>
        </div>
      </div>
    </aside>
  </template>
  
  <style scoped>
  .sidebar {
    width: 232px;
    min-width: 232px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
  
    display: flex;
    flex-direction: column;
  
    background: #ffffff;
    border-right: 1px solid #e8ecf3;
  }
  
  .brand {
    height: 82px;
    padding: 0 22px;
  
    display: flex;
    align-items: center;
    gap: 12px;
  
    border-bottom: 1px solid #eef1f5;
  }
  
  .brand-mark {
    width: 36px;
    height: 36px;
  
    display: flex;
    justify-content: center;
    align-items: center;
  
    border-radius: 10px;
  
    background: #4f46e5;
    color: #ffffff;
  
    font-size: 12px;
    font-weight: 700;
  }
  
  .brand-name {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
  }
  
  .brand-desc {
    margin-top: 3px;
    color: #9ca3af;
    font-size: 11px;
  }
  
  .nav {
    flex: 1;
    padding: 18px 12px;
    overflow-y: auto;
  }
  
  .nav-group {
    margin-bottom: 18px;
  }
  
  .group-title {
    padding: 0 10px 8px;
    color: #9ca3af;
    font-size: 11px;
    letter-spacing: 0.08em;
  }
  
  .nav-item {
    height: 42px;
    display: flex;
    align-items: center;
    gap: 10px;
  
    padding: 0 12px;
  
    border-radius: 9px;
  
    color: #667085;
    text-decoration: none;
    font-size: 14px;
  
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }
  
  .nav-item:hover {
    background: #f3f4ff;
    color: #4f46e5;
  }
  
  .nav-item.router-link-active {
    background: #eef2ff;
    color: #4338ca;
    font-weight: 600;
  }
  
  .icon {
    width: 20px;
    text-align: center;
    font-size: 15px;
  }
  
  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid #eef1f5;
  }
  
  .status {
    display: flex;
    align-items: center;
    gap: 8px;
  
    padding: 10px 12px;
  
    border-radius: 9px;
  
    background: #f8fafc;
    color: #64748b;
  
    font-size: 12px;
  }
  
  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
  }
  </style>