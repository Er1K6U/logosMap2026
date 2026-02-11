export const departamentos = [
  { id: 'COAMA', nombre: 'Amazonas', capital: 'Leticia', coordenadas: { x: 380, y: 920 } },
  { id: 'COANT', nombre: 'Antioquia', capital: 'Medellín', coordenadas: { x: 280, y: 380 } },
  { id: 'COARA', nombre: 'Arauca', capital: 'Arauca', coordenadas: { x: 420, y: 340 } },
  { id: 'COATL', nombre: 'Atlántico', capital: 'Barranquilla', coordenadas: { x: 280, y: 180 } },
  { id: 'COBOL', nombre: 'Bolívar', capital: 'Cartagena', coordenadas: { x: 300, y: 280 } },
  { id: 'COBOY', nombre: 'Boyacá', capital: 'Tunja', coordenadas: { x: 420, y: 420 } },
  { id: 'COCAL', nombre: 'Caldas', capital: 'Manizales', coordenadas: { x: 320, y: 480 } },
  { id: 'COCAQ', nombre: 'Caquetá', capital: 'Florencia', coordenadas: { x: 380, y: 700 } },
  { id: 'COCAS', nombre: 'Casanare', capital: 'Yopal', coordenadas: { x: 460, y: 450 } },
  { id: 'COCAU', nombre: 'Cauca', capital: 'Popayán', coordenadas: { x: 260, y: 620 } },
  { id: 'COCES', nombre: 'Cesar', capital: 'Valledupar', coordenadas: { x: 380, y: 260 } },
  { id: 'COCHO', nombre: 'Chocó', capital: 'Quibdó', coordenadas: { x: 200, y: 450 } },
  { id: 'COCOR', nombre: 'Córdoba', capital: 'Montería', coordenadas: { x: 260, y: 300 } },

  // ✅ Bogotá en tu BD/SVG es CODC (Distrito Capital de Bogotá)
  { id: 'CODC', nombre: 'Distrito Capital de Bogotá', capital: 'Bogotá', coordenadas: { x: 380, y: 520 } },

  { id: 'COCUN', nombre: 'Cundinamarca', capital: 'Bogotá', coordenadas: { x: 380, y: 520 } },
  { id: 'COGUA', nombre: 'Guainía', capital: 'Inírida', coordenadas: { x: 520, y: 600 } },
  { id: 'COGUV', nombre: 'Guaviare', capital: 'San José del Guaviare', coordenadas: { x: 480, y: 620 } },
  { id: 'COHUI', nombre: 'Huila', capital: 'Neiva', coordenadas: { x: 340, y: 620 } },
  { id: 'COLAG', nombre: 'La Guajira', capital: 'Riohacha', coordenadas: { x: 420, y: 140 } },
  { id: 'COMAG', nombre: 'Magdalena', capital: 'Santa Marta', coordenadas: { x: 340, y: 210 } },
  { id: 'COMET', nombre: 'Meta', capital: 'Villavicencio', coordenadas: { x: 440, y: 560 } },
  { id: 'CONAR', nombre: 'Nariño', capital: 'Pasto', coordenadas: { x: 240, y: 720 } },
  { id: 'CONSA', nombre: 'Norte de Santander', capital: 'Cúcuta', coordenadas: { x: 440, y: 340 } },
  { id: 'COPUT', nombre: 'Putumayo', capital: 'Mocoa', coordenadas: { x: 300, y: 740 } },
  { id: 'COQUI', nombre: 'Quindío', capital: 'Armenia', coordenadas: { x: 300, y: 520 } },
  { id: 'CORIS', nombre: 'Risaralda', capital: 'Pereira', coordenadas: { x: 280, y: 500 } },

  // ✅ San Andrés y Providencia (te faltaba)
  // Nota: las coordenadas son aproximadas; luego la afinamos visualmente si quieres.
  { id: 'COSAP', nombre: 'San Andrés y Providencia', capital: 'San Andrés', coordenadas: { x: 140, y: 220 } },

  { id: 'COSAN', nombre: 'Santander', capital: 'Bucaramanga', coordenadas: { x: 400, y: 380 } },
  { id: 'COSUC', nombre: 'Sucre', capital: 'Sincelejo', coordenadas: { x: 300, y: 250 } },
  { id: 'COTOL', nombre: 'Tolima', capital: 'Ibagué', coordenadas: { x: 340, y: 540 } },
  { id: 'COVAU', nombre: 'Vaupés', capital: 'Mitú', coordenadas: { x: 500, y: 740 } },

  // ✅ Valle del Cauca correcto según tu BD/SVG: COVAC
  { id: 'COVAC', nombre: 'Valle del Cauca', capital: 'Cali', coordenadas: { x: 280, y: 580 } },

  // ✅ Vichada correcto según tu BD/SVG: COVID
  { id: 'COVID', nombre: 'Vichada', capital: 'Puerto Carreño', coordenadas: { x: 560, y: 480 } },
]

// ---------- Normalización robusta ----------
function stripDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function normalizeKey(str) {
  if (str == null) return ''
  let s = String(str)
  s = s.trim().toLowerCase()
  s = stripDiacritics(s)

  // quitar puntos, comas y caracteres raros; mantener letras/números/espacios
  s = s.replace(/[.,;:()'"´`]/g, ' ')
  s = s.replace(/[-_/\\]+/g, ' ')
  s = s.replace(/\s+/g, ' ').trim()

  // normalizaciones típicas de Bogotá
  s = s.replace(/\bd\s*c\b/g, 'dc')
  s = s.replace(/\bdc\b/g, 'dc')
  s = s.replace(/\bdistrito capital\b/g, 'dc')
  s = s.replace(/\bbogota\s+dc\b/g, 'bogota dc')

  return s
}

// Índices rápidos: por id y por nombre normalizado
// Nota: guardamos la llave en minúscula para que "coant" o "COANT" funcionen igual.
const byId = new Map(departamentos.map((d) => [String(d.id).toLowerCase().trim(), d]))
const byNombreNorm = new Map(departamentos.map((d) => [normalizeKey(d.nombre), d]))

// Aliases/sinónimos comunes
const aliases = new Map([
  // Bogotá
  ['bogota', 'bogota dc'],
  ['bogota d c', 'bogota dc'],
  ['bogota d.c', 'bogota dc'],
  ['bogota d.c.', 'bogota dc'],
  ['bogota dc', 'bogota dc'],
  ['distrito capital', 'bogota dc'],
  ['distrito capital de bogota', 'bogota dc'],

  // San Andrés (por si alguien lo escribe raro)
  ['san andres', 'san andres y providencia'],
  ['san andres y providencia', 'san andres y providencia'],
])

export function getDepartamentoById(id) {
  const key = String(id ?? '').toLowerCase().trim()
  return byId.get(key) || null
}

export function getDepartamentoByNombre(nombre) {
  const raw = normalizeKey(nombre)
  const aliased = aliases.get(raw) || raw

  // match directo por nombre normalizado
  const dep = byNombreNorm.get(aliased)
  if (dep) return dep

  // fallback: si me pasan el ID por accidente en vez del nombre
  const asId = byId.get(String(nombre ?? '').toLowerCase().trim())
  return asId || null
}
