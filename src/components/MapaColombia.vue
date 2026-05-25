<template>
  <div
    class="relative w-full bg-cover bg-center flex justify-center overflow-hidden"
    style="background-image: url('/assets/fondo.jpg'); height: calc(100vh - 56px)"
  >
    <!-- Overlay suave -->
    <div class="absolute inset-0 bg-white/65 pointer-events-none">
      <!-- Encabezado presentación -->
      <div class="relative z-20 text-center mt-5 mb-2">
        <h1
          class="text-2xl md:text-5xl font-extrabold text-gray-800 tracking-widest uppercase"
        >
          Hoy nos acompañan
        </h1>
        <div
          class="w-20 h-1 mx-auto mt-2 bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 rounded-full"
        ></div>
      </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="relative z-10 flex items-center justify-center w-full">
      <div
        class="mapa-wrapper"
        style="
          position: relative;
          width: min(calc(100vw - 4px), calc(100vh - 60px));
          height: min(calc(100vw - 4px), calc(100vh - 60px));
          margin: 0 auto;
          overflow: visible;
        "
      >
        <!-- SVG del mapa -->
        <div ref="mapaContainer" v-html="mapaSVG" style="width: 100%; height: 100%"></div>

        <!-- Marcadores con animaciones -->
        <div
          v-for="(entidad, index) in entidadesVisibles"
          :key="entidad.id"
          :class="['marcador-animado', { 'marcador-destacado': entidadDestacadaIndex === index }]"
          :style="{
            position: 'absolute',
            left: calcularPosicion(entidad.departamentoId || entidad.departamento).x + 'px',
            top: calcularPosicion(entidad.departamentoId || entidad.departamento).y + 'px',
            transform: 'translate(-50%, -50%)',
            zIndex: entidadDestacadaIndex === index ? 9999 : 100,
            animationDelay: index * 0.3 + 's',
          }"
          @click="seleccionarEntidad(entidad)"
        >
          <!-- Ondas de pulso -->
          <div class="pulso-onda"></div>
          <div class="pulso-onda" style="animation-delay: 0.5s"></div>

          <div class="circulo-marcador">
            <img
              v-if="entidad.logo"
              :src="obtenerLogoSrc(entidad.logo)"
              class="logo-marcador"
              alt=""
              @error="entidad.logo = ''"
            />
            <span v-else class="iniciales-marcador uppercase">
              {{ entidad.nombre.substring(0, 2).toUpperCase() }}
            </span>
          </div>

          <!-- Etiqueta SOLO cuando es el destacado -->
          <div v-if="entidadDestacadaIndex === index" class="etiqueta-marcador uppercase">
            {{ entidad.nombre }}
          </div>

          <!-- Panel de detalles cuando está destacado -->
          <transition name="detalle">
            <div v-if="entidadDestacadaIndex === index" class="panel-detalles-destacado">
              <h3 class="titulo-destacado uppercase tracking-wider">{{ entidad.nombre }}</h3>
              <p class="info-destacado uppercase font-semibold tracking-wide">
                📍 {{ obtenerNombreDepartamento(entidad.departamento) }}
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Presentador Ovi + Showcase card -->
    <div class="fixed bottom-4 right-4 z-50 flex items-end gap-3 pointer-events-none">
      <!-- Showcase: logo grande de la entidad activa -->
      <transition name="showcase" mode="out-in">
        <div v-if="entidadActiva" :key="entidadActiva.id" class="showcase-card">
          <div class="showcase-logo-wrap">
            <img
              v-if="entidadActiva.logo"
              :src="obtenerLogoSrc(entidadActiva.logo)"
              class="showcase-logo-img"
              alt=""
            />
            <span v-else class="showcase-iniciales">
              {{ entidadActiva.nombre.substring(0, 2).toUpperCase() }}
            </span>
          </div>
          <p class="showcase-nombre">{{ entidadActiva.nombre }}</p>
        </div>
      </transition>

      <!-- Mascota Ovi -->
      <img
        src="/assets/ovi-saludo.svg"
        alt="Ovi"
        class="ovi-img h-[10vh] w-auto select-none"
        :class="{ 'ovi-presentando': oviAnimando }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { getDepartamentoById } from '@/data/departamentos'

