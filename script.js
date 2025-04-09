// Estado de la aplicación
let ultimasBusquedaResultados = [];
let filtrosActuales = {
    genero: "",
    subgenero: "",
    director: "",
    duracion: 180,
    clasificaciones: ["G", "PG", "PG-13", "R"]
};

const genero_container = document.getElementById('genero');
const generosList = Object.keys(subgeneros); 

generosList.forEach((genero) => {
    const option = document.createElement('option');
    option.value = genero;
    option.textContent = genero;
    genero_container.appendChild(option);
})

// Función para inicializar la aplicación
function inicializarApp() {
    // Configurar eventos para los selectores
    document.getElementById('genero').addEventListener('change', actualizarSubgeneros);
    document.getElementById('subgenero').addEventListener('change', () => {
        filtrosActuales.subgenero = document.getElementById('subgenero').value;
    });
    document.getElementById('director').addEventListener('change', () => {
        filtrosActuales.director = document.getElementById('director').value;
    });
    
    // Configurar evento para el slider de duración
    const sliderDuracion = document.getElementById('duracion');
    sliderDuracion.addEventListener('input', () => {
        const valorDuracion = document.getElementById('duracion-valor');
        valorDuracion.textContent = `${sliderDuracion.value} min`;
        filtrosActuales.duracion = parseInt(sliderDuracion.value);
    });
    
    // Configurar evento para los checkboxes de clasificación
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarClasificaciones);
    });
    
    // Configurar evento para el botón de recomendar
    document.getElementById('recomendar').addEventListener('click', () => 
        {
            recomendarPeliculas();
            generarVenn(generarSets(filtrosActuales));
        });
    
    // Configurar evento para el botón de limpiar
    document.getElementById('limpiar').addEventListener('click', limpiarFiltros);
    
    // Mostrar todas las películas inicialmente
    recomendarPeliculas();
}

// Función para actualizar los subgéneros según el género seleccionado
function actualizarSubgeneros() {
    const generoSeleccionado = document.getElementById('genero').value;
    const subgeneroSelect = document.getElementById('subgenero');
    
    // Actualizar el estado
    filtrosActuales.genero = generoSeleccionado;
    
    // Limpiar y deshabilitar los subgéneros si no se selecciona un género
    subgeneroSelect.innerHTML = '<option value="">Seleccione un subgénero</option>';
    subgeneroSelect.disabled = !generoSeleccionado;

    if (generoSeleccionado && subgeneros[generoSeleccionado]) {
        subgeneros[generoSeleccionado].forEach(subgenero => {
            const option = document.createElement('option');
            option.value = subgenero;  //Este es el valor que se enviara si el usuario selecciona la opcion
            option.textContent = subgenero;
            subgeneroSelect.appendChild(option); //(El elemento HTML al que voy a modificar).(lo que voy a agregar)
        });
    }
    
    if(filtrosActuales.subgenero || filtrosActuales.director){
        filtrosActuales.subgenero = '';
        filtrosActuales.director = '';
    }

    // Actualizar los directores
    actualizarDirectores();
}

// Función para actualizar los directores según el género seleccionado
function actualizarDirectores() {
    const generoSeleccionado = document.getElementById('genero').value;
    const directorSelect = document.getElementById('director');
    
    // Limpiar y deshabilitar los directores si no se selecciona un género
    directorSelect.innerHTML = '<option value="">Seleccione un director</option>';
    directorSelect.disabled = !generoSeleccionado;

    if (generoSeleccionado && directores[generoSeleccionado]) {
        directores[generoSeleccionado].forEach(director => {
            const option = document.createElement('option');
            option.value = director;
            option.textContent = director;
            directorSelect.appendChild(option);
        });
    }
}

// Función para actualizar las clasificaciones seleccionadas
function actualizarClasificaciones() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    filtrosActuales.clasificaciones = Array.from(checkboxes).map(cb => cb.value);
}

// Función para limpiar todos los filtros
function limpiarFiltros() {
    // Restablecer selectores
    document.getElementById('genero').value = "";
    document.getElementById('subgenero').value = "";
    document.getElementById('subgenero').disabled = true;
    document.getElementById('director').value = "";
    document.getElementById('director').disabled = true;
    
    // Restablecer duración
    document.getElementById('duracion').value = 180;
    document.getElementById('duracion-valor').textContent = "180 min";
    
    // Restablecer clasificaciones
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Actualizar estado
    filtrosActuales = {
        genero: "",
        subgenero: "",
        director: "",
        duracion: 180,
        clasificaciones: ["G", "PG", "PG-13", "R"]
    };
    
    // Recomendar de nuevo (mostrar todas)
    recomendarPeliculas();
}

