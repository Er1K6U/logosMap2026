export const departamentos = [
  { id: 'coama', nombre: 'Amazonas', capital: 'Leticia', coordenadas: { x: 380, y: 920 } },
  { id: 'coant', nombre: 'Antioquia', capital: 'Medellín', coordenadas: { x: 280, y: 380 } },
  { id: 'coara', nombre: 'Arauca', capital: 'Arauca', coordenadas: { x: 420, y: 340 } },
  { id: 'coatl', nombre: 'Atlántico', capital: 'Barranquilla', coordenadas: { x: 280, y: 180 } },
  { id: 'cobol', nombre: 'Bolívar', capital: 'Cartagena', coordenadas: { x: 300, y: 280 } },
  { id: 'coboy', nombre: 'Boyacá', capital: 'Tunja', coordenadas: { x: 420, y: 420 } },
  { id: 'cocal', nombre: 'Caldas', capital: 'Manizales', coordenadas: { x: 320, y: 480 } },
  { id: 'cocaq', nombre: 'Caquetá', capital: 'Florencia', coordenadas: { x: 380, y: 700 } },
  { id: 'cocas', nombre: 'Casanare', capital: 'Yopal', coordenadas: { x: 460, y: 450 } },
  { id: 'cocau', nombre: 'Cauca', capital: 'Popayán', coordenadas: { x: 260, y: 620 } },
  { id: 'coces', nombre: 'Cesar', capital: 'Valledupar', coordenadas: { x: 380, y: 260 } },
  { id: 'cocho', nombre: 'Chocó', capital: 'Quibdó', coordenadas: { x: 200, y: 450 } },
  { id: 'cocor', nombre: 'Córdoba', capital: 'Montería', coordenadas: { x: 260, y: 300 } },
  { id: 'cocun', nombre: 'Cundinamarca', capital: 'Bogotá', coordenadas: { x: 380, y: 520 } },
  { id: 'cogua', nombre: 'Guainía', capital: 'Inírida', coordenadas: { x: 520, y: 600 } },
  { id: 'colag', nombre: 'La Guajira', capital: 'Riohacha', coordenadas: { x: 420, y: 140 } },
  {
    id: 'coguv',
    nombre: 'Guaviare',
    capital: 'San José del Guaviare',
    coordenadas: { x: 480, y: 620 },
  },
  { id: 'cohui', nombre: 'Huila', capital: 'Neiva', coordenadas: { x: 340, y: 620 } },
  { id: 'comag', nombre: 'Magdalena', capital: 'Santa Marta', coordenadas: { x: 340, y: 210 } },
  { id: 'comet', nombre: 'Meta', capital: 'Villavicencio', coordenadas: { x: 440, y: 560 } },
  { id: 'conar', nombre: 'Nariño', capital: 'Pasto', coordenadas: { x: 240, y: 720 } },
  { id: 'consa', nombre: 'Norte de Santander', capital: 'Cúcuta', coordenadas: { x: 440, y: 340 } },
  { id: 'coput', nombre: 'Putumayo', capital: 'Mocoa', coordenadas: { x: 300, y: 740 } },
  { id: 'coqui', nombre: 'Quindío', capital: 'Armenia', coordenadas: { x: 300, y: 520 } },
  { id: 'coris', nombre: 'Risaralda', capital: 'Pereira', coordenadas: { x: 280, y: 500 } },
  { id: 'cosan', nombre: 'Santander', capital: 'Bucaramanga', coordenadas: { x: 400, y: 380 } },
  { id: 'cosuc', nombre: 'Sucre', capital: 'Sincelejo', coordenadas: { x: 300, y: 250 } },
  { id: 'cotol', nombre: 'Tolima', capital: 'Ibagué', coordenadas: { x: 340, y: 540 } },
  { id: 'covau', nombre: 'Vaupés', capital: 'Mitú', coordenadas: { x: 500, y: 740 } },
  { id: 'covic', nombre: 'Vichada', capital: 'Puerto Carreño', coordenadas: { x: 560, y: 480 } },
  { id: 'coval', nombre: 'Valle del Cauca', capital: 'Cali', coordenadas: { x: 280, y: 580 } },
  { id: 'bogota', nombre: 'Bogotá D.C.', capital: 'Bogotá', coordenadas: { x: 380, y: 520 } },
]

export function getDepartamentoById(id) {
  const idNormalizado = id.toLowerCase().trim()
  return departamentos.find((dep) => dep.id === idNormalizado)
}

export function getDepartamentoByNombre(nombre) {
  const nombreNormalizado = nombre.toLowerCase().trim()
  return departamentos.find((dep) => dep.nombre.toLowerCase() === nombreNormalizado)
}
