<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <!-- Header -->
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm text-gray-400">2026</p>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight">Panel de Administración</h1>
          <p class="mt-2 text-gray-300/80">
            Gestiona las entidades y sus logos para el mapa de Colombia.
          </p>
        </div>

        <RouterLink
          to="/"
          class="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 font-semibold
                 ring-1 ring-white/15 hover:bg-white/15 transition"
        >
          ← Volver al Mapa
        </RouterLink>
      </div>

      <!-- Stats -->
      <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
          <p class="text-sm text-gray-400">Total de entidades</p>
          <p class="mt-1 text-4xl font-black text-white">{{ store.totalEntidades }}</p>
        </div>

        <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
          <p class="text-sm text-gray-400">Departamentos</p>
          <p class="mt-1 text-4xl font-black text-emerald-300">33</p>
        </div>

        <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
          <p class="text-sm text-gray-400">Departamento seleccionado (en mapa)</p>
          <p class="mt-2 text-lg font-bold text-fuchsia-200">
            {{ departamentoActual }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mt-10">
        <div class="flex flex-wrap gap-2 rounded-2xl bg-white/5 ring-1 ring-white/10 p-2">
          <button
            @click="tabActivo = 'formulario'"
            :class="tabClass(tabActivo === 'formulario')"
          >
            Agregar manual
          </button>

          <button
            @click="tabActivo = 'importar'"
            :class="tabClass(tabActivo === 'importar')"
          >
            Importar Excel
          </button>

          <button
            @click="tabActivo = 'lista'"
            :class="tabClass(tabActivo === 'lista')"
          >
            Lista de entidades
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="mt-6 rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
        <FormularioEntidad v-if="tabActivo === 'formulario'" />
        <ImportadorExcel v-if="tabActivo === 'importar'" />

        <!-- Lista -->
        <div v-if="tabActivo === 'lista'">
          <!-- Toolbar -->
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-sm text-gray-300">
                Mostrando
                <span class="font-bold text-white">{{ entidadesFiltradas.length }}</span>
                de
                <span class="font-bold text-white">{{ store.totalEntidades }}</span>
                entidades
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Tip: busca por nombre o filtra por departamento.
              </p>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                v-model="q"
                type="text"
                placeholder="Buscar entidad…"
                class="w-full sm:w-64 rounded-xl bg-black/30 px-4 py-2 text-sm outline-none
                       ring-1 ring-white/15 focus:ring-2 focus:ring-emerald-400/60"
              />

              <select
                v-model="filtroDepto"
                class="w-full sm:w-64 rounded-xl bg-black/30 px-4 py-2 text-sm outline-none
                       ring-1 ring-white/15 focus:ring-2 focus:ring-emerald-400/60"
              >
                <option value="">Todos los departamentos</option>
                <option v-for="d in departamentosOptions" :key="d.id" :value="d.id">
                  {{ d.nombre }}
                </option>
              </select>

              <button
                @click="confirmarLimpiar"
                :disabled="store.totalEntidades === 0"
                class="rounded-xl bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200
                       ring-1 ring-red-400/30 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Limpiar todo
              </button>
            </div>
          </div>

          <!-- Empty -->
          <div
            v-if="store.totalEntidades === 0"
            class="mt-10 rounded-2xl bg-black/30 ring-1 ring-white/10 p-10 text-center text-gray-300"
          >
            No hay entidades registradas.
          </div>

          <!-- List -->
          <div v-else class="mt-6">
            <div class="max-h-[520px] overflow-y-auto pr-1 space-y-2">
              <div
                v-for="entidad in entidadesFiltradas"
                :key="entidad.id"
                class="group flex items-center justify-between gap-4 rounded-2xl bg-black/25
                       ring-1 ring-white/10 p-4 hover:bg-black/35 transition"
              >
                <div class="flex items-center gap-4 min-w-0">
                  <!-- Logo -->
                  <div
                    class="h-12 w-12 shrink-0 rounded-xl bg-white/10 ring-1 ring-white/10 overflow-hidden
                           flex items-center justify-center"
                    title="Logo"
                  >
                    <img
                      v-if="getLogoUrl(entidad)"
                      :src="getLogoUrl(entidad)"
                      alt="Logo"
                      class="h-full w-full object-cover"
                    />
                    <span v-else class="text-xs text-gray-400 font-bold">LOGO</span>
                  </div>

                  <!-- Info -->
                  <div class="min-w-0">
                    <p class="font-bold text-white truncate">
                      {{ entidad.nombre }}
                    </p>
                    <p class="text-xs text-gray-300/80 truncate">
                      📍 {{ obtenerNombreDepartamento(getDeptoId(entidad)) }}
                      <span class="text-gray-500">•</span>
                      <span class="text-gray-400">ID: {{ entidad.id }}</span>
                    </p>

                    <!-- Si quieres ver la ruta en chiquito -->
                    <p v-if="entidad.logo_path" class="mt-1 text-[11px] text-gray-500 truncate">
                      {{ entidad.logo_path }}
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                  <button
                    @click="eliminarEntidad(entidad.id)"
                    class="rounded-xl px-3 py-2 text-sm font-semibold text-red-200
                           bg-red-500/10 ring-1 ring-red-400/25 hover:bg-red-500/15 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer mini -->
            <div class="mt-4 text-xs text-gray-400">
              Nota: el mapa usará el logo de cada entidad si existe para pintar la marca.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { getDepartamentoById } from '@/data/departamentos'
import FormularioEntidad from '@/components/FormularioEntidad.vue'
import ImportadorExcel from '@/components/ImportadorExcel.vue'

const store = useEntidadesStore()

const tabActivo = ref('formulario')
const q = ref('')
const filtroDepto = ref('')

const departamentoActual = computed(() => {
  if (!store.departamentoSeleccionado) return 'Todos'
  const dep = getDepartamentoById(store.departamentoSeleccionado)
  return dep ? dep.nombre : 'Desconocido'
})

function tabClass(active) {
  return [
    'rounded-xl px-4 py-2 text-sm font-semibold transition ring-1',
    active
      ? 'bg-white text-gray-950 ring-white/20'
      : 'bg-white/0 text-gray-200 ring-white/10 hover:bg-white/10',
  ]
}

/**
 * Compatibilidad:
 * - En tu UI vieja usabas entidad.departamento
 * - En BD tu tabla tiene departamento_id
 * Esto deja funcionando ambos sin tocar el store.
 */
function getDeptoId(entidad) {
  return entidad?.departamento_id ?? entidad?.departamento ?? ''
}

function obtenerNombreDepartamento(id) {
  const dep = getDepartamentoById(id)
  return dep ? dep.nombre : (id || '—')
}

/**
 * Logo URL:
 * - Si entidad.logo_path ya viene como URL (http/https) => úsala
 * - Si viene como ruta relativa => la devolvemos tal cual (luego la pulimos cuando conectemos backend)
 */
function getLogoUrl(entidad) {
  const p = entidad?.logo_path
  if (!p) return null
  if (typeof p !== 'string') return null
  return p
}

const departamentosOptions = computed(() => {
  // sacamos la lista desde tu helper (por IDs que ya usas en frontend)
  // como no tenemos un "getAll", simplemente listamos los que existan en el store:
  // (pero aquí te dejo una lista fija de 33 NO la necesitamos porque ya tienes data/departamentos)
  // Mejor: creamos options usando store.departamentos si existiera; si no, lo dejamos desde la data ya cargada por tus imports en otros lados.
  // Como aquí no tenemos el array "departamentos" importado, hacemos un “truco seguro”:
  // construimos opciones desde ids del mapa (los que ya están en tu tabla departamentos también).
  const ids = [
    'coama','coant','coara','coatl','cobol','coboy','cocal','cocaq','cocas','cocau','coces','cocho','cocor',
    'cocun','cogua','coguv','cohui','colag','comag','comet','conar','consa','coput','coqui','coris','cosan',
    'cosap','cosuc','cotol','covac','covau','covic','codc'
  ]
  const out = ids.map((id) => {
    const dep = getDepartamentoById(id)
    return { id, nombre: dep?.nombre ?? id }
  })
  // orden alfabético por nombre
  out.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  return out
})

const entidadesFiltradas = computed(() => {
  const term = String(q.value || '').trim().toLowerCase()
  const depId = String(filtroDepto.value || '').trim().toLowerCase()

  return (store.entidades || [])
    .filter((e) => {
      if (!depId) return true
      return String(getDeptoId(e) || '').toLowerCase().trim() === depId
    })
    .filter((e) => {
      if (!term) return true
      const nombre = String(e?.nombre || '').toLowerCase()
      return nombre.includes(term)
    })
})

function eliminarEntidad(id) {
  if (confirm('¿Estás seguro de eliminar esta entidad?')) {
    store.eliminarEntidad(id)
  }
}

function confirmarLimpiar() {
  if (confirm('¿Estás seguro de eliminar TODAS las entidades? Esta acción no se puede deshacer.')) {
    store.limpiarTodo()
  }
}
</script>
