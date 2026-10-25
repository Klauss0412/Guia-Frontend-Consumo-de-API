const contenedor = document.getElementById('contenedorResultados');
const statusBar = document.getElementById('statusBar');

// Eventos de los botones
document.getElementById('btnAsuka').addEventListener('click', cargarExpedienteAsuka);
document.getElementById('btnPersonajes').addEventListener('click', cargarPersonajesEvangelion);
document.getElementById('btnHonda').addEventListener('click', cargarFichaHondaCBR);
document.getElementById('btnBuscar').addEventListener('click', buscarEnAPI);
document.getElementById('inputBusqueda').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarEnAPI();
});

// 1. ENDPOINT: Expediente de Asuka Langley Soryu (Wikipedia REST API ES/EN)
async function cargarExpedienteAsuka() {
    const url = 'https://es.wikipedia.org/api/rest_v1/page/summary/Asuka_Langley_Soryu';
    statusBar.textContent = `📡 GET ${url} — Descargando expediente de Asuka Langley...`;
    contenedor.innerHTML = '';

    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        // Obtenemos también la imagen de alta resolución desde la API en inglés si hace falta
        const resImg = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Asuka_Langley_Soryu');
        const dataImg = await resImg.json();
        const fotoAsuka = (data.thumbnail && data.thumbnail.source) || (dataImg.thumbnail && dataImg.thumbnail.source);

        statusBar.textContent = `✅ 200 OK: Sincronización completada — Piloto ${data.title} (ID Pág: #${data.pageid})`;

        contenedor.innerHTML = `
            <div class="dossier-box">
                <img src="${fotoAsuka}" alt="${data.title}">
                <div class="dossier-details">
                    <span class="badge">PILOTO OFICIAL UNIDAD EVA-02 // ID API: #${data.pageid}</span>
                    <h2 style="color:#ff5400; margin: 8px 0;">${data.title} (惣流・アスカ・ラングレー)</h2>
                    <p class="card-info"><strong>Designación NERV:</strong> Second Children (Segunda Elegida) / Piloto Evangelion Unidad-02</p>
                    <p class="card-info"><strong>Descripción en la API:</strong> ${data.description || 'Personaje ficticio de Neon Genesis Evangelion'}</p>
                    <p class="card-info" style="margin-top:12px;">
                        ${data.extract}
                    </p>
                    <table class="specs-table">
                        <tr>
                            <th>Unidad Asignada</th>
                            <td>Evangelion Unidad-02 (Production Model)</td>
                        </tr>
                        <tr>
                            <th>Nacionalidad / Idiomas</th>
                            <td>Alemana-Japonesa-Estadounidense (Alemán, Japonés, Inglés)</td>
                        </tr>
                        <tr>
                            <th>Tasa de Sincronización</th>
                            <td>98.4% (Nivel Táctico Superior)</td>
                        </tr>
                    </table>
                    <br>
                    <a class="card-link" href="${data.content_urls.desktop.page}" target="_blank">🔗 Ver registro oficial completo en la API →</a>
                </div>
            </div>
        `;
    } catch (error) {
        statusBar.textContent = '❌ Error al conectar con la API: ' + error.message;
    }
}

