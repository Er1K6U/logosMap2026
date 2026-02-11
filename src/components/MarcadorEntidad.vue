<template>
  <div
    class="marcador-container"
    :class="{ destacado: esDestacado, 'entrada-animada': mostrarEntrada }"
    :style="estilosPosicion"
  >
    <!-- Círculo de marcador con pulso -->
    <div class="marcador-circulo">
      <!-- Efecto de pulso continuo -->
      <div class="pulso-onda"></div>
      <div class="pulso-onda" style="animation-delay: 0.5s"></div>

      <!-- Círculo principal -->
      <div class="circulo-principal">
        <img
          v-if="entidad.logo && imagenCargada"
          :src="obtenerLogoSrc(entidad.logo)"
          :alt="entidad.nombre"
          class="logo-entidad"
          @error="manejarErrorImagen"
        />
        <span v-else class="iniciales">{{ iniciales }}</span>

        <!-- ✅ badge para cuando este marcador representa “agrupado” -->
        <span v-if="entidad.extraCount && entidad.extraCount > 0" class="badge-mas">
          +{{ entidad.extraCount }}
        </span>
      </div>
    </div>

    <!-- ✅ SOLO el destacado muestra nombre (evita saturación) -->
    <div v-if="esDestacado" class="etiqueta-nombre">
      {{ entidad.nombre }}
    </div>

    <!-- Panel de detalles (solo cuando está destacado) -->
    <transition name="detalle">
      <div v-if="esDestacado" class="panel-detalles">
        <div class="contenido-detalles">
          <h3 class="titulo-entidad">{{ entidad.nombre }}</h3>
          <p class="departamento-info">📍 {{ entidad.departamento }}</p>
          <p v-if="entidad.descripcion" class="descripcion">
            {{ entidad.descripcion }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  entidad: {
    type: Object,
    required: true,
  },
  posicion: {
    type: Object,
    required: true,
  },
  esDestacado: {
    type: Boolean,
    default: false,
  },
  indice: {
    type: Number,
    default: 0,
  },
})

const imagenCargada = ref(true)
const mostrarEntrada = ref(false)

const estilosPosicion = computed(() => ({
  left: `${props.posicion.x}px`,
  top: `${props.posicion.y}px`,
  animationDelay: `${props.indice * 0.3}s`,
}))

const iniciales = computed(() => {
  const nombre = String(props.entidad?.nombre || '').trim()
  if (!nombre) return '--'

  const palabras = nombre.split(/\s+/).filter(Boolean)
  if (palabras.length >= 2) return (palabras[0][0] + palabras[1][0]).toUpperCase()

  return nombre.substring(0, 2).toUpperCase()
})

function manejarErrorImagen() {
  imagenCargada.value = false
}

function obtenerLogoSrc(logo) {
  if (!logo) return ''

  const s = String(logo).trim()

  // Si ya viene como URL completa o dataURL, lo usamos tal cual
  if (/^(https?:)?\/\//i.test(s) || s.startsWith('data:')) return s

  // Normalizar
  const clean = s.replace(/^\.?\//, '') // quita ./ o /

  // Si ya viene con "assets/logos/..." o "logos/..."
  if (clean.startsWith('assets/logos/')) return `/${clean}`
  if (clean.startsWith('logos/')) return `/${clean}`

  // Si solo viene el nombre "archivo.png", asumimos que está en /assets/logos/
  return `/assets/logos/${clean}`
}

onMounted(() => {
  setTimeout(() => {
    mostrarEntrada.value = true
  }, 100)
})

// ✅ Si cambia el logo, reintentamos cargar la imagen
watch(
  () => props.entidad?.logo,
  () => {
    imagenCargada.value = true
  }
)
</script>

<style scoped>
.marcador-container {
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
  opacity: 0;
}

/* Animación de entrada */
.marcador-container.entrada-animada {
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

/* Cuando está destacado */
.marcador-container.destacado {
  z-index: 100;
  transform: translate(-50%, -50%) scale(1.5);
}

/* Círculo del marcador */
.marcador-circulo {
  position: relative;
  width: 38px;
  height: 38px;
}

/* Ondas de pulso continuo */
.pulso-onda {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.35);
  animation: pulsoContinuo 2s ease-out infinite;
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

/* Círculo principal */
.circulo-principal {
  position: relative;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.9);
  z-index: 2;
  animation: resplandor 3s ease-in-out infinite;
}

@keyframes resplandor {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow:
      0 4px 20px rgba(239, 68, 68, 0.8),
      0 0 30px rgba(239, 68, 68, 0.4);
  }
}

.logo-entidad {
  width: 28px;
  height: 28px;
  object-fit: contain;
  padding: 4px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.iniciales {
  font-size: 13px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
}

/* ✅ Etiqueta negra SOLO en destacado */
.etiqueta-nombre {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* ✅ Panel de detalles más compacto (para que no invada tanto) */
.panel-detalles {
  position: absolute;
  top: 86px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  padding: 12px 14px;
  min-width: 220px;
  max-width: 320px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: 2px solid #ef4444;
  pointer-events: none;
}

.contenido-detalles {
  text-align: center;
}

.titulo-entidad {
  font-size: 14px;
  font-weight: 900;
  color: #1f2937;
  margin: 0 0 6px 0;
  line-height: 1.2;
  word-break: break-word;
}

.departamento-info {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.descripcion {
  font-size: 12px;
  color: #4b5563;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

/* Transición del panel de detalles */
.detalle-enter-active,
.detalle-leave-active {
  transition: all 0.5s ease;
}

.detalle-enter-from,
.detalle-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.badge-mas {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
</style>
