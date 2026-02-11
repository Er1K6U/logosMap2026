import * as XLSX from 'xlsx'
import { getDepartamentoByNombre, getDepartamentoById } from '@/data/departamentos'

export async function importarDesdeExcel(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        // Leer primera hoja
        const nombreHoja = workbook.SheetNames[0]
        const hoja = workbook.Sheets[nombreHoja]

        // Convertir a JSON (defval: '' para que no salga undefined en celdas vacías)
        const jsonData = XLSX.utils.sheet_to_json(hoja, { defval: '' })

        const entidades = []
        const errores = []

        jsonData.forEach((fila, index) => {
          // helper para leer clave sin importar mayúsculas/espacios
          const get = (key) => {
            const keys = Object.keys(fila || {})
            const found = keys.find(
              (k) => String(k).trim().toLowerCase() === String(key).trim().toLowerCase()
            )
            return found ? fila[found] : ''
          }

          const nombre = get('Nombre')
          const departamentoNombre = get('Departamento')
          const logo = get('Logo')

          const filaExcel = index + 2 // +2 por encabezado en fila 1

          // Validar campos obligatorios
          if (!String(nombre).trim()) {
            errores.push(`Fila ${filaExcel}: Falta el nombre de la entidad`)
            return
          }

          if (!String(departamentoNombre).trim()) {
            errores.push(`Fila ${filaExcel}: Falta el departamento`)
            return
          }

          // Normalizar departamento (por nombre o por id)
          const departamentoId = normalizarDepartamento(departamentoNombre)

          if (!departamentoId) {
            errores.push(
              `Fila ${filaExcel}: Departamento "${String(departamentoNombre).trim()}" no válido`
            )
            return
          }

          entidades.push({
            nombre: String(nombre).trim(),
            departamento: departamentoId,
            logo: String(logo || '').trim(),
          })
        })

        if (errores.length > 0) {
          reject({ errores, entidades })
        } else {
          resolve(entidades)
        }
      } catch (error) {
        reject({ errores: ['Error al procesar el archivo: ' + error.message] })
      }
    }

    reader.onerror = () => reject({ errores: ['Error al leer el archivo'] })
    reader.readAsArrayBuffer(archivo)
  })
}

function normalizarDepartamento(valor) {
  const v = String(valor ?? '').trim()
  if (!v) return null

  // 1) si coincide como ID exacto (ej: "cocun" o "bogota")
  const depById = getDepartamentoById(v)
  if (depById) return depById.id

  // 2) si coincide como nombre (con normalización robusta)
  const depByNombre = getDepartamentoByNombre(v)
  if (depByNombre) return depByNombre.id

  return null
}

export function generarPlantillaExcel() {
  const datos = [
    ['Nombre', 'Departamento', 'Logo'],
    ['Universidad Nacional', 'Cundinamarca', 'logos/unal.png'],
    ['Universidad de Antioquia', 'Antioquia', 'logos/udea.png'],
    ['Alcaldía de Cali', 'Valle del Cauca', 'logos/cali.png'],
    ['Contraloría de Bogotá', 'Bogotá D.C.', 'logos/contraloria.png'],
  ]

  const ws = XLSX.utils.aoa_to_sheet(datos)

  // Ajustar ancho de columnas
  ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 30 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Entidades')

  XLSX.writeFile(wb, 'plantilla_entidades_colombia.xlsx')
}

export function exportarEntidadesAExcel(entidades, departamentos) {
  const datos = [['Nombre', 'Departamento', 'Logo']]

  entidades.forEach((entidad) => {
    const dep = (departamentos || []).find(
      (d) => String(d.id).toLowerCase().trim() === String(entidad.departamento).toLowerCase().trim()
    )
    datos.push([entidad.nombre, dep ? dep.nombre : entidad.departamento, entidad.logo])
  })

  const ws = XLSX.utils.aoa_to_sheet(datos)
  ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 30 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Entidades')

  const fecha = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `entidades_colombia_${fecha}.xlsx`)
}