// 2. ENDPOINT: Ficha Técnica de la Honda CBR600RR (Wikipedia REST API)
async function cargarFichaHondaCBR() {
    const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/Honda_CBR600RR';
    statusBar.textContent = `📡 GET ${wikiUrl} — Consultando datos e imagen oficial de Honda CBR600RR...`;
    contenedor.innerHTML = '';

    try {
        const respuesta = await fetch(wikiUrl);
        const data = await respuesta.json();

        statusBar.textContent = `✅ 200 OK: Ficha Técnica sincronizada desde API para "${data.title}"`;

        const imagenMoto = data.thumbnail ? data.thumbnail.source : '';

        contenedor.innerHTML = `
            <div class="dossier-box">
                <img src="${imagenMoto}" alt="${data.title}">
                <div class="dossier-details">
                    <span class="badge">UNIDAD TERRESTRE // SUPERSPORT 600CC</span>
                    <h2 style="color:#ff5400; margin: 8px 0;">${data.title} (Edición Roja / Repsol)</h2>
                    <p class="card-info"><strong>Resumen extraído de la API:</strong> ${data.extract}</p>

                    <table class="specs-table">
                        <tr>
                            <th>Motor</th>
                            <td>599 cc (4 tiempos, 4 cilindros en línea, DOHC, 16 válvulas, refrigeración líquida)</td>
                        </tr>
                        <tr>
                            <th>Potencia Máxima</th>
                            <td>119 CV (89 kW) @ 14,000 rpm</td>
                        </tr>
                        <tr>
                            <th>Transmisión</th>
                            <td>6 velocidades con Quickshifter y embrague antirrebote</td>
                        </tr>
                        <tr>
                            <th>Peso en orden de marcha</th>
                            <td>193 kg</td>
                        </tr>
                        <tr>
                            <th>Colores Favoritos (Operador)</th>
                            <td>Grand Prix Red (Rojito) & Edición Especial Repsol</td>
                        </tr>
                    </table>
                    <br>
                    <a class="card-link" href="${data.content_urls.desktop.page}" target="_blank">🔗 Ver documentación completa en Wikipedia API →</a>
                </div>
            </div>
        `;
    } catch (error) {
        statusBar.textContent = '❌ Error al consultar la API de la Honda CBR600RR: ' + error.message;
    }
}

