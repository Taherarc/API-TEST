# Explorador Geográfico 

Esta aplicación es un sistema de exploración geográfica, desarrollado con **React 18**, **TypeScript** y una arquitectura por capas.

## Arquitectura del Sistema

El proyecto está organizado siguiendo principios de diseño profesional para maximizar la mantenibilidad:
```
explorador-geo/
├── public/                 # Recursos estáticos servidos directamente
├── src/
│   ├── assets/             # Recursos multimedia (iconos, imágenes)
│   ├── components/         # Componentes de la interfaz de usuario
│   │   ├── auth/           # Lógica y vistas de autenticación
│   │   ├── common/         # Componentes transversales (Buscador, Paginación, Loader)
│   │   └── geo/            # Componentes del dominio geográfico (Tarjetas, Detalles)
│   ├── contexts/           # Proveedores de estado global (Auth, Geografía)
│   ├── hooks/              # Lógica de negocio y efectos reutilizables
│   ├── repositories/       # Capa de orquestación de datos y persistencia
│   ├── services/           # Servicios de infraestructura
│   │   ├── api/            # Comunicación con servicios externos (CSC, OSM)
│   │   └── auth/           # Lógica central de seguridad
│   ├── styles/             # Hojas de estilo modulares (CSS)
│   ├── types/              # Definiciones de tipos y contratos (TypeScript)
│   ├── utils/              # Funciones auxiliares y de transformación
│   ├── App.tsx             # Orquestador y ruteo principal
│   └── main.tsx            # Punto de entrada de la aplicación
├── .env                    # Variables de entorno (API Keys)
├── .gitignore              # Exclusión de archivos para control de versiones
├── package.json            # Manifiesto del proyecto y dependencias
├── README.md               # Documentación general del sistema
└── tsconfig.json           # Configuración del compilador TypeScript
```

### Estructura de Carpetas

- **`/src/services/api`**: Capa de Datos Pura. Se encarga exclusivamente de la comunicación HTTP con servicios externos (CSC API, OSM).
- **`/src/repositories`**: Capa de Dominio / Orquestación. Implementa el patrón Repository para gestionar la lógica de datos, decidiendo entre Red o Caché (**Network First**).
- **`/src/contexts`**: Capa de Estado Global. Centraliza el estado de autenticación y navegación geográfica mediante Context API.
- **`/src/hooks`**: Capa de Lógica de Negocio. Encapsula comportamientos reutilizables como carga de datos, paginación y debouncing.
- **`/src/components`**: Capa de UI.
  - `common/`: Componentes agnósticos (Loader, Pagination, SearchInput).
  - `auth/`: Lógica de acceso.
  - `geo/`: Componentes específicos del dominio geográfico.
- **`/src/utils`**: Funciones puras para procesamiento de datos.

## Flujo de Datos y Estrategia de Caché

La aplicación implementa una estrategia **Network First + Cache Fallback**:
1. El componente solicita datos mediante un Hook.
2. El Hook consulta al `geoRepository`.
3. El Repositorio intenta obtener datos frescos de la API.
4. Si la red es exitosa, se actualiza el `cacheService` (sessionStorage).
5. Si la red falla (ej. error 429 o pérdida de conexión), el repositorio rescata los datos del Caché.

## Tecnologías e Integraciones

- **CountryStateCity API**: Fuente primaria para Paises, Estados y Ciudades.
- **OpenStreetMap (Nominatim)**: Fuente secundaria para enriquecimiento de metadatos (coordenadas, tipo de ubicación).
- **TypeScript**: Tipado estricto en todas las capas para prevenir errores en tiempo de ejecución.
- **Debounced Search**: Búsqueda local optimizada que espera 300ms para evitar sobrecarga de renders.
- **Paginación Inteligente**: Segmentación de listas largas para mantener un rendimiento de renderizado constante.

## Sigue estos pasos para ejecutar en local

1. Clone el repositorio y obtenga su propia APIKEY de CountryStateCity API.
2. Configure su `VITE_CSC_API_KEY` en el archivo `.env`.
3. Ejecute `npm install` para las dependencias.
4. Inicie el entorno de desarrollo: `npm run dev`.
5. Acceda con las credenciales sugeridas: `admin` / `123`.
