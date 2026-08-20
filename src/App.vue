<template>
  <div class="app-shell">
    <AppSidebar />

    <div class="main-area">
      <AppHeader />

      <main class="page-content">
        <RouterView v-slot="{ Component }">
          <KeepAlive :max="5">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

body {
  font-family:
    Inter,
    "PingFang SC",
    "Microsoft YaHei",
    Arial,
    sans-serif;

  background: #f5f7fb;
  color: #1f2937;
}

.app-shell {
  min-height: 100vh;
}

.main-area {
  margin-left: 232px;
  min-height: 100vh;
}

.page-content {
  padding: 30px 32px;
}
</style>