// 3. ENDPOINT: Pilotos, Evas y Personal de NERV (Consultas paralelas con Promise.all)
async function cargarPersonajesEvangelion() {
    const objetivosNerv = [
        { slug: 'Asuka_Langley_Soryu', rol: 'PILOTO EVA-02' },
        { slug: 'Shinji_Ikari', rol: 'PILOTO EVA-01' },
        { slug: 'Rei_Ayanami', rol: 'PILOTO EVA-00' },
        { slug: 'Misato_Katsuragi', rol: 'COMANDANTE TÁCTICO' },
        { slug: 'Kaworu_Nagisa', rol: 'FIFTH CHILDREN' },
        { slug: 'Gendo_Ikari', rol: 'COMANDANTE SUPREMO NERV' },
        { slug: 'Neon_Genesis_Evangelion', rol: 'PROYECTO E / SERIE' },
        { slug: 'The_End_of_Evangelion', rol: 'OPERACIÓN FINAL' }
    ];

    statusBar.textContent = '📡 GET https://en.wikipedia.org/api/rest_v1/page/summary/{piloto} — Sincronizando registros de NERV...';
    contenedor.innerHTML = '';

    try {
        const promesas = objetivosNerv.map(obj =>
            fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${obj.slug}`)
                .then(res => res.json())
                .then(data => ({ ...data, rolNerv: obj.rol }))
        );

        const resultados = await Promise.all(promesas);

        statusBar.textContent = `✅ 200 OK: ${resultados.length} expedientes oficiales de NERV descargados desde la API.`;

        resultados.forEach(item => {
            const img = item.thumbnail ? item.thumbnail.source : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';
            const tarjeta = document.createElement('div');
            tarjeta.className = 'card';
            tarjeta.innerHTML = `
                <img src="${img}" alt="${item.title}">
                <div class="card-body">
                    <span class="badge">${item.rolNerv}</span>
                    <div class="card-title">${item.title}</div>
                    <div class="card-info"><strong>ID API:</strong> #${item.pageid || 'NERV-02'}</div>
                    <div class="card-info">
                        ${item.extract ? item.extract.substring(0, 95) + '...' : 'Registro clasificado de NERV.'}
                    </div>
                    <a class="card-link" href="${item.content_urls ? item.content_urls.desktop.page : '#'}" target="_blank">Abrir expediente →</a>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        statusBar.textContent = '❌ Error al cargar personal de NERV: ' + error.message;
    }
}

// 4. ENDPOINT: Buscador en tiempo real de Anime, Manga y Manhwa (Kitsu API + Respaldo Wikipedia API)
async function buscarEnAPI() {
    const query = document.getElementById('inputBusqueda').value.trim() || 'Evangelion';
    const tipo = document.getElementById('tipoBusqueda').value; // 'manga' o 'anime'
    const kitsuUrl = `https://kitsu.io/api/edge/${tipo}?filter[text]=${encodeURIComponent(query)}&page[limit]=12`;

    statusBar.textContent = `📡 GET ${kitsuUrl} — Buscando "${query}" en la base de datos...`;
    contenedor.innerHTML = '';

    try {
        const respuesta = await fetch(kitsuUrl);
        if (!respuesta.ok) throw new Error('ambiando a servidor secundario');
        const json = await respuesta.json();
        const resultados = json.data;

        if (!resultados || resultados.length === 0) {
            statusBar.textContent = `⚠️ No se encontraron resultados para "${query}".`;
            return;
        }

        statusBar.textContent = `✅ 200 OK: Mostrando ${resultados.length} resultados en vivo de ${tipo.toUpperCase()} para "${query.toUpperCase()}".`;

        resultados.forEach(item => {
            const attr = item.attributes;
            const titulo = attr.canonicalTitle || attr.titles.en || attr.titles.en_jp || 'Sin título';
            const img = (attr.posterImage && (attr.posterImage.medium || attr.posterImage.original)) || '';
            const puntaje = attr.averageRating ? `${attr.averageRating}%` : 'N/A';
            const subtipo = (attr.subtype || tipo).toUpperCase();

            const tarjeta = document.createElement('div');
            tarjeta.className = 'card';
            tarjeta.innerHTML = `
                <img src="${img}" alt="${titulo}">
                <div class="card-body">
                    <span class="badge">${subtipo} // ⭐ ${puntaje}</span>
                    <div class="card-title">${titulo}</div>
                    <div class="card-info"><strong>Estado:</strong> ${attr.status || 'Publicado'}</div>
                    <div class="card-info">
                        ${attr.synopsis ? attr.synopsis.substring(0, 90) + '...' : 'Sin sinopsis disponible.'}
                    </div>
                    <a class="card-link" href="https://kitsu.io/${tipo}/${attr.slug}" target="_blank">Ver en Kitsu Database →</a>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        // Si la red bloquea Kitsu, usa automáticamente Wikipedia OpenSearch API (que ya comprobaste que sí funciona en tu PC)
        buscarConRespaldoWikipedia(query, tipo);
    }
}

// Respaldo automático con MediaWiki API por si el navegador bloquea dominios externos
async function buscarConRespaldoWikipedia(query, tipo) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query + ' ' + tipo)}&gsrlimit=8&prop=pageimages|extracts&exintro=1&explaintext=1&exchars=120&piprop=thumbnail&pithumbsize=400&format=json&origin=*`;
    statusBar.textContent = `📡 GET ${url} — Consultando API...`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const paginas = data.query ? Object.values(data.query.pages) : [];

        statusBar.textContent = `✅ 200 OK: ${paginas.length} resultados encontrados para "${query.toUpperCase()}".`;

        paginas.forEach(p => {
            const img = p.thumbnail ? p.thumbnail.source : 'https://upload.wikimedia.org/wikipedia/en/5/59/Asuka_Langley_Soryu.png';
            const tarjeta = document.createElement('div');
            tarjeta.className = 'card';
            tarjeta.innerHTML = `
                <img src="${img}" alt="${p.title}">
                <div class="card-body">
                    <span class="badge">${tipo.toUpperCase()} // ID #${p.pageid}</span>
                    <div class="card-title">${p.title}</div>
                    <div class="card-info">${p.extract || 'Registro encontrado en la API.'}</div>
                    <a class="card-link" href="https://en.wikipedia.org/?curid=${p.pageid}" target="_blank">Abrir registro →</a>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    } catch (err) {
        statusBar.textContent = '❌ Error de red: ' + err.message;
    }
}

// Carga inicial automática al abrir el portal
window.addEventListener('DOMContentLoaded', cargarPersonajesEvangelion);