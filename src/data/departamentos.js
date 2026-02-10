export const departamentos = [
  { id: 'amazonas', nombre: 'Amazonas', capital: 'Leticia', coordenadas: { x: 420, y: 580 } },
  { id: 'antioquia', nombre: 'Antioquia', capital: 'Medellín', coordenadas: { x: 220, y: 320 } },
  { id: 'arauca', nombre: 'Arauca', capital: 'Arauca', coordenadas: { x: 380, y: 280 } },
  {
    id: 'atlantico',
    nombre: 'Atlántico',
    capital: 'Barranquilla',
    coordenadas: { x: 240, y: 180 },
  },
  { id: 'bolivar', nombre: 'Bolívar', capital: 'Cartagena', coordenadas: { x: 240, y: 220 } },
  { id: 'boyaca', nombre: 'Boyacá', capital: 'Tunja', coordenadas: { x: 300, y: 300 } },
  { id: 'caldas', nombre: 'Caldas', capital: 'Manizales', coordenadas: { x: 240, y: 360 } },
  { id: 'caqueta', nombre: 'Caquetá', capital: 'Florencia', coordenadas: { x: 320, y: 480 } },
  { id: 'casanare', nombre: 'Casanare', capital: 'Yopal', coordenadas: { x: 360, y: 330 } },
  { id: 'cauca', nombre: 'Cauca', capital: 'Popayán', coordenadas: { x: 200, y: 440 } },
  { id: 'cesar', nombre: 'Cesar', capital: 'Valledupar', coordenadas: { x: 280, y: 200 } },
  { id: 'choco', nombre: 'Chocó', capital: 'Quibdó', coordenadas: { x: 160, y: 330 } },
  { id: 'cordoba', nombre: 'Córdoba', capital: 'Montería', coordenadas: { x: 220, y: 240 } },
  {
    id: 'cundinamarca',
    nombre: 'Cundinamarca',
    capital: 'Bogotá',
    coordenadas: { x: 280, y: 360 },
  },
  { id: 'guainia', nombre: 'Guainía', capital: 'Inírida', coordenadas: { x: 440, y: 400 } },
  {
    id: 'guaviare',
    nombre: 'Guaviare',
    capital: 'San José del Guaviare',
    coordenadas: { x: 380, y: 420 },
  },
  { id: 'huila', nombre: 'Huila', capital: 'Neiva', coordenadas: { x: 260, y: 420 } },
  { id: 'la_guajira', nombre: 'La Guajira', capital: 'Riohacha', coordenadas: { x: 300, y: 140 } },
  { id: 'magdalena', nombre: 'Magdalena', capital: 'Santa Marta', coordenadas: { x: 260, y: 180 } },
  { id: 'meta', nombre: 'Meta', capital: 'Villavicencio', coordenadas: { x: 320, y: 380 } },
  { id: 'narino', nombre: 'Nariño', capital: 'Pasto', coordenadas: { x: 200, y: 500 } },
  {
    id: 'norte_santander',
    nombre: 'Norte de Santander',
    capital: 'Cúcuta',
    coordenadas: { x: 320, y: 260 },
  },
  { id: 'putumayo', nombre: 'Putumayo', capital: 'Mocoa', coordenadas: { x: 260, y: 500 } },
  { id: 'quindio', nombre: 'Quindío', capital: 'Armenia', coordenadas: { x: 230, y: 380 } },
  { id: 'risaralda', nombre: 'Risaralda', capital: 'Pereira', coordenadas: { x: 220, y: 370 } },
  {
    id: 'san_andres',
    nombre: 'San Andrés y Providencia',
    capital: 'San Andrés',
    coordenadas: { x: 80, y: 120 },
  },
  { id: 'santander', nombre: 'Santander', capital: 'Bucaramanga', coordenadas: { x: 300, y: 280 } },
  { id: 'sucre', nombre: 'Sucre', capital: 'Sincelejo', coordenadas: { x: 240, y: 220 } },
  { id: 'tolima', nombre: 'Tolima', capital: 'Ibagué', coordenadas: { x: 250, y: 390 } },
  {
    id: 'valle_cauca',
    nombre: 'Valle del Cauca',
    capital: 'Cali',
    coordenadas: { x: 200, y: 410 },
  },
  { id: 'vaupes', nombre: 'Vaupés', capital: 'Mitú', coordenadas: { x: 420, y: 460 } },
  { id: 'vichada', nombre: 'Vichada', capital: 'Puerto Carreño', coordenadas: { x: 440, y: 330 } },
  { id: 'bogota', nombre: 'Bogotá D.C.', capital: 'Bogotá', coordenadas: { x: 280, y: 360 } },
]

export const getDepartamentoById = (id) => {
  return departamentos.find((dep) => dep.id === id)
}

export const getDepartamentoByNombre = (nombre) => {
  const nombreNormalizado = nombre.toLowerCase().trim()
  return departamentos.find((dep) => dep.nombre.toLowerCase() === nombreNormalizado)
}
