<template>
  <div id="app">
    <!-- Barra de navegación -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Título -->
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">🗺️ LogosMap 2026</h1>
          </div>

          <!-- Enlaces de navegación -->
          <div class="flex gap-4">
            <RouterLink
              to="/"
              class="px-4 py-2 rounded-lg font-medium transition"
              :class="
                $route.path === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>
