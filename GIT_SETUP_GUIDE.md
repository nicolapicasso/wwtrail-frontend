# 🔄 Guía para Subir WWTRAIL Frontend a Git

## 📝 Prerrequisitos

1. ✅ Proyecto funcionando localmente (`npm run dev`)
2. ✅ Git instalado en tu sistema
3. ✅ Cuenta de GitHub/GitLab/Bitbucket

---

## 🚀 Pasos para Subir a Git

### 1️⃣ Inicializar Git en el Proyecto

```bash
# Navega a la carpeta del proyecto
cd wwtrail-frontend

# Inicializa Git
git init

# Verifica que .gitignore existe
cat .gitignore

# Añade todos los archivos
git add .

# Verifica qué archivos se añadirán (NO debe incluir node_modules o .env.local)
git status
```

**✅ Checkpoint**: Deberías ver archivos como `package.json`, `app/`, `lib/`, etc.
**❌ NO deberías ver**: `node_modules/`, `.env.local`, `.next/`

---

### 2️⃣ Primer Commit

```bash
# Crea el primer commit
git commit -m "🎉 Initial setup - Phase 1 complete

- Next.js 14 with App Router
- TypeScript configuration
- TailwindCSS with custom theme
- Project structure
- Environment variables setup"
```

---

### 3️⃣ Crear Repositorio Remoto

#### Opción A: GitHub (interfaz web)
1. Ve a [github.com](https://github.com)
2. Click en "New repository"
3. Nombre: `wwtrail-frontend`
4. Descripción: `Frontend for WWTRAIL - Trail Running Platform`
5. **NO** marques "Add README" (ya lo tenemos)
6. **NO** marques "Add .gitignore" (ya lo tenemos)
7. Click "Create repository"

#### Opción B: Desde la Terminal (GitHub CLI)
```bash
gh repo create wwtrail-frontend --private --source=. --remote=origin
```

---

### 4️⃣ Conectar y Subir al Repositorio

```bash
# Conecta tu repositorio local con el remoto
# Reemplaza <USERNAME> con tu usuario de GitHub
git remote add origin https://github.com/<USERNAME>/wwtrail-frontend.git

# Verifica la conexión
git remote -v

# Renombra la rama a 'main' (si es necesario)
git branch -M main

# Sube el código
git push -u origin main
```

---

### 5️⃣ Verificación

```bash
# Verifica que todo se subió correctamente
git log --oneline

# Deberías ver tu commit inicial
```

Ve a tu repositorio en GitHub y verifica que todos los archivos están ahí.

---

## 📦 Estructura que se Subirá

```
✅ app/
✅ lib/
✅ package.json
✅ tsconfig.json
✅ tailwind.config.ts
✅ README.md
✅ .gitignore
✅ .env.example
✅ PROJECT_STRUCTURE.md
✅ FASE_1_INSTRUCCIONES.md

❌ node_modules/        (ignorado)
❌ .env.local           (ignorado)
❌ .next/               (ignorado)
```

---

## 🔐 Seguridad Importante

### ⚠️ NUNCA subas estos archivos:
- ✅ `.env.local` está en `.gitignore`
- ✅ `node_modules/` está en `.gitignore`
- ✅ Tokens o claves API

### ✅ SÍ sube:
- ✅ `.env.example` (sin valores reales)
- ✅ Todo el código fuente
- ✅ Documentación

---

## 🌿 Estructura de Branches (Recomendada)

```bash
# Para futuras fases, crea branches
git checkout -b feature/fase-2-api-client
# ... trabajas en fase 2 ...
git add .
git commit -m "✨ Phase 2: API Client and Types"
git push origin feature/fase-2-api-client

# Luego haces merge a main
git checkout main
git merge feature/fase-2-api-client
git push origin main
```

---

## 🆘 Comandos Útiles de Git

```bash
# Ver estado
git status

# Ver diferencias
git diff

# Ver historial
git log --oneline

# Deshacer cambios no commiteados
git checkout -- archivo.ts

# Ver branches
git branch

# Cambiar de branch
git checkout nombre-branch

# Crear y cambiar a nuevo branch
git checkout -b nuevo-branch
```

---

## ✅ Checklist Final

Antes de continuar con Fase 2, verifica:

- [ ] Repositorio creado en GitHub
- [ ] Código subido correctamente
- [ ] `.env.local` NO está en el repo
- [ ] `node_modules/` NO está en el repo
- [ ] README.md visible en GitHub
- [ ] Proyecto funciona localmente con `npm run dev`

---

## 📞 ¿Problemas?

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin <TU-URL>
```

### Error: "Permission denied"
```bash
# Configura tu SSH key o usa HTTPS con token
# Guía: https://docs.github.com/en/authentication
```

### Quiero cambiar el nombre del commit
```bash
git commit --amend -m "Nuevo mensaje"
```

---

**🎯 Siguiente paso**: Una vez subido a Git, continuar con **Fase 2: API Client y Tipos**
