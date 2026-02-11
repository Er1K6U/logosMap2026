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
        <!-- Logo o iniciales -->
        <img
          v-if="entidad.logo && imagenCargada"
          :src="`/assets/logos/${entidad.logo}`"
          :alt="entidad.nombre"
          class="logo-entidad"
          @error="manejarErrorImagen"
        />
        <span v-else class="iniciales">{{ iniciales }}</span>
      </div>
    </div>

    <!-- Etiqueta con nombre (siempre visible con fade) -->
    <div class="etiqueta-nombre">
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
import { ref, computed, onMounted } from 'vue'

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
  const palabras = props.entidad.nombre.split(' ')
  if (palabras.length >= 2) {
    return palabras[0][0] + palabras[1][0]
  }
  return props.entidad.nombre.substring(0, 2)
})

function manejarErrorImagen() {
  imagenCargada.value = false
}

onMounted(() => {
  setTimeout(() => {
    mostrarEntrada.value = true
  }, 100)
})
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
  width: 48px;
  height: 48px;
}

/* Ondas de pulso continuo */
.pulso-onda {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.4);
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
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
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
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 50%;
}

.iniciales {
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
}

/* Etiqueta con nombre */
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
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

/* Panel de detalles cuando está destacado */
.panel-detalles {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: 2px solid #ef4444;
}

.contenido-detalles {
  text-align: center;
}

.titulo-entidad {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.departamento-info {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0;
}

.descripcion {
  font-size: 13px;
  color: #4b5563;
  margin: 12px 0 0 0;
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
</style>
