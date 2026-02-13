const prestamos = [];
let indiceEdicion = null;

let tiposPrestamo = [];
// Accediendo al DOM

const inputNombre = document.getElementById("nombre");
const inputEdad = document.getElementById("edad");
const inputIngreso = document.getElementById("ingreso");
const inputMonto = document.getElementById("monto");
const selectPlazo = document.getElementById("plazo");
const selectTipo = document.getElementById("tipo");
const botonCalcular = document.getElementById("calcular");
const resultado = document.getElementById("resultado");
const historial = document.getElementById("historial");
const botonBorrar = document.getElementById("borrar");



// Obetencion de los tipos de prestamos desde el archivo json 

fetch("./db/tasas.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    setTimeout(() => {
      tiposPrestamo = datos;
      tiposPrestamo.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.tipo;
        option.textContent = item.tipo;
        selectTipo.appendChild(option);
      });

      cargarPlazos(selectTipo.value);
    }, 1000);
  })
  .catch(error => console.log("Error cargando JSON:", error));

selectTipo.addEventListener("change", () => {
  cargarPlazos(selectTipo.value, selectPlazo);
});

// Funcion para cargar plazos
function cargarPlazos(tipoSeleccionado) {
  const tipoEncontrado = tiposPrestamo.find(
    (item) => item.tipo === tipoSeleccionado
  );

  selectPlazo.innerHTML = "";

  if (!tipoEncontrado) return;

  tipoEncontrado.plazos.forEach((plazo) => {
    const option = document.createElement("option");
    option.value = plazo.meses;
    option.textContent = `${plazo.meses} meses`;
    selectPlazo.appendChild(option);
  });
}


// CALCULO DEL PRESTAMO Y GUARDADO EN LOCALSTORAGE

botonCalcular.addEventListener("click", () => {

  // Obtengo los valores ingresados por el usuario
  const nombre = inputNombre.value;
  const ingreso = Number(inputIngreso.value);
  const monto = Number(inputMonto.value);
  const plazo = Number(selectPlazo.value);
  const tipo = selectTipo.value;
  const edad = Number(inputEdad.value);

  if (edad < 18) {
    Swal.fire({
      icon: "error",
      title: "Edad no permitida",
      text: "Debe ser mayor de 18 años para solicitar un préstamo",
    });
    return;
  }

  if (edad > 70) {
    Swal.fire({
      icon: "error",
      title: "Edad no permitida",
      text: "No se otorgan préstamos a mayores de 70 años",
    });
    return;
  }

  if (nombre === "" || ingreso <= 0 || monto <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Datos incompletos',
      text: 'Por favor, complete todos los campos correctamente.',
    });
    return;
  }

  // LLAMO A LAS FUNCIONES 
  const interes = obtenerInteres(tipo, plazo, tiposPrestamo);
  const interesCalculado = interesaPagar(monto, interes);
  const total = totalPagar(monto, interesCalculado);
  const cuota = cuotaMensual(total, plazo);

  // Validacion si existe la tasa y el tipo
  if (interes === null) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No existe una tasa para ese tipo y plazo",
    });
    return;
  }
  
  // Limite del 30% del ingreso mensual para la cuota del prestamo
  const ingresoMensual = ingreso / 12;
  const maxCuota = ingresoMensual * 0.3;

  if (cuota > maxCuota) {
    Swal.fire({
      icon: "error",
      title: "Préstamo rechazado",
      html: `
        <p>La cuota supera el <strong>30% de su ingreso mensual</strong></p>
        <p><strong>Cuota:</strong> $${cuota.toFixed(2)}</p>
        <p><strong>Máximo permitido:</strong> $${maxCuota.toFixed(2)}</p>
      `,
    });
  return;
}

  // Guardo los datos en un objeto
  const prestamo = {
    nombre: nombre,
    edad: edad,
    ingreso: ingreso,
    monto: monto,
    plazo: plazo,
    tipo: tipo,
    intereses: interesCalculado,
    total: total,
    cuota: cuota,
    estado: "APROBADO",
  };

  if (indiceEdicion !== null) {
    prestamos[indiceEdicion] = prestamo;
    indiceEdicion = null;
  } else {
    prestamos.push(prestamo);
  }

 // Muestro el resultado 
  resultado.innerHTML = `
    <p><strong>Cliente:</strong> ${nombre}</p>
    <p><strong>Edad:</strong> ${edad}</p>
    <p><strong>Ingreso anual:</strong> $${ingreso}</p>
    <p><strong>Tipo de préstamo:</strong> ${tipo}</p>
    <p><strong>Plazo:</strong> ${plazo} meses</p>
    <p><strong>Intereses:</strong> $${interesCalculado}</p>
    <p><strong>Total a pagar:</strong> $${total}</p>
    <p><strong>Cuota mensual:</strong> $${cuota.toFixed(2)}</p>
    <p><strong>Estado:</strong> ✅ APROBADO</p>
  `;


  // Guardado de los prestamos en el localStorage
  localStorage.setItem("prestamos", JSON.stringify(prestamos));
  renderPrestamos();

});

