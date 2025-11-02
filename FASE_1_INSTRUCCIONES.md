# 🚀 WWTRAIL Frontend - Fase 1: Setup Inicial

## ✅ Archivos Creados

### Configuración Base
- ✅ `package.json` - Dependencias del proyecto
- ✅ `tsconfig.json` - Configuración TypeScript
- ✅ `tailwind.config.ts` - Configuración Tailwind
- ✅ `.env.local` - Variables de entorno
- ✅ `.env.example` - Ejemplo de variables

### Estructura de la App
- ✅ `app/layout.tsx` - Layout principal
- ✅ `app/page.tsx` - Página de inicio
- ✅ `app/globals.css` - Estilos globales

### Utilidades
- ✅ `lib/utils.ts` - Utilidades generales

## 📦 Instalación

```bash
# 1. Navega a la carpeta del proyecto
cd /ruta/a/wwtrail-frontend

# 2. Instala las dependencias
npm install

# 3. Copia el archivo de variables de entorno
cp .env.example .env.local

# 4. Verifica que el backend esté corriendo
# El backend debe estar en http://localhost:3001

# 5. Inicia el servidor de desarrollo
npm run dev
```

## 🧪 Verificación

Una vez iniciado el servidor, ve a: **http://localhost:3000**

Deberías ver una página con:
- Título "WWTRAIL"
- Un checklist mostrando que el setup está completo
- Estilos de Tailwind aplicados correctamente

## 🎨 Colores del Tema

El proyecto usa un esquema de colores verde (trail/naturaleza):
- **Primary**: Verde (#22c55e aproximadamente)
- **Secondary**: Gris claro
- **Background**: Blanco (modo claro) / Gris oscuro (modo oscuro)

## 📁 Estructura Actual

```
wwtrail-frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── utils.ts
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## ✨ Siguientes Pasos

Una vez verificado que todo funciona:

**Fase 2**: API Client y Tipos TypeScript
- Cliente Axios configurado
- Tipos de datos del backend
- Interceptores para JWT
- Manejo de errores

---

## 🐛 Troubleshooting

### Error: Puerto 3000 ya en uso
```bash
# Mata el proceso en el puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Error: Módulos no encontrados
```bash
# Re-instala las dependencias
rm -rf node_modules package-lock.json
npm install
```

### Backend no disponible
Verifica que el backend esté corriendo en `http://localhost:3001`
```bash
curl http://localhost:3001/api/health
```
