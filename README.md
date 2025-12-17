# ⚡ PJUD-SCRAPER-JQUERY

<div align="center">

![Version](https://img.shields.io/badge/version-3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![jQuery](https://img.shields.io/badge/jQuery-required-orange.svg)
![Platform](https://img.shields.io/badge/platform-Browser%20Console-purple.svg)

**Sistema de extracción de datos judiciales del Poder Judicial de Chile (PJUD)**

*Herramienta de scraping con interfaz Cyberpunk para ejecutarse en la consola del navegador*

[Características](#-características) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Configuración](#%EF%B8%8F-configuración) •
[Documentación](#-documentación)

<img src="https://img.shields.io/badge/Made%20in-Chile%20🇨🇱-red.svg" alt="Made in Chile">

</div>

---

## 📋 Descripción

**PJUD-SCRAPER-JQUERY** es una herramienta de web scraping desarrollada en JavaScript/jQuery que permite extraer información de causas penales desde la [Oficina Judicial Virtual](https://oficinajudicialvirtual.pjud.cl) del Poder Judicial de Chile.

La herramienta se ejecuta directamente en la consola del navegador, aprovechando la sesión autenticada del usuario para acceder a los datos. Cuenta con una interfaz visual estilo **Cyberpunk** con terminal en tiempo real.

### 🎯 Casos de Uso

- **Abogados**: Búsqueda masiva de causas por nombre de cliente
- **Estudios Jurídicos**: Monitoreo de casos en múltiples tribunales
- **Investigación**: Extracción de datos para análisis estadístico
- **Periodismo**: Investigación de casos judiciales

---

## ✨ Características

### 🔍 Búsqueda por Nombre
- Búsqueda por nombre, apellido paterno y/o materno
- Escaneo automático en **todos los tribunales penales** (~200 tribunales)
- **Filtro por región** para búsquedas más rápidas
- Extracción profunda (Deep Scan) de detalles de cada causa

### ⚡ Modo Turbo
- Velocidad optimizada para conexiones rápidas
- Tiempos de espera reducidos
- Configurable desde la interfaz

### 🗺️ Filtro por Región
Busca solo en tribunales de una región específica:
- Región Metropolitana
- Valparaíso
- Biobío
- La Araucanía
- Los Lagos
- Y todas las demás regiones de Chile
- Incluye **Rapa Nui** (Isla de Pascua)

### 📊 Datos Extraídos

| Campo | Descripción |
|-------|-------------|
| RIT | Rol Interno del Tribunal |
| RUC | Rol Único de Causa |
| Tribunal | Nombre del tribunal |
| Caratulado | Partes del caso |
| Estado | Estado actual de la causa |
| Fecha Ingreso | Fecha de ingreso al sistema |
| Etapa | Etapa procesal actual |
| Forma Inicio | Cómo se inició la causa |
| Litigantes | Lista de partes con situación de libertad |
| Relaciones | Delitos y relaciones procesales |

### 🎨 Interfaz Cyberpunk
- Panel de control visual en **pantalla completa**
- **Terminal en tiempo real** con logs detallados
- Tabla de resultados con **actualización en vivo**
- Diseño **100% responsivo** para cualquier resolución
- Tema oscuro con colores neón (cyan, magenta, verde)
- Animaciones y efectos visuales

### 📤 Exportación
- **CSV/Excel**: Compatible con hojas de cálculo
- **JSON**: Para integración con APIs y bases de datos

---

## 🚀 Instalación

### Requisitos Previos

1. Navegador moderno (Chrome, Firefox, Edge)
2. Ir a [Oficina Judicial Virtual](https://oficinajudicialvirtual.pjud.cl/includes/sesion-consultaunificada.php)


### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/PJUD-SCRAPER-JQUERY.git
```

2. **Abrir el archivo del scraper**
   - `PJUDSCRAPER.JS` - Búsqueda por nombre (versión actual)

3. **Copiar todo el contenido del archivo**

4. **Ejecutar en el navegador**
   - Iniciar sesión en [oficinajudicialvirtual.pjud.cl](https://oficinajudicialvirtual.pjud.cl)
   - Ir al módulo de **Consulta de Causas**
   - Abrir DevTools (`F12` o `Ctrl+Shift+I`)
   - Ir a la pestaña **Console**
   - Pegar el código y presionar `Enter`

---

## 📖 Uso

### Búsqueda por Nombre

1. **Pegar el código** en la consola del navegador
2. Aparecerá el **panel Cyberpunk** en pantalla completa
3. **Completar los campos**:
   - Nombre (opcional)
   - Apellido Paterno (opcional)
   - Apellido Materno (opcional)
4. **Seleccionar región** (opcional - por defecto busca en todo Chile)
5. **Configurar opciones**:
   - ☑ Escanear todos los tribunales
   - ☑ Extracción profunda (Deep Scan)
   - ☑ Modo Turbo (para conexiones rápidas)
   - Max detalles por tribunal (0-9999)
6. Click en **⚡ INICIAR BÚSQUEDA ⚡**

### Terminal en Tiempo Real

El terminal muestra todo el proceso:
```
[12:34:56] > SISTEMA INICIADO
[12:34:56] > ESPERANDO COMANDOS...
[12:34:58] > ═══════════════════════════════════════
[12:34:58] > INICIANDO SISTEMA DE BÚSQUEDA v3.0
[12:34:58] > ═══════════════════════════════════════
[12:35:00] > CONFIGURANDO COMPETENCIA PENAL...
[12:35:02] > 200 TRIBUNALES CARGADOS
[12:35:02] > FILTRO REGIÓN: RM => 45/200 TRIBUNALES
[12:35:02] > OBJETIVO: JUAN GONZÁLEZ SILVA
[12:35:02] > INICIANDO ESCANEO...
[12:35:03] > SCAN [1/45]: Juzgado de Garantía de Santiago
[12:35:08] > 3 CAUSAS ENCONTRADAS
[12:35:08] > DEEP SCAN: Ordinaria-1234-2024
[12:35:10] > DETALLE OK: Ordinaria-1234-2024 (lit=2, rel=1)
```

---

## ⚙️ Configuración

### Parámetros de Velocidad (CFG)

El código incluye una sección de configuración al inicio:

```javascript
const CFG = {
  // Modo Turbo por defecto
  turboDefault: true,

  // Delays (milisegundos)
  delay: {
    select: { turbo: 80, normal: 300 },       // Después de cambiar tribunal
    afterLoad: { turbo: 160, normal: 450 },   // Post-loader para render
    afterCloseModal: { turbo: 120, normal: 320 } // Después de cerrar modal
  },

  // Timeout por tribunal
  timeoutNombre: { turbo: 25000, normal: 30000 },

  // Límite de detalles por tribunal
  maxDetallesDefault: 10,

  // Render liviano mientras corre
  liteRender: true
};
```

### Opciones de Interfaz

| Opción | Descripción | Default |
|--------|-------------|---------|
| Modo Turbo | Reduce tiempos de espera | Activado |
| Max Detalles | Límite de deep scan por tribunal | 10 |
| Escanear Todos | Recorre todos los tribunales | Activado |
| Deep Scan | Extrae detalles completos | Activado |

### Filtro por Región

Keywords utilizados para filtrar tribunales por región:

```javascript
const REGION_KEYWORDS = {
  rm: ['santiago', 'colina', 'puente alto', 'san bernardo', 'melipilla'...],
  valpo: ['valparaiso', 'vina del mar', 'quilpue', 'san antonio'...],
  bio: ['concepcion', 'talcahuano', 'los angeles', 'coronel'...],
  // ... más regiones
};
```

---

## 📄 Ejemplo de Salida

### JSON

```json
{
  "rit": "Ordinaria-1234-2024",
  "ruc": "2400012345-6",
  "tribunal": "Juzgado de Garantía de Santiago",
  "caratulado": "GONZÁLEZ/SILVA",
  "estado": "Ingresada",
  "fecha_ingreso": "15/12/2024",
  "detalle": {
    "informacion_general": {
      "rit": "Ordinaria-1234-2024",
      "ruc": "2400012345-6",
      "fecha_ingreso": "15/12/2024",
      "estado_actual": "Vigente",
      "etapa": "Investigación",
      "forma_inicio": "Denuncia"
    },
    "litigantes": [
      {
        "tipo": "Imputado",
        "nombre": "JUAN GONZÁLEZ SILVA",
        "situacion_libertad": "Libre"
      },
      {
        "tipo": "Víctima",
        "nombre": "PEDRO MARTÍNEZ ROJAS",
        "situacion_libertad": ""
      }
    ],
    "relaciones": [
      {
        "nombre": "JUAN GONZÁLEZ SILVA",
        "delito": "Hurto Simple",
        "estado_relacion": "Vigente",
        "fecha_cambio_estado": "15/12/2024"
      }
    ],
    "esta_reservada": false
  }
}
```

### CSV/Excel

El CSV incluye columnas separadas para:
- Datos básicos de la causa
- Litigante 1 y 2 (tipo, nombre)
- Relación 1 y 2 (delito, nombre, estado)

---

## 🔧 Solución de Problemas

### Error: "jQuery no está disponible"

El portal PJUD carga jQuery automáticamente. Si aparece este error:
1. Espera a que la página cargue completamente
2. Recarga la página e intenta nuevamente
3. Asegúrate de estar en el módulo de Consulta de Causas

### La búsqueda no encuentra resultados

1. Verifica que los datos de búsqueda sean correctos
2. Asegúrate de estar en el módulo correcto
3. Verifica tu sesión (puede haber expirado)
4. Prueba desactivando el filtro de región

### Timeout en tribunales

Algunos tribunales pueden tardar más:
1. Desactiva el **Modo Turbo**
2. El sistema continuará automáticamente con el siguiente
3. Los timeouts se registran en el terminal

### El modal de detalle no carga

1. Aumenta el valor de `maxDetalles` a 0 para desactivar Deep Scan
2. Verifica que la causa tenga el ícono de detalle (lupa)
3. Desactiva Modo Turbo para dar más tiempo

### El filtro de región no incluye mi tribunal

Puedes agregar keywords al objeto `REGION_KEYWORDS` en el código:
```javascript
REGION_KEYWORDS.turegion = ['ciudad1', 'ciudad2', ...];
```

---

## 📁 Estructura del Proyecto

```
PJUD-SCRAPER-JQUERY/
├── README.md                   # Este archivo
├── LICENSE                     # Licencia MIT
├── scraper-nombre-v3.js        # Scraper principal (búsqueda por nombre)
└── examples/
    ├── output-ejemplo.json     # Ejemplo de salida JSON
    └── output-ejemplo.csv      # Ejemplo de salida CSV
```

---

## 🛡️ Consideraciones Legales

⚠️ **IMPORTANTE**: Esta herramienta está diseñada para uso legítimo y ético.

| ✅ Uso Permitido | ❌ Uso Prohibido |
|------------------|------------------|
| Acceso a información pública con credenciales propias | Acceso no autorizado |
| Investigación académica y periodística | Sobrecarga intencional del servidor |
| Gestión de casos propios (abogados) | Venta de datos personales |
| Análisis estadístico de datos públicos | Uso para acoso o persecución |

El usuario es responsable del uso que le dé a esta herramienta.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Ideas para Contribuir

- [ ] Soporte para otras competencias (Civil, Laboral, Familia)
- [ ] Búsqueda por RUC/RIT directo
- [ ] Exportación a PDF
- [ ] Sistema de caché local
- [ ] Notificaciones de nuevas causas
- [ ] Modo oscuro/claro

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

Desarrollado con ❤️ en Chile 🇨🇱

---

## 🙏 Agradecimientos

- [Poder Judicial de Chile](https://www.pjud.cl) - Por proveer acceso a información pública
- [jQuery](https://jquery.com) - Librería JavaScript utilizada
- [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) - Fuente Cyberpunk

---

<div align="center">

### ⚡ CYBER SCRAPER v3.0 ⚡

**Búsqueda Judicial Avanzada**

![Cyberpunk](https://img.shields.io/badge/Style-Cyberpunk-ff00de.svg)
![Terminal](https://img.shields.io/badge/Terminal-Real%20Time-00ff00.svg)
![Responsive](https://img.shields.io/badge/UI-Responsive-00fff9.svg)

</div>
