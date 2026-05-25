# Contexto del Proyecto: logosMap2026

> Generado automáticamente el 2026-05-25 mediante análisis estático del código fuente.

---

## 1. Propósito General del Proyecto

**logosMap2026** es una aplicación web interactiva que permite visualizar entidades (organizaciones, universidades, instituciones) distribuidas geográficamente sobre un mapa SVG de Colombia. Cada entidad se representa con su logo o siglas dentro de un marcador animado posicionado sobre el departamento al que pertenece.

### Casos de uso principales

| # | Caso de uso |
|---|-------------|
| 1 | Visualizar el mapa de Colombia con marcadores de entidades por departamento |
| 2 | Agregar entidades manualmente con nombre, departamento y logo |
| 3 | Importar lotes de entidades desde archivos Excel (.xlsx / .xls) |
| 4 | Buscar y filtrar entidades por nombre o departamento |
| 5 | Eliminar entidades individualmente o en bloque |
| 6 | Rotación automática de marcadores en el mapa (cada 8 segundos) |

La aplicación no tiene backend; toda la lógica corre en el navegador y los datos persisten en `localStorage`.

---

## 2. Stack Tecnológico y Dependencias Principales

### Framework y runtime

| Tecnología | Versión | Rol |
|---|---|---|
| **Vue.js 3** | `^3.5.27` | Framework principal (Composition API + `<script setup>`) |
| **Vite** | `^7.3.1` | Bundler y servidor de desarrollo |
| **Node.js** | `^20.19.0 \|\| >=22.12.0` | Entorno de ejecución requerido |

### Librerías de producción

| Librería | Versión | Uso |
|---|---|---|
| **Vue Router** | `^5.0.1` | Enrutamiento SPA (2 rutas: `/` y `/admin`) |
| **Pinia** | `^3.0.4` | Estado global (store de entidades) |
| **VueUse** | `^14.2.1` | Utilidades de Composition API |
| **XLSX** | `^0.18.5` | Importación y exportación de archivos Excel |
| **Express** | `^5.2.1` | Incluido como dependencia (no activo en el front actual) |

### Estilos

| Tecnología | Versión | Rol |
|---|---|---|
| **Tailwind CSS** | `^3.4.19` | Framework de utilidades CSS |
| **PostCSS** | `^8.5.6` | Procesador de CSS |
| **Autoprefixer** | `^10.4.24` | Compatibilidad cross-browser |

### Herramientas de calidad de código

| Herramienta | Versión | Rol |
|---|---|---|
| ESLint | `^9.39.2` | Linting JavaScript/Vue |
| Oxlint | `~1.42.0` | Linter rápido (complementa ESLint) |
| Prettier | `3.8.1` | Formateo de código |
| eslint-plugin-vue | `~10.7.0` | Reglas Vue para ESLint |

### Scripts npm disponibles

```bash
npm run dev        # Servidor de desarrollo (Vite)
npm run build      # Build de producción
npm run preview    # Previsualizar build
npm run lint       # lint:oxlint + lint:eslint (con --fix)
npm run format     # Prettier sobre src/
```

---

## 3. Estructura de Carpetas Clave y su Función

```
logosMap2026/
├── index.html                   # HTML base — div#app + carga src/main.js
├── package.json                 # Dependencias, scripts, metadata
├── vite.config.js               # Bundler: plugin Vue + DevTools, alias @ -> ./src
├── tailwind.config.js           # Tailwind: content en index.html y src/**
├── postcss.config.js            # Plugins: tailwindcss + autoprefixer
├── eslint.config.js             # ESLint con Vue, Oxlint, Prettier
├── .oxlintrc.json               # Reglas Oxlint (plugins: eslint, unicorn, oxc, vue)
├── .prettierrc.json             # semi:false, singleQuote:true, printWidth:100
├── jsconfig.json                # Alias paths: @/* -> ./src/*
│
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── colombia.svg         # Mapa SVG de Colombia (116 KB, 33 departamentos)
│       ├── fondo.jpg            # Imagen de fondo del mapa (195 KB)
│       └── logos/               # Carpeta destino para logos de entidades
│
└── src/
    ├── main.js                  # Bootstrap: createApp + Pinia + Router, mount en #app
    ├── App.vue                  # Componente raíz: Navbar (LogosMap 2026) + RouterView
    │
    ├── assets/
    │   ├── main.css             # Estilos globales (importa Tailwind)
    │   ├── base.css             # Estilos base adicionales
    │   └── logo.svg             # Logo del proyecto
    │
    ├── router/
    │   └── index.js             # 2 rutas: / -> HomeView, /admin -> AboutView (lazy)
    │
    ├── stores/
    │   └── entidadesStore.js    # Pinia store principal (ver detalle abajo)
    │
    ├── data/
    │   ├── departamentos.js     # Array de 33 departamentos + funciones de normalización
    │   └── entidades.json       # Datos iniciales vacíos { "entidades": [] }
    │
    ├── utils/
    │   └── excelHandler.js      # Import/export Excel: importarDesdeExcel(), generarPlantillaExcel()
    │
    ├── views/
    │   ├── HomeView.vue         # Página principal: carga localStorage + renderiza MapaColombia
    │   └── AboutView.vue        # Panel Admin: 3 tabs (Formulario, Importar Excel, Lista)
    │
    └── components/
        ├── MapaColombia.vue     # Mapa SVG interactivo + posicionamiento de marcadores
        ├── MarcadorEntidad.vue  # Marcador individual animado (logo o iniciales)
        ├── FormularioEntidad.vue# Formulario de alta manual de entidad
        ├── ImportadorExcel.vue  # Upload + validación + preview de importación Excel
        └── icons/               # 5 iconos SVG decorativos (templates Vite, no usados)
```

