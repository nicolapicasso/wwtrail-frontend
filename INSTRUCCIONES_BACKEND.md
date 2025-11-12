# Instrucciones para Corregir Error en Backend

## PROBLEMA
El endpoint `GET /api/v2/competitions/:competitionId/editions` está fallando con error 500.

## ERROR DE PRISMA
```
Invalid `prisma.edition.findMany()` invocation
Unknown field `participants` for select statement on model `EditionCountOutputType`
```

**Ubicación del error:** `src/services/edition.service.ts` línea ~179 (método `findByCompetition`)

## CAUSA RAÍZ
El método está intentando hacer `_count` de campos que no existen en el modelo Edition según el esquema actual de Prisma.

### CAMPOS QUE FALLAN (no existen):
- ❌ `participants`
- ❌ `results`
- ❌ `reviews`

### CAMPOS DISPONIBLES según Prisma:
- ✅ `userEditions` (probablemente el equivalente a participants)
- ✅ `blogPosts`
- ✅ `ratings`
- ✅ `podiums`
- ✅ `photos`

## SOLUCIÓN REQUERIDA

### Opción 1: Actualizar a los campos correctos
Cambiar el archivo `src/services/edition.service.ts` en el método `findByCompetition()` (alrededor de la línea 179):

**ANTES:**
```typescript
_count: {
  select: {
    participants: true,  // ❌ No existe
    results: true,       // ❌ No existe
    reviews: true,       // ❌ No existe
  }
}
```

**DESPUÉS:**
```typescript
_count: {
  select: {
    userEditions: true,  // ✅ Participantes (relación correcta)
    ratings: true,       // ✅ Existe
    podiums: true,       // ✅ Existe
    photos: true,        // ✅ Existe
    blogPosts: true,     // ✅ Existe (opcional)
  }
}
```

### Opción 2: Eliminar el _count temporalmente
Si no necesitáis estos contadores inmediatamente, podéis eliminar el bloque `_count` completamente hasta que se decida qué campos contar.

## VERIFICACIÓN
Después del cambio, probar que:
1. El endpoint `GET /api/v2/competitions/:competitionId/editions` devuelve las ediciones correctamente
2. No hay error 500
3. Las ediciones aparecen en:
   - Página pública de competición: `/events/[eventSlug]/[competitionSlug]`
   - Página de organizador: `/organizer/editions`

## ARCHIVOS A REVISAR
- `src/services/edition.service.ts` (método `findByCompetition`, línea ~179)
- Buscar otros métodos que puedan tener el mismo problema con `_count`

## CONSULTA SQL CORRECTA ESPERADA
```typescript
const editions = await prisma.edition.findMany({
  where: {
    competitionId: "xxx"
  },
  orderBy: {
    year: "desc"
  },
  include: {
    competition: {
      select: {
        id: true,
        name: true,
        slug: true
      }
    },
    _count: {
      select: {
        userEditions: true,  // CAMBIO: participants → userEditions
        ratings: true,
        podiums: true,
        photos: true,
        blogPosts: true
      }
    }
  }
})
```

## NOTA ADICIONAL
Este error surgió al cambiar el frontend para usar el endpoint dedicado `/competitions/:competitionId/editions` en lugar de extraer las ediciones del objeto de competición. El frontend ahora está correcto y espera este endpoint.