const store = useEntidadesStore()
const mapaContainer = ref(null)
const mapaSVG = ref('')
const entidadDestacadaIndex = ref(-1)

let intervaloRotacion = null
let oviTimer = null

const oviAnimando = ref(false)
const posicionesCache = ref({})

const entidadActiva = computed(() => entidadesVisibles.value[entidadDestacadaIndex.value] ?? null)

function limpiarCachePosiciones() {
  posicionesCache.value = {}
}

const pagina = ref(0)
const TAM_PAGINA = 15
const INTERVALO_MS = 8000

const cursorGlobal = ref(0)

const entidadesVisibles = computed(() => {
  const all = store.entidadesPorDepartamento || []
  const start = pagina.value * TAM_PAGINA
  return all.slice(start, start + TAM_PAGINA)
})

const departamentoActual = computed(() => {
  if (!store.departamentoSeleccionado) return null
  return getDepartamentoById(store.departamentoSeleccionado)
})

// Colores predominantes de las banderas oficiales de cada departamento colombiano
const COLORES_BANDERA = {
  coama: '#006B3F', // Amazonas       - verde amazónico
  coant: '#C8A400', // Antioquia      - amarillo dorado
  coara: '#1B5E20', // Arauca         - verde
  coatl: '#1565C0', // Atlántico      - azul Caribe
  cobol: '#F9A825', // Bolívar        - amarillo
  coboy: '#2E7D32', // Boyacá         - verde esmeralda
  cocal: '#B71C1C', // Caldas         - rojo
  cocaq: '#01579B', // Caquetá        - azul marino
  cocas: '#388E3C', // Casanare       - verde
  cocau: '#6A1B9A', // Cauca          - violeta/morado
  coces: '#0D47A1', // Cesar          - azul oscuro
  cocho: '#1B5E20', // Chocó          - verde selva
  cocor: '#C62828', // Córdoba        - rojo
  codc: '#B71C1C',  // Bogotá D.C.   - rojo
  cocun: '#1565C0', // Cundinamarca   - azul
  cogua: '#004D40', // Guainía        - verde oscuro
  coguv: '#2E7D32', // Guaviare       - verde
  cohui: '#C62828', // Huila          - rojo
  colag: '#AD1457', // La Guajira     - rojo oscuro/granate
  comag: '#0D47A1', // Magdalena      - azul
  comet: '#01579B', // Meta           - azul marino
  conar: '#455A64', // Nariño         - gris azulado/negro
  consa: '#1976D2', // Norte Santander- azul
  coput: '#2E7D32', // Putumayo       - verde
  coqui: '#43A047', // Quindío        - verde esmeralda
  coris: '#C62828', // Risaralda      - rojo
  cosap: '#0277BD', // San Andrés     - azul Caribe
  cosan: '#E65100', // Santander      - naranja/rojo
  cosuc: '#1565C0', // Sucre          - azul
  cotol: '#D32F2F', // Tolima         - rojo
  covau: '#1B5E20', // Vaupés         - verde oscuro
  covac: '#388E3C', // Valle del Cauca- verde
  covid: '#558B2F', // Vichada        - verde claro
}

