# ⚡ PJUD-SCRAPER

<div align="center">

![Version](https://img.shields.io/badge/version-4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Fetch API](https://img.shields.io/badge/Fetch%20API-native-00fff9.svg)
![Platform](https://img.shields.io/badge/platform-Browser%20Console-purple.svg)
![Made in Chile](https://img.shields.io/badge/Made%20in-Chile%20🇨🇱-red.svg)

**Sistema de extracción de datos judiciales del Poder Judicial de Chile (PJUD)**

*Herramienta de scraping con interfaz Cyberpunk para ejecutarse en la consola del navegador*

[Características](#-características) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Arquitectura](#-arquitectura-v40) •
[Configuración](#️-configuración) •
[Documentación](#-documentación)

</div>

---

## 📋 Descripción

**PJUD-SCRAPER** es una herramienta de web scraping desarrollada en JavaScript nativo que permite extraer información de causas penales desde la [Oficina Judicial Virtual](https://oficinajudicialvirtual.pjud.cl) del Poder Judicial de Chile.

A partir de la **v4.0**, el motor fue reescrito completamente para usar **requests directas** (`fetch API`) en vez de manipulación del DOM, eliminando la dependencia de jQuery y haciendo la herramienta significativamente más rápida y confiable.

Se ejecuta directamente en la consola del navegador, aprovechando la sesión autenticada del usuario. Cuenta con una interfaz visual estilo **Cyberpunk** con terminal en tiempo real.

### 🎯 Casos de Uso

- **Abogados**: Búsqueda masiva de causas por nombre de cliente
- **Estudios Jurídicos**: Monitoreo de casos en múltiples tribunales
- **Investigación**: Extracción de datos para análisis estadístico
- **Periodismo**: Investigación de casos judiciales

---

## ✨ Características

### 🔍 Búsqueda por Nombre
- Búsqueda por nombre, apellido paterno y/o materno
- Escaneo automático en **todos los tribunales penales** (156 tribunales hardcodeados)
- **Filtro por región** para búsquedas más rápidas
- Deep Scan automático con detalles completos por causa
- Paginación automática (hasta 5 páginas por tribunal)

### ⚡ Motor de Requests Directas
- `fetch()` nativo con `credentials: include` — usa la sesión activa del navegador
- Pool de **N workers en paralelo** (configurable, default 3)
- **Reintentos automáticos** con backoff exponencial ante errores o sesión expirada
- Detección automática del identificador de versión **ADIR** desde el DOM
- Sin dependencia de jQuery ni del estado del DOM del sitio

### 🗺️ Filtro por Región
156 tribunales clasificados por región. Busca solo en:
- Región Metropolitana (25 tribunales)
- Valparaíso, Biobío, Araucanía, Los Lagos
- Antofagasta, Atacama, Coquimbo, Tarapacá
- Arica y Parinacota, O'Higgins, Maule, Ñuble
- Los Ríos, Aysén, Magallanes, Rapa Nui

### 📊 Datos Extraídos

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| RIT | Búsqueda | Rol Interno del Tribunal |
| RUC | Búsqueda | Rol Único de Causa |
| Tribunal | Búsqueda | Nombre del tribunal |
| Caratulado | Búsqueda | Partes del caso |
| Estado | Búsqueda | Estado actual de la causa |
| Fecha Ingreso | Búsqueda | Fecha de ingreso al sistema |
| Etapa | Deep Scan | Etapa procesal actual |
| Forma Inicio | Deep Scan | Denuncia / Querella / etc. |
| Estado Actual | Deep Scan | Estado detallado de la causa |
| Litigantes | Deep Scan | Tipo, nombre y situación de libertad |
| Relaciones | Deep Scan | Delito, nombre, estado y fecha |
| Historia | Deep Scan | Trámites con fecha y estado |

### 🎨 Interfaz Cyberpunk
- Panel de control visual en **pantalla completa**
- **Terminal en tiempo real** con logs coloreados por tipo
- Tabla de resultados con **actualización en vivo** columna por columna
- Barra de progreso animada
- Stats en tiempo real: causas, tribunales, detalles, tiempo transcurrido
- Filtro instantáneo sobre los resultados
- Modal VER con JSON completo de cada causa
- Tema oscuro con colores neón (cyan, magenta, verde)

### 📤 Exportación
- **CSV**: Compatible con Excel, con columnas para hasta 3 litigantes y 2 relaciones
- **JSON**: Objeto completo incluyendo detalle anidado

---

## ⚡ Arquitectura v4.0

### Comparativa con v3.0

| Aspecto | v3.0 (anterior) | v4.0 (actual) |
|---------|-----------------|---------------|
| Motor | jQuery DOM manipulation | `fetch()` nativo |
| Dependencias | jQuery requerido | Sin dependencias externas |
| Ejecución | Loop secuencial | Pool de N workers en paralelo |
| DOM del sitio | Llenaba inputs, clickeaba botones | No toca el DOM del sitio |
| Esperas | Timeouts fijos por loader | Sin esperas artificiales |
| ADIR | Hardcodeado | Detectado dinámicamente del DOM |
| Endpoint detalle | `unificado/modal/causaUnificado.php` | `penal/modal/causaPenal.php` |
| Reintentos | Sin reintentos | Backoff exponencial configurable |
| Sesión expirada | Fallo silencioso | Detectado y reintentado |
| Velocidad (156 tribs) | ~30-40 min | ~3-5 min (conc. 3) |

### Flujo de una búsqueda
```
iniciarBusqueda()
  │
  ├── detectarADIR()          ← lee document.innerHTML, encuentra ADIR_XXX
  │
  ├── filtrar por región      ← array hardcodeado con region por tribunal
  │
  └── runPool(tasks, N)       ← N workers en paralelo
        │
        └── por cada tribunal:
              │
              ├── getToken('consultaNombre')     ← grecaptcha.execute()
              ├── fetch(consultaNombrePenal.php) ← POST con URLSearchParams
              ├── parsearBusqueda(html)           ← DOMParser + wrap <table>
              │
              └── por cada causa encontrada (Deep Scan ON):
                    ├── getToken('validate_captcha_detcau_penal')
                    ├── fetch(causaPenal.php)     ← POST con JWT de la causa
                    └── parsearDetalle(html)       ← #litigantesPen, #relacionesPen
```

---

## 🚀 Instalación

### Requisitos

1. Navegador moderno (Chrome, Firefox, Edge)
2. Sesión activa en [Oficina Judicial Virtual](https://oficinajudicialvirtual.pjud.cl)
3. Sin dependencias externas — JavaScript nativo

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Theblood/PJUD-SCRAPER-JQUERY.git
```

2. **Copiar el contenido de** `PJUDSCRAPER.JS`

3. **Ejecutar en el navegador**
   - Iniciar sesión en [oficinajudicialvirtual.pjud.cl](https://oficinajudicialvirtual.pjud.cl)
   - Navegar a cualquier página del dominio (no es necesario un módulo específico)
   - Abrir DevTools (`F12` o `Ctrl+Shift+I`)
   - Ir a la pestaña **Console**
   - Pegar el código y presionar `Enter`

---

## 📖 Uso

### Búsqueda por Nombre

1. Pegar el código en la consola — aparece el **panel Cyberpunk**
2. Completar los campos de búsqueda:
   - Nombre, Apellido Paterno, Apellido Materno (todos opcionales, al menos uno requerido)
   - Año (opcional — filtra por año de ingreso)
3. Seleccionar **región** (opcional — por defecto busca en todo Chile)
4. Configurar parámetros avanzados si es necesario
5. Activar o desactivar **Deep Scan** (carga litigantes, relaciones e historia)
6. Click en **⚡ INICIAR BÚSQUEDA ⚡**

### Terminal en Tiempo Real
```
[12:35:00] > ═══════════════════════════════════
[12:35:00] > CYBER SCRAPER v4.0 — REQUEST DIRECTO
[12:35:00] > OBJETIVO: JUAN PEREZ PEREZ
[12:35:00] > ADIR DETECTADO: ADIR_871
[12:35:00] > TRIBUNALES: 156 | REGIÓN: ALL
[12:35:00] > DEEP SCAN: ON | CONCURRENCIA: 3
[12:35:00] > ═══════════════════════════════════
[12:35:01] > → SCAN: Juzgado De Letras Y Garantía De Pozo Almonte
[12:35:02] > ✦ Ordinaria-1411-2015 — MINISTERIO PUBLICO C/ JUAN...
[12:35:02] > 📋 Ordinaria-1411-2015 — Porte de arma cortante...
[12:35:04] > ✓ Juzgado De Letras Y Garantía De Pozo Almonte
```

---

## ⚙️ Configuración

### Parámetros principales
```javascript
const CONCURRENCY       = 3;    // Workers en paralelo (recomendado: 3-5)
const MAX_RETRIES       = 5;    // Reintentos ante error o captcha expirado
const RETRY_BASE        = 500;  // ms base para backoff (500→1000→2000→4000→8000)
```

Todos son editables desde la interfaz sin tocar el código.

### Concurrencia recomendada

| Valor | Velocidad | Riesgo captcha |
|-------|-----------|----------------|
| 1-2 | Lenta | Muy bajo |
| 3 | Óptima ✅ | Bajo |
| 5 | Rápida | Medio |
| 10+ | Muy rápida | Alto — posibles redirects de sesión |

### Deep Scan

Con Deep Scan activado, por cada causa encontrada se hace una segunda request a `causaPenal.php` para obtener litigantes, relaciones e historia. Esto duplica aproximadamente el tiempo total pero enriquece mucho el CSV/JSON exportado.

---

## 📄 Ejemplo de Salida JSON
```json
{
  "rit": "Ordinaria-1411-2015",
  "ruc": "1500828482-K",
  "tribunal": "Juzgado De Letras Y Garantía De Pozo Almonte",
  "caratulado": "MINISTERIO PUBLICO C/ JUAN HOMERO PEREZ PEREZ",
  "estado": "Fallada o Concluida",
  "fecha_ingreso": "31/08/2015",
  "jwt": "eyJ0eXAiOiJKV1Qi...",
  "detalle": {
    "rit": "Ordinaria-2858-2024",
    "ruc": "1500828482-K",
    "etapa": "Inicio de la acción.",
    "formaInicio": "Denuncia",
    "estadoActual": "Concluida.",
    "procedimiento": "Ordinario",
    "litigantes": [
      {
        "tipo": "Denunciado.",
        "nombre": "JUAN HOMERO PEREZ PEREZ",
        "situacion": "Libre."
      },
      {
        "tipo": "Fiscal.",
        "nombre": "VALDÉS JERIA JUAN ELÍAS",
        "situacion": ""
      }
    ],
    "relaciones": [
      {
        "nombre": "PEREZ PEREZ JUAN HOMERO",
        "delito": "Porte de arma cortante o punzante. Art. 288 BIS, Código Penal",
        "estado_relacion": "Concluida",
        "fecha_cambio_estado": "31/08/2015"
      }
    ],
    "historia": [
      {
        "tipo": "Audiencia",
        "observacion": "Audiencia control de la detención",
        "fecha": "31/08/2015",
        "estado": "Realizada",
        "fecha_cambio_estado": "31/08/2015"
      }
    ]
  }
}
```

### CSV/Excel

El CSV incluye columnas separadas para datos básicos + hasta 3 litigantes + 2 relaciones con todos sus campos:
```
RIT, Tribunal, RUC, Caratulado, Fecha Ingreso, Estado,
Etapa, Procedimiento,
Lit1 Tipo, Lit1 Nombre, Lit1 Situación,
Lit2 Tipo, Lit2 Nombre, Lit2 Situación,
Lit3 Tipo, Lit3 Nombre, Lit3 Situación,
Rel1 Delito, Rel1 Nombre, Rel1 Estado, Rel1 Fecha,
Rel2 Delito, Rel2 Nombre, Rel2 Estado, Rel2 Fecha
```

---

## 🔧 Solución de Problemas

### La búsqueda no encuentra resultados

1. Verifica que el nombre esté escrito correctamente en mayúsculas
2. Prueba buscando solo con apellido paterno
3. Verifica que la sesión del PJUD esté activa
4. Revisa el terminal — si aparecen `[captcha]` en los reintentos, baja la concurrencia a 2-3

### Aparece redirect de sesión (`parent.window.open`)

El servidor detecta el token de recaptcha como inválido o expirado. El script lo detecta automáticamente y reintenta con backoff. Si es recurrente:
- Baja `CONCURRENCY` a 2
- Sube `RETRY_BASE` a 1000

### El detalle aparece en blanco

Verifica que el ADIR se detectó correctamente — debe aparecer en el terminal al inicio como `ADIR DETECTADO: ADIR_XXX`. Si el PJUD rotó el identificador y el script no lo encontró en el DOM, recarga la página del PJUD e intenta de nuevo.

### Algunos tribunales devuelven error

Normal — algunos tribunales pequeños tienen timeouts ocasionales. El sistema los reintenta automáticamente hasta `MAX_RETRIES` veces y continúa con el siguiente si falla definitivamente. Los fallos se registran en rojo en el terminal.

---

## 📁 Estructura del Proyecto
```
PJUD-SCRAPER/
├── README.md          # Este archivo
├── LICENSE            # Licencia MIT
├── PJUDSCRAPER.JS     # Script principal v4.0
└── examples/
    ├── output.json    # Ejemplo de salida JSON
    └── output.csv     # Ejemplo de salida CSV
```

---

## 🗺️ Roadmap

- [x] Requests directas sin dependencia del DOM
- [x] Detección dinámica de ADIR
- [x] Pool de concurrencia con N workers
- [x] Reintentos con backoff exponencial
- [x] Detección de redirect de sesión expirada
- [x] Deep scan con endpoint penal correcto (`causaPenal.php`)
- [x] Filtro por región hardcodeado (sin depender del select del sitio)
- [x] Export CSV enriquecido con litigantes y relaciones
- [x] Export JSON completo
- [ ] Soporte para otras competencias (Civil, Laboral, Familia)
- [ ] Búsqueda por RUC/RIT directo
- [ ] Exportación a PDF
- [ ] Sistema de caché local (IndexedDB)
- [ ] Notificaciones de nuevas causas

---

## 🛡️ Consideraciones Legales

⚠️ **IMPORTANTE**: Esta herramienta está diseñada para uso legítimo y ético.

| ✅ Uso Permitido | ❌ Uso Prohibido |
|------------------|------------------|
| Acceso a información pública con credenciales propias | Acceso no autorizado |
| Investigación académica y periodística | Sobrecarga intencional del servidor |
| Gestión de casos propios (abogados) | Venta de datos personales |
| Análisis estadístico de datos públicos | Uso para acoso o persecución |

El usuario es responsable del uso que le dé a esta herramienta. El script respeta la sesión autenticada del usuario y no implementa mecanismos para evadir controles de acceso.

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT — ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [Poder Judicial de Chile](https://www.pjud.cl) — Por proveer acceso a información pública
- [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) — Fuente Cyberpunk

---

<div align="center">

### ⚡ CYBER SCRAPER v4.0 ⚡

**Requests Directas · Sin Dependencias · Pool Concurrente**

![Cyberpunk](https://img.shields.io/badge/Style-Cyberpunk-ff00de.svg)
![Terminal](https://img.shields.io/badge/Terminal-Real%20Time-00ff00.svg)
![Fetch](https://img.shields.io/badge/Engine-Fetch%20API-00fff9.svg)
![Concurrent](https://img.shields.io/badge/Mode-Concurrent%20Pool-a371f7.svg)

</div>
