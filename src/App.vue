<template>
  <div id="app">
    <!-- Barra de navegación -->
    <nav class="bg-white/80 backdrop-blur border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-14">
          <!-- Logo/Título -->
          <div class="flex items-center">
            <h1 class="text-lg font-extrabold tracking-tight text-gray-900">
              🗺️ <span class="text-blue-600">LogosMap</span> <span class="text-gray-400">2026</span>
            </h1>
          </div>

          <!-- Enlaces de navegación -->
          <div class="flex gap-2">
            <RouterLink
              to="/"
              class="px-3 py-1.5 rounded-lg text-sm font-semibold transition"
              :class="
                $route.path === '/' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              "
            >
              Mapa
            </RouterLink>
            <RouterLink
              to="/admin"
              class="px-4 py-2 rounded-lg font-medium transition"
              :class="
                $route.path === '/admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              "
            >
              Administración
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido de las páginas -->
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>
