# WWTRAIL Frontend - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
wwtrail-frontend/
├── app/                          # App Router de Next.js 14
│   ├── (auth)/                  # Grupo de rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (main)/                  # Grupo de rutas principales
│   │   ├── competitions/
│   │   │   └── [id]/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes UI de shadcn
│   ├── auth/                    # Componentes de autenticación
│   ├── competitions/            # Componentes de competiciones
│   └── layout/                  # Componentes de layout
│
├── lib/                         # Utilidades y configuraciones
│   ├── api/                     # Cliente API y endpoints
│   ├── auth/                    # Utilidades de autenticación
│   ├── i18n/                    # Internacionalización
│   └── utils.ts                 # Utilidades generales
│
├── types/                       # Tipos TypeScript
│   ├── api.ts
│   ├── auth.ts
│   └── competition.ts
│
├── hooks/                       # Custom React Hooks
│   ├── useAuth.ts
│   └── useCompetitions.ts
│
└── public/                      # Archivos estáticos
    └── images/
```

## 🎯 Fase 1: Setup Inicial (ACTUAL)
- [x] Proyecto Next.js 14 creado
- [ ] Configuración de TailwindCSS
- [ ] Estructura de carpetas
- [ ] Configuración de variables de entorno
- [ ] Utilidades básicas

## 📝 Próximas Fases
- Fase 2: API Client y Tipos
- Fase 3: Sistema de Autenticación
- Fase 4: Páginas Principales
- Fase 5: Componentes de Competiciones
