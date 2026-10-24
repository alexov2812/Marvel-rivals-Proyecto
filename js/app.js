let personajes = [];
let idEditando = null; // null = estamos agregando, un id = estamos editando

let personajesIniciales = [
    {
        id: "1",
        nombre: "Iron Man",
        rol: "Daño",
        origen: "Nueva York, EE.UU.",
        descripcion: "Genio y millonario que combate el crimen con su armadura de alta tecnología.",
        imagen: "ironman.jpg"
    },
    {
        id: "2",
        nombre: "Capitán América",
        rol: "Tanque",
        origen: "Brooklyn, EE.UU.",
        descripcion: "Súper soldado líder de los Vengadores que se protege con su escudo de vibranium.",
        imagen: "capitanamerica.jpg"
    },
    {
        id: "3",
        nombre: "Doctor Strange",
        rol: "Apoyo",
        origen: "Nueva York, EE.UU.",
        descripcion: "Hechicero Supremo que usa las artes místicas para proteger la realidad.",
        imagen: "doctorstrange.jpg"
    },
    {
        id: "4",
        nombre: "Hulk",
        rol: "Tanque",
        origen: "Dayton, Ohio, EE.UU.",
        descripcion: "El científico Bruce Banner se transforma en una furia imparable de fuerza enorme.",
        imagen: "hulk.jpg"
    },
    {
        id: "5",
        nombre: "Black Panther",
        rol: "Daño",
        origen: "Wakanda",
        descripcion: "Rey de Wakanda, guerrero ágil con un traje de vibranium y sentidos mejorados.",
        imagen: "blackpanter.jpg"
    },
    {
        id: "6",
        nombre: "Scarlet Witch",
        rol: "Daño",
        origen: "Monte Wundagore",
        descripcion: "Wanda Maximoff manipula la magia del caos para alterar la realidad.",
        imagen: "scarletwitch.jpg"
    }
];

// Quita mayúsculas y acentos para comparar textos
function limpiarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function guardarPersonajes() {
    localStorage.setItem("personajesMarvel", JSON.stringify(personajes));
}

function cargarPersonajes() {
    let guardado = localStorage.getItem("personajesMarvel");

    // Si no hay nada guardado, se usan los 6 personajes iniciales
    if (guardado === null) {
        personajes = personajesIniciales.slice();
        guardarPersonajes();
        return;
    }

    // Si el JSON está dañado, también se usan los iniciales
    try {
        let datos = JSON.parse(guardado);
        if (Array.isArray(datos)) {
            personajes = datos;
        } else {
            personajes = personajesIniciales.slice();
            guardarPersonajes();
        }
    } catch (error) {
        personajes = personajesIniciales.slice();
        guardarPersonajes();
    }
}

