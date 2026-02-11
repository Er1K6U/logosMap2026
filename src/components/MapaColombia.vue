<template>
  <div
    class="relative w-full min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-6"
  >
    <!-- Panel de información superior -->
    <div v-if="false" class="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-20">
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
    <div class="flex items-center justify-center w-full">
      <div style="position: relative; width: 980px; height: 980px; overflow: hidden">
        <!-- SVG del mapa -->
        <div ref="mapaContainer" v-html="mapaSVG" style="width: 100%; height: 100%"></div>

        <!-- Marcadores con animaciones -->
        <div
          v-for="(entidad, index) in entidadesVisibles"
          :key="entidad.id"
          :class="['marcador-animado', { 'marcador-destacado': entidadDestacadaIndex === index }]"
          :style="{
            position: 'absolute',
            left: calcularPosicion(entidad.departamento).x + 'px',
            top: calcularPosicion(entidad.departamento).y + 'px',
            transform: 'translate(-50%, -50%)',
            zIndex: entidadDestacadaIndex === index ? 9999 : 100,
            animationDelay: index * 0.3 + 's',
          }"
          @click="seleccionarEntidad(entidad)"
        >
          <!-- Ondas de pulso -->
          <div class="pulso-onda"></div>
          <div class="pulso-onda" style="animation-delay: 0.5s"></div>

          <!-- Círculo principal -->
          <div class="circulo-marcador">
            <span class="iniciales-marcador">
              {{ entidad.nombre.substring(0, 2).toUpperCase() }}
            </span>
          </div>

          <!-- Etiqueta nombre -->
          <div class="etiqueta-marcador">
            {{ entidad.nombre }}
          </div>

          <!-- Panel de detalles cuando está destacado -->
          <transition name="detalle">
            <div v-if="entidadDestacadaIndex === index" class="panel-detalles-destacado">
              <h3 class="titulo-destacado">{{ entidad.nombre }}</h3>
              <p class="info-destacado">📍 {{ obtenerNombreDepartamento(entidad.departamento) }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { getDepartamentoById } from '@/data/departamentos'

const store = useEntidadesStore()
const mapaContainer = ref(null)
const mapaSVG = ref('')
const entidadDestacadaIndex = ref(-1)
let intervaloRotacion = null

// Cache de posiciones calculadas por SVG (evita recalcular en cada render)
const posicionesCache = ref({})

function limpiarCachePosiciones() {
  posicionesCache.value = {}
}

onMounted(async () => {
  try {
    const response = await fetch('/assets/colombia.svg')
    mapaSVG.value = await response.text()

    // ✅ PASO 2: Validación de IDs (departamentos.js vs colombia.svg)
    try {
      const { departamentos } = await import('@/data/departamentos')

      // Creamos un set con todos los ids que existen en el SVG
      const temp = document.createElement('div')
      temp.innerHTML = mapaSVG.value
      const svg = temp.querySelector('svg')

      const idsSVG = new Set(
        Array.from(svg.querySelectorAll('[id]'))
          .map((el) =>
            String(el.id || '')
              .toLowerCase()
              .trim(),
          )
          .filter(Boolean),
      )

      // Comparamos contra departamentos.js
      const faltantes = departamentos
        .map((d) =>
          String(d.id || '')
            .toLowerCase()
            .trim(),
        )
        .filter((id) => id && !idsSVG.has(id))

      if (faltantes.length) {
        console.warn('❌ IDs en departamentos.js que NO existen en el SVG:', faltantes)
      } else {
        console.log('✅ OK: Todos los IDs de departamentos.js existen en el SVG')
      }
    } catch (e) {
      console.warn('No se pudo validar IDs:', e)
    }

    await nextTick()
    setTimeout(() => {
      configurarInteractividadMapa()
      iniciarRotacionAutomatica()
      // Si cambia el tamaño de la ventana, recalculamos posiciones
      window.addEventListener('resize', limpiarCachePosiciones)
    }, 100)
  } catch (error) {
    console.error('Error al cargar el mapa SVG:', error)
    mapaSVG.value = '<p style="color: red;">Error al cargar el mapa de Colombia</p>'
  }
})

onUnmounted(() => {
  if (intervaloRotacion) {
    clearInterval(intervaloRotacion)
  }
  window.removeEventListener('resize', limpiarCachePosiciones)
})

function configurarInteractividadMapa() {
  if (!mapaContainer.value) return

  const paths = mapaContainer.value.querySelectorAll('path[id], g[id]')

  paths.forEach((elemento) => {
    elemento.style.cursor = 'pointer'
    elemento.style.transition = 'all 0.3s'

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

    elemento.addEventListener('click', () => {
      const depId = elemento.id.toLowerCase()
      store.seleccionarDepartamento(depId)
    })
  })
}

// Nueva función: Rotación automática de entidades destacadas
function iniciarRotacionAutomatica() {
  setTimeout(() => {
    if (entidadesVisibles.value.length > 0) {
      entidadDestacadaIndex.value = 0

      intervaloRotacion = setInterval(() => {
        if (entidadesVisibles.value.length === 0) return

        entidadDestacadaIndex.value =
          (entidadDestacadaIndex.value + 1) % entidadesVisibles.value.length

        console.log('🎯 Destacando:', entidadesVisibles.value[entidadDestacadaIndex.value]?.nombre)
      }, 8000)
    }
  }, 2000)
}

const entidadesVisibles = computed(() => store.entidadesPorDepartamento)

const departamentoActual = computed(() => {
  if (!store.departamentoSeleccionado) return null
  return getDepartamentoById(store.departamentoSeleccionado)
})

function calcularPosicion(departamentoId) {
  // cache para no recalcular en cada render
  if (posicionesCache.value[departamentoId]) {
    return posicionesCache.value[departamentoId]
  }

  const container = mapaContainer.value
  if (!container) return { x: 400, y: 400 }

  const svg = container.querySelector('svg')
  if (!svg) return { x: 400, y: 400 }

  const depId = String(departamentoId || '').trim()
  if (!depId) return { x: 400, y: 400 }

  // Intentamos varias formas por si el SVG maneja IDs en mayúscula/minúscula
  const selector1 = `#${CSS.escape(depId)}`
  const selector2 = `#${CSS.escape(depId.toLowerCase())}`
  const selector3 = `#${CSS.escape(depId.toUpperCase())}`

  // ✅ 1) Preferimos el círculo "oficial" del SVG si existe (trae cx/cy exactos)
  const circleEl =
    svg.querySelector(`circle${selector1}`) ||
    svg.querySelector(`circle${selector2}`) ||
    svg.querySelector(`circle${selector3}`)

  // ✅ 2) Si no hay círculo, caemos al path/g
  const depEl =
    circleEl ||
    svg.querySelector(selector1) ||
    svg.querySelector(selector2) ||
    svg.querySelector(selector3)

  if (!depEl) {
    // fallback viejo (por si un depto no existe en el SVG)
    const dep = getDepartamentoById(depId)
    if (!dep?.coordenadas) return { x: 400, y: 400 }

    const x = (dep.coordenadas.x / 1000) * 800
    const y = (dep.coordenadas.y / 1000) * 800
    return { x, y }
  }

  // ✅ Centro real del departamento en pixeles de pantalla
  // ✅ Convertimos desde coordenadas del SVG (viewBox) a pixeles del contenedor
  const vb = svg.viewBox?.baseVal
  const cw = container.clientWidth
  const ch = container.clientHeight

  if (circleEl) {
    const cx = parseFloat(circleEl.getAttribute('cx') || '0')
    const cy = parseFloat(circleEl.getAttribute('cy') || '0')

    if (vb && vb.width && vb.height) {
      const x = ((cx - vb.x) / vb.width) * cw
      const y = ((cy - vb.y) / vb.height) * ch

      const pos = { x, y }
      posicionesCache.value[departamentoId] = pos
      console.log(`🎯 CIRCLE ${departamentoId}: x=${Math.round(x)} y=${Math.round(y)}`)
      return pos
    }
  }

  // Fallback: si no hay círculo o no hay viewBox, usamos bbox en pantalla
  const containerRect = container.getBoundingClientRect()
  const r = depEl.getBoundingClientRect()

  const x = (r.left + r.right) / 2 - containerRect.left
  const y = (r.top + r.bottom) / 2 - containerRect.top

  const pos = { x, y }
  posicionesCache.value[departamentoId] = pos

  console.log(`✅ POS SVG ${departamentoId}: x=${Math.round(x)} y=${Math.round(y)}`)
  console.log(`✅ POS CONT ${departamentoId}: x=${Math.round(x)} y=${Math.round(y)}`)
  return pos
}

function obtenerNombreDepartamento(departamentoId) {
  const dep = getDepartamentoById(departamentoId)
  return dep ? dep.nombre : departamentoId
}

function seleccionarEntidad(entidad) {
  console.log('Entidad seleccionada:', entidad)
}

function limpiarSeleccion() {
  store.limpiarSeleccion()
}

function getSVGInfo() {
  if (!mapaContainer.value) return null

  const svg = mapaContainer.value.querySelector('svg')
  if (!svg) return null

  const rect = svg.getBoundingClientRect()
  const vb = svg.viewBox?.baseVal

  // Si el SVG no trae viewBox, fallback a width/height
  const fallbackWidth = Number(svg.getAttribute('width')) || 800
  const fallbackHeight = Number(svg.getAttribute('height')) || 800

  const viewBox = vb
    ? { x: vb.x, y: vb.y, width: vb.width, height: vb.height }
    : { x: 0, y: 0, width: fallbackWidth, height: fallbackHeight }

  return { svg, rect, viewBox }
}
</script>

<style scoped>
:deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

:deep(path) {
  stroke: #fff;
  stroke-width: 1;
  fill: #cbd5e1;
}

/* Animaciones de marcadores */
.marcador-animado {
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  animation: entradaMarcador 0.8s ease-out forwards;
}

@keyframes entradaMarcador {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0) rotate(-180deg);
  }
  60% {
    transform: translate(-50%, -50%) scale(1.2) rotate(20deg);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
}

.marcador-destacado {
  transform: translate(-50%, -50%) scale(1.5) !important;
}

/* Ondas de pulso continuo */
.pulso-onda {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.4);
  animation: pulsoContinuo 2s ease-out infinite;
  pointer-events: none;
}

@keyframes pulsoContinuo {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

/* Círculo del marcador */
.circulo-marcador {
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  transition: transform 0.2s;
  animation: resplandor 3s ease-in-out infinite;
}

@keyframes resplandor {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }
  50% {
    box-shadow:
      0 4px 20px rgba(220, 38, 38, 0.8),
      0 0 30px rgba(220, 38, 38, 0.4);
  }
}

.iniciales-marcador {
  color: white;
  font-weight: bold;
  font-size: 18px;
}

/* Etiqueta nombre */
.etiqueta-marcador {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  animation: fadeInOut 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Panel de detalles destacado */
.panel-detalles-destacado {
  position: absolute;
  top: 130px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 3px solid #dc2626;
  pointer-events: none;
}

.titulo-destacado {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
  text-align: center;
}

.info-destacado {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

/* Transición del panel */
.detalle-enter-active,
.detalle-leave-active {
  transition: all 0.5s ease;
}

.detalle-enter-from,
.detalle-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