### Descripción detallada de componentes clave

#### `MapaColombia.vue` (18 KB)
Componente central de la aplicación. Carga el SVG de Colombia, aplica el gradiente de la bandera colombiana (amarillo / azul / rojo con opacidad), y calcula las posiciones de los marcadores a partir del `bbox` del SVG o de las coordenadas definidas en `departamentos.js`. Implementa:
- Selección de departamento al hacer click en el SVG
- Rotación automática: muestra hasta 15 entidades por página, avanza cada 8 segundos
- Animaciones de entrada escalonadas (delay de 0.3 s entre marcadores)
- Cache de posiciones para evitar recálculos innecesarios

#### `entidadesStore.js` (Pinia)
Store principal con Composition API. Estado: `entidades[]`, `departamentoSeleccionado`, `cargando`. Computed: `entidadesPorDepartamento`, `totalEntidades`, `entidadesPorDepartamentoCount`. Acciones principales: `agregarEntidad`, `agregarMultiplesEntidades`, `eliminarEntidad`, `cargarDesdeLocalStorage`, `guardarEnLocalStorage`, `limpiarTodo`. Persiste automáticamente en `localStorage['entidades']`.

#### `departamentos.js`
Define los 33 departamentos con ID (`COANT`, `CODC`, `COVID`…), nombre, capital y coordenadas `{x, y}` en espacio 0–1000. Exporta `getDepartamentoByNombre()` con normalización robusta: elimina acentos (NFD), lowercase, aliases para Bogotá D.C., San Andrés, etc.

#### `excelHandler.js`
Utilidad para importar/exportar Excel con la librería XLSX. Funciones: `importarDesdeExcel(archivo)` (lee, valida columnas `Nombre/Departamento/Logo`, normaliza departamentos, devuelve array o errores por fila), `generarPlantillaExcel()`, `exportarEntidadesAExcel()`.

---

## 4. Configuración Crítica Detectada

### Alias de módulos
En `vite.config.js` y `jsconfig.json` el alias `@` apunta a `./src`, habilitando imports como `import { ... } from '@/stores/entidadesStore'`.

### Persistencia de datos
No hay base de datos externa. Toda la información se guarda en `localStorage` bajo la clave `'entidades'`. El límite del navegador es de ~5–10 MB; logos almacenados en Base64 pueden saturarlo con cargas pesadas.

### SVG del mapa
`public/assets/colombia.svg` (116 KB) contiene los 33 departamentos como elementos `<path>` o `<g>` con IDs en formato `COANT`, `CODC`, `COVAC`, etc. El componente `MapaColombia.vue` los busca por ID para aplicar estilos y capturar eventos. La coherencia entre los IDs del SVG y los definidos en `data/departamentos.js` es crítica; el componente valida esto en consola al montar.

### Tailwind CSS
El `content` está configurado sobre `index.html` y `src/**/*.{vue,js,ts,jsx,tsx}`. Sin esta configuración, las clases dinámicas generadas en tiempo de ejecución no serían purgadas correctamente en producción.

### Lazy loading de rutas
La ruta `/admin` importa `AboutView.vue` de forma lazy (`() => import('../views/AboutView.vue')`), reduciendo el bundle inicial de la aplicación.

### Variables de entorno
No se detectó archivo `.env` activo. No hay claves de API ni configuración de servicios externos en el código fuente analizado.

### Express como dependencia
`express ^5.2.1` está listado en `dependencies` pero no se encontró uso activo en el código frontend. Podría ser una dependencia residual o una preparación para un backend futuro.

### Modelo de datos de entidad

```js
{
  id: Number,              // Date.now() al crear
  nombre: String,          // Requerido
  departamento: String,    // ID normalizado en minúsculas (ej: 'coant')
  departamento_id: String, // Alias de compatibilidad
  logo: String,            // dataURL Base64 o ruta relativa
  logo_path: String,       // Ruta del archivo logo si existe
  descripcion: String,     // Opcional
  fechaRegistro: String,   // ISO 8601
  extraCount: Number        // Marcadores agrupados (opcional)
}
```

---

## 5. Flujo de Datos Principal

```
Usuario
  │
  ├─► FormularioEntidad / ImportadorExcel
  │       │
  │       ▼
  │   entidadesStore.agregarEntidad() / agregarMultiplesEntidades()
  │       │
  │       ▼
  │   localStorage['entidades']  ◄────────────────────────┐
  │                                                        │
  └─► HomeView (onMounted: cargarDesdeLocalStorage) ───────┘
          │
          ▼
      MapaColombia.vue
          │
          ├─► Carga colombia.svg (fetch estático)
          ├─► Calcula posiciones de marcadores
          ├─► Renderiza MarcadorEntidad por cada entidad visible
          └─► Rotación automática cada 8 s
```

---

## 6. Información Adicional

| Item | Valor |
|---|---|
| Repositorio Git | `https://github.com/Er1K6U/logosMap2026.git` |
| Rama activa | `main` |
| Tamaño del proyecto | ~149 MB (incluye `node_modules`) |
| Sin `node_modules` | ~1–2 MB estimado |
| Licencia SVG mapa | Pareto Software / SimpleMaps (uso comercial con atribución) |

### Commits recientes

| Hash | Mensaje |
|---|---|
| `5dc03bb` | Titulo |
| `a1da6ec` | Delineado y tricolor en los departamentos del colombia.svg |
| `120b1c7` | Cambio en el software de LogosMapa |
| `505c3cf` | Render de entidades — posiciones pendientes de ajuste |
| `9db7ac1` | feat: aplicación completa funcional |