function renderizarGrid() {
    let grid = document.getElementById("grid");
    let contador = document.getElementById("contador");
    let texto = limpiarTexto(document.getElementById("busqueda").value);

    let filtrados = personajes.filter(function (personaje) {
        return limpiarTexto(personaje.nombre).includes(texto) ||
               limpiarTexto(personaje.rol).includes(texto);
    });

    grid.innerHTML = "";

    if (personajes.length === 0) {
        contador.textContent = "No hay personajes. ¡Agrega el primero!";
        return;
    }

    if (filtrados.length === 0) {
        contador.textContent = "No se encontraron resultados.";
        return;
    }

    contador.textContent = "Coincidencias: " + filtrados.length;

    filtrados.forEach(function (personaje) {
        let imagen = personaje.imagen || "https://placehold.co/400x300/16366a/ffffff?text=Sin+imagen";

        grid.innerHTML += `
            <div class="column is-12-mobile is-6-tablet is-4-desktop">
                <div class="card">
                    <div class="card-image">
                        <figure class="image">
                            <img src="${imagen}" alt="${personaje.nombre}"
                                 onerror="this.src='https://placehold.co/400x300/16366a/ffffff?text=Sin+imagen'">
                        </figure>
                    </div>
                    <div class="card-content has-text-centered">
                        <p class="title is-4 has-text-white">${personaje.nombre}</p>
                        <p class="subtitle is-6 has-text-grey-lighter">${personaje.rol}</p>
                        <div class="buttons is-centered">
                            <button class="button is-info" onclick="verMas('${personaje.id}')">Ver más</button>
                            <button class="button is-warning" onclick="editarPersonaje('${personaje.id}')">Editar</button>
                            <button class="button is-danger" onclick="eliminarPersonaje('${personaje.id}')">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// ---------- Ver más (modal) ----------
function verMas(id) {
    let posicion = personajes.findIndex(function (personaje) {
        return String(personaje.id) === id;
    });

    if (posicion === -1) {
        return;
    }

    document.getElementById("modal-nombre").textContent = personajes[posicion].nombre;
    document.getElementById("modal-origen").textContent = personajes[posicion].origen;
    document.getElementById("modal-descripcion").textContent = personajes[posicion].descripcion;
    document.getElementById("modal").classList.add("is-active");
}

function cerrarModal() {
    document.getElementById("modal").classList.remove("is-active");
}

// ---------- Agregar y editar ----------
function mostrarMensaje(texto, tipo) {
    let mensaje = document.getElementById("mensaje");
    mensaje.textContent = texto;
    mensaje.className = tipo + " mb-3";
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("rol").value = "";
    document.getElementById("origen").value = "";
    document.getElementById("imagen").value = "";
    document.getElementById("descripcion").value = "";
}

function guardarFormulario() {
    let nombre = document.getElementById("nombre").value.trim();
    let rol = document.getElementById("rol").value;
    let origen = document.getElementById("origen").value.trim();
    let imagen = document.getElementById("imagen").value.trim();
    let descripcion = document.getElementById("descripcion").value.trim();

    if (nombre === "" || rol === "" || origen === "" || descripcion === "") {
        mostrarMensaje("Nombre, rol, origen y descripción son obligatorios.", "has-text-danger");
        return;
    }

    // Evita duplicados por nombre (ignora al personaje que se está editando)
    let posicionDuplicado = personajes.findIndex(function (personaje) {
        return limpiarTexto(personaje.nombre) === limpiarTexto(nombre) &&
               String(personaje.id) !== idEditando;
    });

    if (posicionDuplicado !== -1) {
        mostrarMensaje("Ya existe un personaje con ese nombre.", "has-text-danger");
        return;
    }

    if (idEditando === null) {
        // Agregar
        personajes.push({
            id: String(Date.now()),
            nombre: nombre,
            rol: rol,
            origen: origen,
            imagen: imagen,
            descripcion: descripcion
        });
        mostrarMensaje("Personaje agregado.", "has-text-success");
    } else {
        // Editar
        let posicion = personajes.findIndex(function (personaje) {
            return String(personaje.id) === idEditando;
        });

        personajes[posicion] = {
            id: idEditando,
            nombre: nombre,
            rol: rol,
            origen: origen,
            imagen: imagen,
            descripcion: descripcion
        };
        mostrarMensaje("Personaje actualizado.", "has-text-success");
        terminarEdicion();
    }

    guardarPersonajes();
    renderizarGrid();
    limpiarFormulario();
}

function editarPersonaje(id) {
    let posicion = personajes.findIndex(function (personaje) {
        return String(personaje.id) === id;
    });

    if (posicion === -1) {
        return;
    }

    let personaje = personajes[posicion];

    document.getElementById("nombre").value = personaje.nombre;
    document.getElementById("rol").value = personaje.rol;
    document.getElementById("origen").value = personaje.origen;
    document.getElementById("imagen").value = personaje.imagen;
    document.getElementById("descripcion").value = personaje.descripcion;

    idEditando = id;
    document.getElementById("titulo-formulario").textContent = "EDITAR PERSONAJE";
    document.getElementById("btn-guardar").textContent = "Guardar cambios";
    document.getElementById("btn-cancelar").classList.remove("is-hidden");
    mostrarMensaje("", "");

    // Sube al formulario
    document.getElementById("agregar").scrollIntoView();
}

function terminarEdicion() {
    idEditando = null;
    document.getElementById("titulo-formulario").textContent = "AGREGAR PERSONAJE";
    document.getElementById("btn-guardar").textContent = "Agregar";
    document.getElementById("btn-cancelar").classList.add("is-hidden");
}

function cancelarEdicion() {
    terminarEdicion();
    limpiarFormulario();
    mostrarMensaje("", "");
}

// ---------- Eliminar ----------
function eliminarPersonaje(id) {
    if (!confirm("¿Seguro que quieres eliminar este personaje?")) {
        return;
    }

    personajes = personajes.filter(function (personaje) {
        return String(personaje.id) !== id;
    });

    // Si se estaba editando justo ese personaje, se cancela la edición
    if (idEditando === id) {
        cancelarEdicion();
    }

    guardarPersonajes();
    renderizarGrid();
}

document.getElementById("busqueda").addEventListener("input", renderizarGrid);

cargarPersonajes();
renderizarGrid();