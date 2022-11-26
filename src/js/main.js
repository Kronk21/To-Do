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
                            <button class="favorito">
                                <!-- <i class="fa-solid fa-star"></i> -->
                                <i class="fa-${
                                    t.status == "pendiente"
                                        ? "regular"
                                        : "solid"
                                } fa-star"></i>
                            </button>
                            <button class="editar">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="eliminar">
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

const obtenerUsuario = async function () {
    const respuesta = await fetch("php/get_usuario.php");

    const datos = await respuesta.json();

    idUsuario = datos.id;
};

const obtenerTareas = async function (filtro = "todos") {
    const data = new FormData();
    data.append("id", idUsuario);
    data.append("filtro", filtro);

    const respuesta = await fetch("php/get_tareas.php", {
        method: "POST",
        body: data,
    });

    const tareas = await respuesta.json();

    return tareas;
};

///////////////////////////////////////
////        Controlador
const menuOpciones = document.querySelector(".opciones");

window.addEventListener("load", async function (e) {
    await obtenerUsuario();

    const tareasInicio = await obtenerTareas();

    vista.renderTitulo("Todos");
    vista.renderTareas(tareasInicio);
});

menuOpciones.addEventListener("click", async function (e) {
    const opcion = e.target.closest(".opcion");

    if (!opcion) return;

    const opcionData = opcion.dataset.opcion;

    vista.seleccionarOpcion(opcion);
    vista.renderTitulo(
        opcionData.slice(0, 1).toUpperCase() + opcionData.slice(1)
    );

    const tareas = await obtenerTareas(opcionData);
    vista.renderTareas(tareas);
});