// Función para recomendar películas según las selecciones del usuario
function recomendarPeliculas() {
    const peliculasRecomendadas = peliculas.filter(pelicula => {
        const generoCoincide = filtrosActuales.genero ? pelicula.genero === filtrosActuales.genero : true;
        const subgeneroCoincide = filtrosActuales.subgenero ? pelicula.subgenero === filtrosActuales.subgenero : true;
        const directorCoincide = filtrosActuales.director ? pelicula.director === filtrosActuales.director : true;
        const duracionCoincide = pelicula.duracion <= filtrosActuales.duracion;
        const clasificacionCoincide = filtrosActuales.clasificaciones.includes(pelicula.clasificacion);
        
        return generoCoincide && subgeneroCoincide && directorCoincide && duracionCoincide && clasificacionCoincide;
    });

    // Guardar resultados de la búsqueda
    ultimasBusquedaResultados = peliculasRecomendadas;
    
    // Mostrar recomendaciones y actualizar visualizaciones
    mostrarRecomendaciones(peliculasRecomendadas);
    actualizarEstadisticas(peliculasRecomendadas);
    //actualizarGraficoVenn(peliculasRecomendadas);
    //generarVenn(generarSets());
}

// Función para mostrar las recomendaciones de películas en la interfaz
function mostrarRecomendaciones(peliculas) {
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = ""; // Limpiar resultados previos

    if (peliculas.length === 0) {
        resultados.innerHTML = '<div class="no-resultados">No se encontraron películas con las preferencias seleccionadas. Ajusta tus filtros.</div>';
        return;
    }

    peliculas.forEach(pelicula => {
        const card = document.createElement('div');
        card.className = 'pelicula-card';
        
        // Color de fondo según la puntuación (verde para alta, rojo para baja)
        const colorPuntuacion = puntuacionAColor(pelicula.puntuacion);
        
        card.innerHTML = `
            <div class="pelicula-poster">
                <img src="${pelicula.imagen}" alt="${pelicula.titulo}">
                <span class="pelicula-puntuacion" style="background-color: ${colorPuntuacion}">${pelicula.puntuacion}</span>
            </div>
            <div class="pelicula-info">
                <h4>${pelicula.titulo} <span class="pelicula-año">(${pelicula.año})</span></h4>
                <p><strong>Género:</strong> ${pelicula.genero}</p>
                <p><strong>Subgénero:</strong> ${pelicula.subgenero}</p>
                <p><strong>Director:</strong> ${pelicula.director}</p>
                <p><strong>Duración:</strong> ${pelicula.duracion} min</p>
                <p><strong>Clasificación:</strong> <span class="clasificacion ${pelicula.clasificacion.replace('-', '')}">${pelicula.clasificacion}</span></p>
            </div>
        `;
        
        // Añadir evento al hacer clic en la tarjeta
        card.addEventListener('click', () => mostrarDetallesPelicula(pelicula));
        
        resultados.appendChild(card);
    });
}

// Función para convertir puntuación en color (de rojo a verde)
function puntuacionAColor(puntuacion) {
    // Convertir puntuación de 0-10 a 0-1
    const valor = (parseFloat(puntuacion) - 7) / 3; // Puntuaciones entre 7-10
    const hue = valor * 120; // 0 es rojo, 120 es verde
    return `hsl(${hue}, 70%, 50%)`;
}

// Función para mostrar los detalles de una película (alerta)
function mostrarDetallesPelicula(pelicula) {
    alert(`Has seleccionado: ${pelicula.titulo} (${pelicula.año})\nDirector: ${pelicula.director}\nPuntuación: ${pelicula.puntuacion}/10`);
}

// Función para actualizar estadísticas
function actualizarEstadisticas(peliculas) {
    const statsContainer = document.getElementById('stats-container');
    
    if (peliculas.length === 0) {
        statsContainer.style.display = 'none';
        return;
    }
    
    statsContainer.style.display = 'block';
    
    // Total de películas
    document.getElementById('total-peliculas').textContent = peliculas.length;
    
    // Duración promedio
    const duracionPromedio = peliculas.reduce((acc, pelicula) => acc + pelicula.duracion, 0) / peliculas.length;
    document.getElementById('duracion-promedio').textContent = Math.round(duracionPromedio);
    
    // Director más popular
    const directorConteo = {};
    peliculas.forEach(pelicula => {
        directorConteo[pelicula.director] = (directorConteo[pelicula.director] || 0) + 1;
    });
    
    let directorPopular = '-';
    let maxConteo = 0;
    
    for (const [director, conteo] of Object.entries(directorConteo)) {
        if (conteo > maxConteo) {
            directorPopular = director;
            maxConteo = conteo;
        }
    }
    
    document.getElementById('director-popular').textContent = directorPopular;
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarApp);