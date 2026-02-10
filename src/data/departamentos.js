export const departamentos = [
  { id: 'amazonas', nombre: 'Amazonas', capital: 'Leticia', coordenadas: { x: 65, y: 85 } },
  { id: 'antioquia', nombre: 'Antioquia', capital: 'Medellín', coordenadas: { x: 35, y: 45 } },
  { id: 'arauca', nombre: 'Arauca', capital: 'Arauca', coordenadas: { x: 70, y: 38 } },
  { id: 'atlantico', nombre: 'Atlántico', capital: 'Barranquilla', coordenadas: { x: 40, y: 20 } },
  { id: 'bolivar', nombre: 'Bolívar', capital: 'Cartagena', coordenadas: { x: 38, y: 32 } },
  { id: 'boyaca', nombre: 'Boyacá', capital: 'Tunja', coordenadas: { x: 48, y: 42 } },
  { id: 'caldas', nombre: 'Caldas', capital: 'Manizales', coordenadas: { x: 38, y: 52 } },
  { id: 'caqueta', nombre: 'Caquetá', capital: 'Florencia', coordenadas: { x: 48, y: 70 } },
  { id: 'casanare', nombre: 'Casanare', capital: 'Yopal', coordenadas: { x: 62, y: 48 } },
  { id: 'cauca', nombre: 'Cauca', capital: 'Popayán', coordenadas: { x: 30, y: 62 } },
  { id: 'cesar', nombre: 'Cesar', capital: 'Valledupar', coordenadas: { x: 45, y: 28 } },
  { id: 'choco', nombre: 'Chocó', capital: 'Quibdó', coordenadas: { x: 22, y: 48 } },
  { id: 'cordoba', nombre: 'Córdoba', capital: 'Montería', coordenadas: { x: 35, y: 35 } },
  { id: 'cundinamarca', nombre: 'Cundinamarca', capital: 'Bogotá', coordenadas: { x: 44, y: 52 } },
  { id: 'guainia', nombre: 'Guainía', capital: 'Inírida', coordenadas: { x: 78, y: 58 } },
  {
    id: 'guaviare',
    nombre: 'Guaviare',
    capital: 'San José del Guaviare',
    coordenadas: { x: 65, y: 60 },
  },
  { id: 'huila', nombre: 'Huila', capital: 'Neiva', coordenadas: { x: 40, y: 60 } },
  { id: 'la_guajira', nombre: 'La Guajira', capital: 'Riohacha', coordenadas: { x: 50, y: 15 } },
  { id: 'magdalena', nombre: 'Magdalena', capital: 'Santa Marta', coordenadas: { x: 42, y: 22 } },
  { id: 'meta', nombre: 'Meta', capital: 'Villavicencio', coordenadas: { x: 52, y: 55 } },
  { id: 'narino', nombre: 'Nariño', capital: 'Pasto', coordenadas: { x: 28, y: 72 } },
  {
    id: 'norte_santander',
    nombre: 'Norte de Santander',
    capital: 'Cúcuta',
    coordenadas: { x: 52, y: 36 },
  },
  { id: 'putumayo', nombre: 'Putumayo', capital: 'Mocoa', coordenadas: { x: 38, y: 72 } },
  { id: 'quindio', nombre: 'Quindío', capital: 'Armenia', coordenadas: { x: 35, y: 54 } },
  { id: 'risaralda', nombre: 'Risaralda', capital: 'Pereira', coordenadas: { x: 34, y: 53 } },
  {
    id: 'san_andres',
    nombre: 'San Andrés y Providencia',
    capital: 'San Andrés',
    coordenadas: { x: 8, y: 12 },
  },
  { id: 'santander', nombre: 'Santander', capital: 'Bucaramanga', coordenadas: { x: 48, y: 38 } },
  { id: 'sucre', nombre: 'Sucre', capital: 'Sincelejo', coordenadas: { x: 38, y: 30 } },
  { id: 'tolima', nombre: 'Tolima', capital: 'Ibagué', coordenadas: { x: 38, y: 56 } },
  { id: 'valle_cauca', nombre: 'Valle del Cauca', capital: 'Cali', coordenadas: { x: 30, y: 58 } },
  { id: 'vaupes', nombre: 'Vaupés', capital: 'Mitú', coordenadas: { x: 72, y: 67 } },
  { id: 'vichada', nombre: 'Vichada', capital: 'Puerto Carreño', coordenadas: { x: 78, y: 48 } },
  { id: 'bogota', nombre: 'Bogotá D.C.', capital: 'Bogotá', coordenadas: { x: 44, y: 52 } },
]

export const getDepartamentoById = (id) => {
  return departamentos.find((dep) => dep.id === id)
}

export const getDepartamentoByNombre = (nombre) => {
  const nombreNormalizado = nombre.toLowerCase().trim()
  return departamentos.find((dep) => dep.nombre.toLowerCase() === nombreNormalizado)
}