onMounted(async () => {
  try {
    store.cargarDesdeLocalStorage()
  } catch (e) {
    console.warn('No se pudo cargar desde localStorage:', e)
  }

  try {
    const response = await fetch('/assets/colombia.svg')
    mapaSVG.value = await response.text()

    try {
      const { departamentos } = await import('@/data/departamentos')

      const temp = document.createElement('div')
      temp.innerHTML = mapaSVG.value
      const svg = temp.querySelector('svg')

      const idsSVG = new Set(
        Array.from(svg.querySelectorAll('[id]'))
          .map((el) => String(el.id || '').toLowerCase().trim())
          .filter(Boolean),
      )

      const faltantes = departamentos
        .map((d) => String(d.id || '').toLowerCase().trim())
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

    setTimeout(async () => {
      configurarInteractividadMapa()
      aplicarEstiloBanderaSVG()

      limpiarCachePosiciones()
      window.dispatchEvent(new Event('resize'))
      await nextTick()

      iniciarRotacionAutomatica()
      window.addEventListener('resize', limpiarCachePosiciones)
    }, 100)
  } catch (error) {
    console.error('Error al cargar el mapa SVG:', error)
    mapaSVG.value = '<p style="color: red;">Error al cargar el mapa de Colombia</p>'
  }
})

onUnmounted(() => {
  if (intervaloRotacion) clearInterval(intervaloRotacion)
  if (oviTimer) clearTimeout(oviTimer)
  window.removeEventListener('resize', limpiarCachePosiciones)
})

function configurarInteractividadMapa() {
  if (!mapaContainer.value) return

  const paths = mapaContainer.value.querySelectorAll('path[id], g[id]')

  paths.forEach((elemento) => {
    elemento.style.cursor = 'pointer'
    elemento.style.transition = 'all 0.3s ease'

    elemento.addEventListener('mouseenter', () => {
      elemento.style.filter = 'brightness(1.18) drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
      elemento.style.strokeWidth = '2.5'
    })

    elemento.addEventListener('mouseleave', () => {
      elemento.style.filter = ''
      elemento.style.strokeWidth = '1.5'
    })

    elemento.addEventListener('click', () => {
      const depId = elemento.id.toLowerCase()
      store.seleccionarDepartamento(depId)
    })
  })
}

function aplicarEstiloBanderaSVG() {
  const container = mapaContainer.value
  if (!container) return

  const svg = container.querySelector('svg')
  if (!svg) return

  // Aplica color de bandera individual a cada departamento
  const shapes = svg.querySelectorAll('path[id], g[id]')
  shapes.forEach((el) => {
    const depId = String(el.id || '').toLowerCase()
    const color = COLORES_BANDERA[depId] || '#5B8DB8'

    el.style.fill = color
    el.style.fillOpacity = '0.78'
    el.style.stroke = '#ffffff'
    el.style.strokeWidth = '1.5'
    el.style.vectorEffect = 'non-scaling-stroke'
    el.style.transition = 'all 0.3s ease'
  })

  // Amplía San Andrés y Providencia para mayor visibilidad
  ajustarSanAndres(svg)
}

function ajustarSanAndres(svg) {
  const cosap = svg.querySelector('#COSAP') || svg.querySelector('#cosap')
  if (!cosap) return
  try {
    const bbox = cosap.getBBox()
    if (!bbox.width || bbox.width < 0.5) return

    const SCALE = 5
    // Esquina superior izquierda (Noroeste): posición geográfica real de San Andrés
    const targetCX = 200
    const targetCY = 120

    const bboxCX = bbox.x + bbox.width / 2
    const bboxCY = bbox.y + bbox.height / 2

    // translate(tx,ty) scale(S) → punto (bboxCX,bboxCY) aparece en (targetCX,targetCY)
    const tx = targetCX - bboxCX * SCALE
    const ty = targetCY - bboxCY * SCALE

    cosap.setAttribute('transform', `translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${SCALE})`)
    cosap.style.strokeWidth = `${(1.5 / SCALE).toFixed(3)}`

    // Marco de inserción alrededor del grupo escalado
    const NS = 'http://www.w3.org/2000/svg'
    const pad = 14
    const bW = bbox.width * SCALE + pad * 2
    const bH = bbox.height * SCALE + pad * 2
    const bX = targetCX - bW / 2
    const bY = targetCY - bH / 2

    const oldFrame = svg.querySelector('#cosap-frame')
    if (oldFrame) oldFrame.remove()

    const frame = document.createElementNS(NS, 'g')
    frame.setAttribute('id', 'cosap-frame')
    frame.setAttribute('pointer-events', 'none')

    const bgRect = document.createElementNS(NS, 'rect')
    bgRect.setAttribute('x', String(bX.toFixed(1)))
    bgRect.setAttribute('y', String(bY.toFixed(1)))
    bgRect.setAttribute('width', String(bW.toFixed(1)))
    bgRect.setAttribute('height', String(bH.toFixed(1)))
    bgRect.setAttribute('rx', '6')
    bgRect.setAttribute('fill', 'rgba(2,119,189,0.08)')
    bgRect.setAttribute('stroke', '#0277BD')
    bgRect.setAttribute('stroke-width', '2')

    const label = document.createElementNS(NS, 'text')
    label.setAttribute('x', String((bX + bW / 2).toFixed(1)))
    label.setAttribute('y', String((bY + bH + 18).toFixed(1)))
    label.setAttribute('text-anchor', 'middle')
    label.setAttribute('font-size', '14')
    label.setAttribute('font-weight', 'bold')
    label.setAttribute('fill', '#01579B')
    label.setAttribute('font-family', 'sans-serif')
    label.textContent = 'SAN ANDRÉS'

    frame.appendChild(bgRect)
    frame.appendChild(label)
    svg.insertBefore(frame, cosap)
  } catch (e) {
    console.warn('San Andrés adjust failed:', e)
  }
}

function iniciarRotacionAutomatica() {
  if (intervaloRotacion) clearInterval(intervaloRotacion)

  const all = store.entidadesPorDepartamento || []
  const total = all.length
  if (total === 0) return

  cursorGlobal.value = 0
  pagina.value = 0
  entidadDestacadaIndex.value = 0

  intervaloRotacion = setInterval(() => {
    const allNow = store.entidadesPorDepartamento || []
    const totalNow = allNow.length
    if (totalNow === 0) return

    cursorGlobal.value = (cursorGlobal.value + 1) % totalNow

    const nuevaPagina = Math.floor(cursorGlobal.value / TAM_PAGINA)
    const nuevoIndex = cursorGlobal.value % TAM_PAGINA

    pagina.value = nuevaPagina
    entidadDestacadaIndex.value = nuevoIndex
  }, INTERVALO_MS)
}

watch(
  () => [store.departamentoSeleccionado, store.entidades.length],
  () => {
    cursorGlobal.value = 0
    pagina.value = 0
    entidadDestacadaIndex.value = 0
    iniciarRotacionAutomatica()
  },
  { immediate: true },
)

watch(entidadDestacadaIndex, () => {
  if (oviTimer) clearTimeout(oviTimer)
  oviAnimando.value = true
  oviTimer = setTimeout(() => {
    oviAnimando.value = false
    oviTimer = null
  }, 480)
})

function obtenerLogoSrc(logo) {
  if (!logo) return ''
  const v = String(logo).trim()
  if (/^(https?:\/\/)/i.test(v) || /^data:image\//i.test(v)) return v
  if (v.startsWith('/')) return v
  if (v.startsWith('assets/')) return '/' + v
  if (v.startsWith('logos/')) return '/' + v
  return '/assets/logos/' + v
}

function calcularPosicion(departamentoId) {
  const cacheKey = String(departamentoId || '').toLowerCase().trim()
  if (cacheKey && posicionesCache.value[cacheKey]) {
    return posicionesCache.value[cacheKey]
  }

  const container = mapaContainer.value
  if (!container) return { x: 400, y: 400 }

  const svg = container.querySelector('svg')
  if (!svg) return { x: 400, y: 400 }

  const depId = String(departamentoId || '').trim()
  if (!depId) return { x: 400, y: 400 }

  const selector1 = `#${CSS.escape(depId)}`
  const selector2 = `#${CSS.escape(depId.toLowerCase())}`
  const selector3 = `#${CSS.escape(depId.toUpperCase())}`

  const circleEl =
    svg.querySelector(`circle${selector1}`) ||
    svg.querySelector(`circle${selector2}`) ||
    svg.querySelector(`circle${selector3}`)

  const depEl =
    circleEl ||
    svg.querySelector(selector1) ||
    svg.querySelector(selector2) ||
    svg.querySelector(selector3)

  if (!depEl) {
    const dep = getDepartamentoById(depId)
    if (!dep?.coordenadas) return { x: 400, y: 400 }
    const x = (dep.coordenadas.x / 1000) * 800
    const y = (dep.coordenadas.y / 1000) * 800
    return { x, y }
  }

  if (circleEl) {
    const cx = parseFloat(circleEl.getAttribute('cx') || '0')
    const cy = parseFloat(circleEl.getAttribute('cy') || '0')

    const pt = svg.createSVGPoint()
    pt.x = cx
    pt.y = cy

    const ctm = svg.getScreenCTM()
    if (ctm) {
      const screenPt = pt.matrixTransform(ctm)
      const containerRect = container.getBoundingClientRect()
      const x = screenPt.x - containerRect.left
      const y = screenPt.y - containerRect.top
      const pos = { x, y }
      posicionesCache.value[cacheKey || depId] = pos
      return pos
    }
  }

  const containerRect = container.getBoundingClientRect()
  const r = depEl.getBoundingClientRect()

  const x = (r.left + r.right) / 2 - containerRect.left
  const y = (r.top + r.bottom) / 2 - containerRect.top

  const pos = { x, y }
  posicionesCache.value[cacheKey || depId] = pos
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
</script>

<style scoped>
/* ── Mapa SVG: efecto 3D con sombras profundas capas múltiples ── */
:deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  filter:
    drop-shadow(0 55px 90px rgba(0, 0, 0, 0.55))
    drop-shadow(0 22px 38px rgba(0, 0, 0, 0.38))
    drop-shadow(0 8px 16px rgba(0, 0, 0, 0.22))
    drop-shadow(4px 6px 10px rgba(0, 0, 0, 0.18));
}

:deep(path) {
  stroke: #fff;
  stroke-width: 1.5;
}

/* Contenedor del mapa con sombra de "elevación" */
.mapa-wrapper {
  border-radius: 4px;
}

/* ── Marcadores ── */
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

/* Ondas de pulso */
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
  text-transform: uppercase;
  letter-spacing: 1px;
}

.logo-marcador {
  width: 54px;
  height: 54px;
  object-fit: contain;
  background: white;
  border-radius: 12px;
  padding: 6px;
}

/* Etiqueta nombre — en mayúscula */
.etiqueta-marcador {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: white;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
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
  top: 118px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 14px;
  padding: 12px 14px;
  min-width: 220px;
  max-width: 320px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 3px solid #dc2626;
  pointer-events: none;
}

.titulo-destacado {
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 5px 0;
  text-align: center;
  font-size: 13px;
  line-height: 1.2;
  word-break: break-word;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.info-destacado {
  font-size: 11px;
  color: #4b5563;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.8px;
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

/* ── Mascota Ovi ── */
.ovi-img {
  transform-origin: bottom center;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.28));
  animation:
    oviEntrada 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
    oviFlotar 3s 0.9s ease-in-out infinite;
}

.ovi-presentando {
  animation: oviLanzar 0.48s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
}

@keyframes oviEntrada {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.7);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes oviFlotar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}

@keyframes oviLanzar {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) scale(1.1) rotate(-6deg);
  }
  60% {
    transform: translateY(-10px) scale(1.05) rotate(4deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

/* ── Showcase card ── */
.showcase-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 108px;
  max-width: 148px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.85);
}

.showcase-logo-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  overflow: hidden;
  flex-shrink: 0;
}

.showcase-logo-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.showcase-iniciales {
  font-size: 24px;
  font-weight: 800;
  color: #dc2626;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.showcase-nombre {
  font-size: 10px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  max-width: 120px;
}

/* Showcase crossfade */
.showcase-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.showcase-leave-active {
  transition: all 0.2s ease-in;
}
.showcase-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.9);
}
.showcase-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ovi-img,
  .ovi-presentando {
    animation: none !important;
  }
  .showcase-enter-active,
  .showcase-leave-active {
    transition: opacity 0.15s ease !important;
  }
  .showcase-enter-from,
  .showcase-leave-to {
    transform: none !important;
  }
}
</style>