// Recuperacion de los prestamos guardados en el localStorage
const prestamosGuardados = localStorage.getItem("prestamos");

if (prestamosGuardados) {
  prestamos.push(...JSON.parse(prestamosGuardados));
}

// Lo que me faltaba para poder editar los prestamos guardados
function editarPrestamo(index) {
  const prestamo = prestamos[index];

  inputNombre.value = prestamo.nombre;
  inputEdad.value = prestamo.edad;
  inputIngreso.value = prestamo.ingreso;
  inputMonto.value = prestamo.monto;
  selectTipo.value = prestamo.tipo;

  cargarPlazos(prestamo.tipo);

  setTimeout(() => {
    selectPlazo.value = prestamo.plazo;
  }, 0);

  indiceEdicion = index;
}


// Funciones de grado superior para mostrar el historial de prestamos
function renderPrestamos() {
  if (prestamos.length === 0) {
    historial.innerHTML = "<p>No hay préstamos guardados</p>";
    return;
  }

  const html = prestamos.map((prestamo, index) => {
    return `
      <div class="prestamo">
        <h3>${prestamo.nombre}</h3>
        <p>Edad: ${prestamo.edad}</p>
        <p>Tipo: ${prestamo.tipo}</p>
        <p>Monto: $${prestamo.monto}</p>
        <p>Cuota: $${prestamo.cuota.toFixed(2)}</p>
        <p>Estado: ${prestamo.estado}</p>

        <button class="btn-editar" data-index="${index}">
          Editar
        </button>
      </div>
    `;
  }).join("");


  historial.innerHTML = html;

  const totales = calcularTotales();

  historial.innerHTML = `
    <h3>Préstamos guardados</h3>
    ${html}

    <hr>

    <h3>Totales</h3>
    <p><strong>Total prestado:</strong> $${totales.totalPrestado}</p>
    <p><strong>Total a cobrar:</strong> $${totales.totalACobrar}</p>
  `;

  escucharBotonesEditar();

}


renderPrestamos();


function escucharBotonesEditar() {
  const botonesEditar = document.querySelectorAll(".btn-editar");

  botonesEditar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const index = Number(e.target.dataset.index);
      editarPrestamo(index);
    });
  });
}

function calcularTotales() {
  const totalPrestado = prestamos.reduce((acum, prestamo) => {
    return acum + prestamo.monto;
  }, 0);

  const totalACobrar = prestamos.reduce((acum, prestamo) => {
    return acum + prestamo.total;
  }, 0);

  return {
    totalPrestado,
    totalACobrar,
  };
}

// Para borrar el localStorage
botonBorrar.addEventListener("click", () => {
  Swal.fire({
    title: "¿Desea borrar el historial?",
    text: "Se eliminarán todos los préstamos guardados",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("prestamos");
      prestamos.length = 0;
      renderPrestamos();

      Swal.fire("Borrado", "Historial eliminado correctamente", "success");
    }
  });
});




