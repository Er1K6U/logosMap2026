import * as XLSX from 'xlsx'
import { getDepartamentoByNombre } from '@/data/departamentos'

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

        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(hoja)

        // Mapear y validar campos
        const entidades = []
        const errores = []

        jsonData.forEach((fila, index) => {
          const nombre = fila['Nombre'] || fila['nombre'] || fila['NOMBRE']
          const departamentoNombre =
            fila['Departamento'] || fila['departamento'] || fila['DEPARTAMENTO']
          const logo = fila['Logo'] || fila['logo'] || fila['LOGO'] || ''

          // Validar campos obligatorios
          if (!nombre) {
            errores.push(`Fila ${index + 2}: Falta el nombre de la entidad`)
            return
          }

          if (!departamentoNombre) {
            errores.push(`Fila ${index + 2}: Falta el departamento`)
            return
          }

          // Normalizar departamento
          const departamento = normalizarDepartamento(departamentoNombre)

          if (!departamento) {
            errores.push(`Fila ${index + 2}: Departamento "${departamentoNombre}" no válido`)
            return
          }

          entidades.push({
            nombre: nombre.trim(),
            departamento: departamento,
            logo: logo.trim(),
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

function normalizarDepartamento(nombre) {
  const dep = getDepartamentoByNombre(nombre)
  return dep ? dep.id : null
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
  ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 25 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Entidades')

  XLSX.writeFile(wb, 'plantilla_entidades_colombia.xlsx')
}

export function exportarEntidadesAExcel(entidades, departamentos) {
  const datos = [['Nombre', 'Departamento', 'Logo']]

  entidades.forEach((entidad) => {
    const dep = departamentos.find((d) => d.id === entidad.departamento)
    datos.push([entidad.nombre, dep ? dep.nombre : entidad.departamento, entidad.logo])
  })

  const ws = XLSX.utils.aoa_to_sheet(datos)
  ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 25 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Entidades')

  const fecha = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `entidades_colombia_${fecha}.xlsx`)
}
