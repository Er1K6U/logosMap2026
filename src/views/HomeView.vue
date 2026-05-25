<template>
  <div class="home">
    <MapaColombia />
  </div>
</template>

<script setup>
import MapaColombia from '@/components/MapaColombia.vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { onMounted } from 'vue'

const store = useEntidadesStore()

// Cargar datos al iniciar
onMounted(() => {
  store.cargarDesdeLocalStorage()
})
</script>

<style scoped>
.home {
  width: 100%;
  height: calc(100vh - 56px);
  overflow: hidden;
}
</style>
