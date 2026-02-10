<template>
  <div
    class="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform group"
    :style="estilosPosicion"
    @click="$emit('click', entidad)"
  >
    <!-- Pin del marcador -->
    <div class="relative">
      <div
        class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500 hover:border-blue-600"
      >
        <img
          v-if="entidad.logo"
          :src="`/assets/${entidad.logo}`"
          :alt="entidad.nombre"
          class="w-10 h-10 object-contain rounded-full"
          @error="manejarErrorImagen"
        />
        <span v-else class="text-xs font-bold text-blue-600">
          {{ iniciales }}
        </span>
      </div>

      <!-- Tooltip -->
      <div
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
      >
        <div class="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {{ entidad.nombre }}
        </div>
        <!-- Flecha del tooltip -->
        <div
          class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  entidad: {
    type: Object,
    required: true,
  },
  posicion: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const imagenCargada = ref(true)

const estilosPosicion = computed(() => ({
  left: `${props.posicion.x}px`,
  top: `${props.posicion.y}px`,
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
</script>
