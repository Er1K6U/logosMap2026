<template>
  <div class="relative w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
    <!-- Panel de información superior -->
    <div class="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-20">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-lg font-bold text-gray-800">
            {{ departamentoActual ? departamentoActual.nombre : 'Colombia' }}
          </h3>
          <p class="text-sm text-gray-600">{{ entidadesVisibles.length }} entidad(es)</p>
        </div>
        <button
          v-if="departamentoActual"
          @click="limpiarSeleccion"
          class="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
        >
          Ver todo
        </button>
      </div>

      <!-- Lista de entidades visibles -->
      <div v-if="entidadesVisibles.length > 0" class="mt-3 max-h-60 overflow-y-auto">
        <p class="text-xs font-semibold text-gray-700 mb-2">Entidades:</p>
        <ul class="space-y-1">
          <li
            v-for="entidad in entidadesVisibles"
            :key="entidad.id"
            class="text-xs bg-blue-50 p-2 rounded hover:bg-blue-100 cursor-pointer"
            @click="seleccionarEntidad(entidad)"
          >
            {{ entidad.nombre }}
          </li>
        </ul>
      </div>

      <div v-else class="text-xs text-gray-500 mt-3">No hay entidades en este departamento</div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="flex items-center justify-center min-h-screen">
      <div class="relative w-full max-w-4xl">
        <!-- SVG del mapa -->
        <div ref="mapaContainer" v-html="mapaSVG" class="relative w-full"></div>

        <!-- Capa de marcadores encima del SVG -->
        <div
          v-if="mapaContainer"
          class="absolute top-0 left-0 w-full h-full pointer-events-none"
          :style="{ width: ancho + 'px', height: alto + 'px' }"
        >
          <TransitionGroup name="marcador">
            <div
              v-for="entidad in entidadesVisibles"
              :key="entidad.id"
              class="absolute pointer-events-auto"
              :style="calcularPosicionAbsoluta(entidad.departamento)"
            >
              <MarcadorEntidad
                :entidad="entidad"
                :posicion="{ x: 0, y: 0 }"
                @click="seleccionarEntidad"
              />
            </div>
          </TransitionGroup>
        </div>

        <!-- Mensaje si no hay entidades -->
        <div
          v-if="store.totalEntidades === 0"
          class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div class="bg-white/90 rounded-lg shadow-lg p-6 text-center max-w-md">
            <p class="text-lg font-semibold text-gray-700 mb-2">No hay entidades registradas</p>
            <p class="text-sm text-gray-600">
              Usa el formulario o importa desde Excel para agregar entidades
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { getDepartamentoById } from '@/data/departamentos'
import MarcadorEntidad from './MarcadorEntidad.vue'

const store = useEntidadesStore()
const mapaContainer = ref(null)
const mapaSVG = ref('')
const ancho = ref(0)
const alto = ref(0)

// Cargar SVG del mapa
onMounted(async () => {
  try {
    const response = await fetch('/assets/colombia.svg')
    mapaSVG.value = await response.text()

    // Agregar interactividad al SVG después de cargarlo
    await nextTick()
    setTimeout(() => {
      configurarInteractividadMapa()
      calcularDimensiones()
    }, 100)
  } catch (error) {
    console.error('Error al cargar el mapa SVG:', error)
    mapaSVG.value = '<p class="text-red-600">Error al cargar el mapa de Colombia</p>'
  }
})

function calcularDimensiones() {
  if (mapaContainer.value) {
    const svg = mapaContainer.value.querySelector('svg')
    if (svg) {
      ancho.value = svg.clientWidth
      alto.value = svg.clientHeight
    }
  }
}

function configurarInteractividadMapa() {
  if (!mapaContainer.value) return

  const paths = mapaContainer.value.querySelectorAll('path[id], g[id]')

  paths.forEach((elemento) => {
    elemento.style.cursor = 'pointer'
    elemento.style.transition = 'all 0.3s'

    // Hover effect
    elemento.addEventListener('mouseenter', () => {
      elemento.style.fill = '#3b82f6'
      elemento.style.opacity = '0.7'
    })

    elemento.addEventListener('mouseleave', () => {
      if (store.departamentoSeleccionado !== elemento.id) {
        elemento.style.fill = ''
        elemento.style.opacity = '1'
      }
    })

    // Click en departamento
    elemento.addEventListener('click', () => {
      const depId = elemento.id.toLowerCase()
      store.seleccionarDepartamento(depId)
    })
  })
}

const entidadesVisibles = computed(() => store.entidadesPorDepartamento)

const departamentoActual = computed(() => {
  if (!store.departamentoSeleccionado) return null
  return getDepartamentoById(store.departamentoSeleccionado)
})

function calcularPosicionAbsoluta(departamentoId) {
  const dep = getDepartamentoById(departamentoId)
  if (!dep || !dep.coordenadas) return { left: '0px', top: '0px' }

  const x = (dep.coordenadas.x / 100) * ancho.value
  const y = (dep.coordenadas.y / 100) * alto.value

  return {
    left: `${x}px`,
    top: `${y}px`,
  }
}

function seleccionarEntidad(entidad) {
  console.log('Entidad seleccionada:', entidad)
}

function limpiarSeleccion() {
  store.limpiarSeleccion()
}
</script>

<style scoped>
.marcador-enter-active {
  animation: bounce-in 0.5s;
}

.marcador-leave-active {
  animation: bounce-out 0.3s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-out {
  to {
    transform: scale(0);
    opacity: 0;
  }
}

/* Estilos para el SVG del mapa */
:deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

:deep(path) {
  stroke: #fff;
  stroke-width: 1;
  fill: #cbd5e1;
}
</style>
