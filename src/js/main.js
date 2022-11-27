///////////////////////////////////////
////        Vista
class View {
    tareasContenedor = document.querySelector(".pendientes");
    tituloEl = document.querySelector(".titulo");
    opcionesEl = document.querySelectorAll(".opcion");

    renderTitulo(msg) {
        this.tituloEl.textContent = msg;
    }

    renderTareas(tareas) {
        this.tareasContenedor.innerHTML = "";

        tareas.forEach((t) => {
            // console.log(t);
            const html = `
                    <li class="pendiente" data-tarea=${t.id}>
                        <p class="pendiente__nombre">
                            ${t.texto}
                            <span class="pendiente__fecha"
                                >- ${this._formatFecha(t.fecha)}</span
                            >
                        </p>

                        <div class="acciones">
                            <button class="favorito" data-accion="importante">
                                <!-- <i class="fa-solid fa-star"></i> -->
                                <i class="fa-${
                                    t.status == "pendiente"
                                        ? "regular"
                                        : "solid"
                                } fa-star"></i>
                            </button>
                            <button class="eliminar" data-accion="eliminar">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </li>
                `;

            this.tareasContenedor.insertAdjacentHTML("beforeend", html);
        });
    }

    seleccionarOpcion(opcion) {
        this.opcionesEl.forEach((el) => {
            el.classList.remove("selected");
        });

        opcion.classList.add("selected");
    }

    vaciarTareas() {
        this.tareasContenedor.innerHTML = "";
    }

    _formatFecha(fechaAFormatear) {
        const meses = [
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre",
        ];
        const anioActual = new Date().getFullYear();
        const [_, m, d] = [...fechaAFormatear.split("-")];

        return `${d} de ${meses[m - 1]}`;
    }
}
const vista = new View();

///////////////////////////////////////
////        Modelo
let idUsuario = "";
let filtro = "todos";

const obtenerUsuario = async function () {
    const respuesta = await fetch("php/get_usuario.php");

    const datos = await respuesta.json();

    idUsuario = datos.id;
};

const obtenerTareas = async function (filtro = "todos", busqueda = false) {
    const data = new FormData();
    data.append("id", idUsuario);
    data.append("filtro", filtro);
    if (busqueda) data.append("busqueda", busqueda);

    const respuesta = await fetch("php/get_tareas.php", {
        method: "POST",
        body: data,
    });

    const tareas = await respuesta.json();

    return tareas;
};

const crearTarea = async function (data) {
    data.append("usuario", idUsuario);

    const crear = await fetch("php/crear_tarea.php", {
        method: "POST",
        body: data,
    });

    const respuesta = await crear.json();

    return respuesta;
};

const editarTarea = async function (tareaId, accion) {
    const data = new FormData();
    data.append("id", tareaId);
    data.append("accion", accion);

    const editar = await fetch("php/edit_importante.php", {
        method: "POST",
        body: data,
    });

    const respuesta = await editar.json();

    return respuesta;
};

const eliminarTarea = async function (tareaId) {
    const data = new FormData();
    data.append("id", tareaId);

    const eliminar = await fetch("php/eliminar_tarea.php", {
        method: "POST",
        body: data,
    });

    const respuesta = await eliminar.json();

    return respuesta;
};

///////////////////////////////////////
////        Controlador
const menuOpciones = document.querySelector(".opciones");

const barraBusqueda = document.querySelector(".barra-busqueda");

const overlayEl = document.querySelector(".overlay");
const modalEl = document.querySelector(".modal");
const btnCrear = document.querySelector(".btn-crear");
const btnCerrar = document.querySelector(".modal__btn--cerrar");
const formularioCrearEl = document.querySelector(".formulario-nuevo");

const tareasEl = document.querySelector(".pendientes");

window.addEventListener("load", async function (e) {
    await obtenerUsuario();

    const tareasInicio = await obtenerTareas();

    vista.renderTitulo("Todos");
    vista.renderTareas(tareasInicio);
});

// Menu de opciones
menuOpciones.addEventListener("click", async function (e) {
    const opcion = e.target.closest(".opcion");

    if (!opcion) return;

    const opcionData = opcion.dataset.opcion;
    filtro = opcionData;

    vista.seleccionarOpcion(opcion);
    vista.renderTitulo(
        opcionData.slice(0, 1).toUpperCase() + opcionData.slice(1)
    );

    if (opcionData == "busqueda") {
        vista.vaciarTareas();
        barraBusqueda.focus();

        const tareas = await obtenerTareas(opcionData, barraBusqueda.value);
        vista.renderTareas(tareas);

        return 0;
    }

    const tareas = await obtenerTareas(opcionData);
    vista.renderTareas(tareas);
});

// Barra de busqueda
barraBusqueda.addEventListener("input", async function (e) {
    if (barraBusqueda.value == "") return 0;

    vista.seleccionarOpcion(document.querySelector(".opcion--busqueda"));
    vista.renderTitulo("Busqueda");

    const tareas = await obtenerTareas("busqueda", barraBusqueda.value);
    vista.renderTareas(tareas);
});

// Modal
[btnCrear, overlayEl, btnCerrar].forEach((el) =>
    el.addEventListener("click", function (e) {
        overlayEl.classList.toggle("hidden");
        modalEl.classList.toggle("hidden");
    })
);

formularioCrearEl.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = new FormData(formularioCrearEl);

    await crearTarea(data);

    const tareas = await obtenerTareas();

    vista.seleccionarOpcion(document.querySelector(".opcion--todos"));
    vista.renderTitulo("Todos");
    vista.renderTareas(tareas);

    overlayEl.classList.toggle("hidden");
    modalEl.classList.toggle("hidden");
});

// Importante
tareasEl.addEventListener("click", async function (e) {
    const boton = e.target.closest("button");

    if (!boton) return 0;

    const tareaId = e.target.closest(".pendiente").dataset.tarea;
    const accion = boton.dataset.accion;

    if (accion == "importante") {
        const icon = e.target.closest("i");

        if (icon.classList.contains("fa-regular")) {
            await editarTarea(tareaId, "marcarImportante");

            const tareasInicio = await obtenerTareas("importantes");

            vista.seleccionarOpcion(
                document.querySelector(".opcion--importantes")
            );
            vista.renderTitulo("Importantes");
            vista.renderTareas(tareasInicio);
        } else {
            await editarTarea(tareaId, "quitarImportante");

            const tareasInicio = await obtenerTareas("todos");

            vista.seleccionarOpcion(document.querySelector(".opcion--todos"));
            vista.renderTitulo("Todos");
            vista.renderTareas(tareasInicio);
        }
    } else if (accion == "eliminar") {
        await eliminarTarea(tareaId);

        const tareasInicio = await obtenerTareas("todos");

        vista.seleccionarOpcion(document.querySelector(".opcion--todos"));
        vista.renderTitulo("Todos");
        vista.renderTareas(tareasInicio);
    }
});
