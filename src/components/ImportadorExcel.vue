<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Importar desde Excel</h2>

    <div class="space-y-4">
      <!-- Descargar plantilla -->
      <div>
        <button
          @click="descargarPlantilla"
          class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition font-medium"
        >
          📥 Descargar Plantilla Excel
        </button>
        <p class="text-xs text-gray-500 mt-1">
          Usa esta plantilla para organizar tus datos correctamente
        </p>
      </div>

      <!-- Subir archivo -->
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700">
          Seleccionar archivo Excel
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          @change="manejarArchivo"
          ref="inputArchivo"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <!-- Cargando -->
      <div v-if="cargando" class="text-center py-4">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <p class="text-sm text-gray-600 mt-2">Procesando archivo...</p>
      </div>

      <!-- Errores -->
      <div
        v-if="errores.length > 0"
        class="bg-red-50 border border-red-300 rounded p-3"
      >
        <p class="font-medium text-red-800 mb-2">⚠️ Errores encontrados:</p>
        <ul class="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
          <li v-for="(error, i) in errores" :key="i">• {{ error }}</li>
        </ul>
      </div>

      <!-- Vista previa -->
      <div
        v-if="entidadesImportadas.length > 0"
        class="border rounded p-3 bg-blue-50"
      >
        <p class="font-medium text-blue-900 mb-2">
          ✓ {{ entidadesImportadas.length }} entidad(es) lista(s) para importar:
        </p>
        <ul class="text-sm space-y-1 max-h-40 overflow-y-auto text-blue-800">
          <li v-for="(entidad, i) in entidadesImportadas" :key="i">
            {{ i + 1 }}. {{ entidad.nombre }} -
            {{ obtenerNombreDepartamento(entidad.departamento) }}
          </li>
        </ul>
      </div>

      <!-- Mensaje de éxito -->
      <div
        v-if="mensajeExito"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded"
      >
        {{ mensajeExito }}
      </div>

      <!-- Botón importar -->
      <button
        v-if="entidadesImportadas.length > 0 && !mensajeExito"
        @click="confirmarImportacion"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
      >
        Importar {{ entidadesImportadas.length }} entidad(es)
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { importarDesdeExcel, generarPlantillaExcel } from '@/utils/excelHandler'
import { getDepartamentoById } from '@/data/departamentos'

const store = useEntidadesStore()

const entidadesImportadas = ref([])
const errores = ref([])
const inputArchivo = ref(null)
const cargando = ref(false)
const mensajeExito = ref('')

async function manejarArchivo(evento) {
  const archivo = evento?.target?.files?.[0]
  if (!archivo) return

  cargando.value = true
  errores.value = []
  entidadesImportadas.value = []
  mensajeExito.value = ''

  try {
    entidadesImportadas.value = await importarDesdeExcel(archivo)
  } catch (error) {
    // Manejo flexible para errores custom (con .errores / .entidades)
    if (error?.errores) {
      errores.value = error.errores
      if (error?.entidades) entidadesImportadas.value = error.entidades
    } else {
      errores.value = [
        'Error al leer el archivo: ' + (error?.message || 'desconocido'),
      ]
    }
  } finally {
    cargando.value = false
  }
}

function confirmarImportacion() {
  try {
    store.agregarMultiplesEntidades(entidadesImportadas.value)

    mensajeExito.value = `✓ ${entidadesImportadas.value.length} entidades importadas correctamente`

    setTimeout(() => {
      entidadesImportadas.value = []
      errores.value = []
      mensajeExito.value = ''
      if (inputArchivo.value) inputArchivo.value.value = ''
    }, 3000)
  } catch (e) {
    errores.value = [
      'No se pudieron importar las entidades: ' + (e?.message || 'desconocido'),
    ]
  }
}

function descargarPlantilla() {
  try {
    // Ruta feliz: generar la plantilla en Excel (XLSX)
    generarPlantillaExcel()
  } catch (e) {
    // Plan B: CSV básico para que el usuario nunca quede bloqueado
    errores.value = [
      'No se pudo generar el Excel automáticamente. Te descargué una plantilla CSV de respaldo.',
    ]
    descargarPlantillaCSVRespaldo()
  }
}

function descargarPlantillaCSVRespaldo() {
  const encabezado = ['Nombre', 'Departamento', 'Logo']
  const ejemplo = [
    ['Universidad Nacional', 'Cundinamarca', 'logos/unal.png'],
    ['Universidad de Antioquia', 'Antioquia', 'logos/udea.png'],
    ['Alcaldía de Cali', 'Valle del Cauca', 'logos/cali.png'],
    ['Contraloría de Bogotá', 'Bogotá D.C.', 'logos/contraloria.png'],
  ]

  const filas = [encabezado, ...ejemplo]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(',')
    )
    .join('\n')

  const blob = new Blob([filas], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'plantilla_entidades.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function obtenerNombreDepartamento(id) {
  const dep = getDepartamentoById(id)
  return dep ? dep.nombre : id
}
</script>
