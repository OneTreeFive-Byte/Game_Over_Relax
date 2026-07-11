# 🌌 NEBULA STRIKE - Cyberpunk Galaxy Shooter

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-ff00ff?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-00ffff?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-00ff80?style=for-the-badge)

**Un videojuego arcade intergaláctico con estética cyberpunk y colores anime vibrantes**

[🎮 Jugar Ahora](#-instalación) • [📖 Documentación](#-documentación) • [🎯 Características](#-características)

</div>

---

## 🎮 Descripción

**NEBULA STRIKE** es un shooter espacial de estilo arcade desarrollado con tecnologías web modernas. Sumérgete en un universo cyberpunk donde pilotarás una nave intergaláctica a través de nebulosas neón, enfrentándote a oleadas de enemigos y jefes épicos con una estética inspirada en el anime japonés.

## ✨ Características

### 🎨 Visual
- 🌈 Paleta de colores cyberpunk con neón magenta, cyan y púrpura
- ✨ Efectos de partículas y explosiones cinematográficas
- 🌌 Fondo dinámico con nebulosas y estrellas en movimiento
- 💥 Efecto de screen shake y slow motion en momentos épicos
- 📺 Efecto scanline retro para ambiente cyberpunk auténtico

### 🎯 Gameplay
- 🚀 **5 tipos de enemigos** con comportamientos únicos (básico, rápido, zigzag, tirador, tanque)
- 👹 **Sistema de jefes** con múltiples fases y patrones de ataque
- 💎 **Power-ups** coleccionables (disparo rápido, multi-disparo, escudo, vida extra)
- ⚡ **Super ataque** cargable que destruye todo en pantalla
- 🔥 **Sistema de combos** con multiplicador de puntuación
- 📈 **Niveles progresivos** con dificultad escalada

### 🎵 Audio
- 🎶 Sistema de sonido procedural con Web Audio API
- 🔊 Efectos de disparo, explosión, power-up y más

## 🛠️ Tecnologías Utilizadas

El proyecto está construido con un stack tecnológico diverso y moderno:

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura del juego y canvas |
| **CSS3** | Estilos cyberpunk, animaciones y efectos |
| **JavaScript (ES6+)** | Lógica del juego, modularizada |
| **Canvas API** | Renderizado 2D del juego |
| **Web Audio API** | Sistema de sonido procedural |
| **Fontsource** | Tipografías Orbitron y Rajdhani |

> 💡 **Nota conceptual**: Aunque el juego está implementado en HTML/CSS/JS puro para máxima compatibilidad, la arquitectura modular está inspirada en principios de frameworks modernos como **React**, **Vue**, **Angular** y **jQuery**. La organización por módulos sigue patrones similares a los usados en **Swift**, **Elm** y **Sass** para mantener un código limpio y escalable.

## 📦 Instalación

### Opción 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nebula-strike.git
cd nebula-strike
```

### Opción 2: Abrir directamente

Simplemente abre el archivo `index.html` en tu navegador favorito:

```bash
# En Linux/Mac
open index.html

# En Windows
start index.html
```

### Opción 3: Servidor local (recomendado)

```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con VS Code Live Server
# Click derecho en index.html → "Open with Live Server"
```

Luego visita: `http://localhost:8000`

## 🎯 Controles

| Tecla | Acción |
|-------|--------|
| `← →` o `A D` | Mover nave horizontalmente |
| `↑ ↓` o `W S` | Mover nave verticalmente |
| `ESPACIO` o `CLICK` | Disparar |
| `SHIFT` | Super ataque (cuando esté cargado) |
