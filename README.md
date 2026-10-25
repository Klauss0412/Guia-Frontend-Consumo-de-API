# Guía Frontend: Consumo de API Pública | Terminal NERV EVA-02 🔴🟠🏍️

Portal web interactivo desarrollado para la asignatura **Diseño de sistemas en Internet**, aplicando el consumo de servicios web públicos en tiempo real mediante `fetch()`, `async/await`, `Promise.all` y manipulación dinámica del DOM.

## 👤 Autor
* **Nombre:** Klauss Joseph Saavedra Rayo

## 📁 Estructura del Proyecto
* `index.html` — Estructura principal del portal web y barra de controles interactivos.
* `styles.css` — Hoja de estilos inspirada en la paleta de colores de **Asuka Langley Soryu (Unidad Evangelion-02)** y la interfaz MAGI de NERV.
* `script.js` — Lógica de peticiones HTTP asíncronas (`fetch`) a las APIs públicas y renderizado de tarjetas en el DOM.

## 🌐 APIs Públicas Consumidas
1. **Wikipedia REST API v1 (`https://es.wikipedia.org/api/rest_v1/` & `en.wikipedia.org`):**
   * **Expediente Asuka (EVA-02):** Consulta en vivo de los datos, extracto e imagen oficial de *Asuka Langley Soryu*.
   * **Pilotos & Personal NERV:** Peticiones paralelas (`Promise.all`) para obtener las tarjetas de los pilotos y unidades de *Neon Genesis Evangelion*.
   * **Ficha Técnica Honda CBR600RR:** Obtención dinámica de la imagen y resumen técnico de la motocicleta deportiva *Honda CBR600RR*.
2. **Kitsu Anime & Manga REST API (`https://kitsu.io/api/edge/`):**
   * **Buscador en tiempo real:** Permite filtrar y buscar cualquier **Manga, Manhwa o Anime** (ej. *Solo Leveling*, *Evangelion*, *Berserk*), devolviendo portadas, calificaciones, estado y sinopsis (con respaldo automático en MediaWiki Action API).

## 🚀 Ejecución Local
1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/Klauss0412/Guia-Frontend-Consumo-de-API.git](https://github.com/Klauss0412/Guia-Frontend-Consumo-de-API.git)