const prestamos = [];

 // Obetencion de las tasas desde el archivo json 
let tiposPrestamo = [];



// Accediendo al DOM

const inputNombre = document.getElementById("nombre");
const inputIngreso = document.getElementById("ingreso");
const inputMonto = document.getElementById("monto");
const selectPlazo = document.getElementById("plazo");
const selectTipo = document.getElementById("tipo");
const botonCalcular = document.getElementById("calcular");
const resultado = document.getElementById("resultado");
const historial = document.getElementById("historial");
const botonBorrar = document.getElementById("borrar");

// Obetencion de los prestamos desde el archivo json 

fetch("./db/tasas.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    tiposPrestamo = datos;
    tiposPrestamo.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.tipo;
      option.textContent = item.tipo;
      selectTipo.appendChild(option);
    });

    cargarPlazos(selectTipo.value);
  })
  .catch(error => console.log("Error cargando JSON:", error));

selectTipo.addEventListener("change", () => {
  cargarPlazos(selectTipo.value);
});



// CALCULO DEL PRESTAMO Y GUARDADO EN LOCALSTORAGE

botonCalcular.addEventListener("click", () => {

  // Obtengo los valores ingresados por el usuario
  const nombre = inputNombre.value;
  const ingreso = Number(inputIngreso.value);
  const monto = Number(inputMonto.value);
  const plazo = Number(selectPlazo.value);
  const tipo = selectTipo.value;

  if (nombre === "" || ingreso <= 0 || monto <= 0) {
    resultado.innerHTML = "<p>Por favor complete correctamente todos los campos</p>";
    return;
  }

   
  // LLAMO A LAS FUNCIONES 
  const interes = obtenerInteres(tipo, plazo);
  // Validacion si existe la tasa y el tipo
  if (interes === null) {
    resultado.innerHTML = "No existe una tasa para ese tipo y plazo";
    return;
  }


  const interesCalculado = interesaPagar(monto, interes);
  const total = totalPagar(monto, interesCalculado);
  const cuota = cuotaMensual(total, plazo);

  // Guardo los datos en un objeto
  const prestamo = {
    nombre: nombre,
    ingreso: ingreso,
    monto: monto,
    plazo: plazo,
    intereses: interesCalculado,
    total: total,
    cuota: cuota,
  };

  prestamos.push(prestamo);
 // Muestro el resultado 
  resultado.innerHTML = `
    <p><strong>Cliente:</strong> ${nombre}</p>
    <p><strong>Ingreso anual:</strong> $${ingreso}</p>
    <p><strong>Monto solicitado:</strong> $${monto}</p>
    <p><strong>Plazo:</strong> ${plazo} meses</p>
    <p><strong>Intereses:</strong> $${interesCalculado}</p>
    <p><strong>Total a pagar:</strong> $${total}</p>
    <p><strong>Cuota mensual:</strong> $${cuota.toFixed(2)}</p>
  `;

  // Guardado de los prestamos en el localStorage
  localStorage.setItem("prestamos", JSON.stringify(prestamos));

});



// FUNCIONES

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


function obtenerInteres(tipo, plazo) {

  const tipoEncontrado = tiposPrestamo.find(
    (item) => item.tipo === tipo
  );

  if (!tipoEncontrado) {
    return null;
  }

  const plazoEncontrado = tipoEncontrado.plazos.find(
    (p) => p.meses === plazo
  );

  if (!plazoEncontrado) {
    return null;
  }

  return plazoEncontrado.tasa;
}




function interesaPagar(monto, interes) {
  let interesCalculado = monto * interes;
  return interesCalculado;
}

function totalPagar(monto, interesCalculado) {
    let total = monto + interesCalculado;
    return total;
}

function cuotaMensual(total, plazo) {
  let meses = plazo * 12;
  let cuota = total / meses;
  return cuota;
}

// Recuperacion de los prestamos guardados en el localStorage
const prestamosGuardados = localStorage.getItem("prestamos");

if (prestamosGuardados) {
  prestamos.push(...JSON.parse(prestamosGuardados));
}

// Funciones de grado superior para mostrar el historial de prestamos
function renderPrestamos() {
  if (prestamos.length === 0) {
    historial.innerHTML = "<p>No hay préstamos guardados</p>";
    return;
  }

  const html = prestamos.map((prestamo) => {
    return `
      <div class="prestamo">
        <h3>Monto: $${prestamo.monto}</h3>
        <p>Total: $${prestamo.total}</p>
        <p>Cuota: $${prestamo.cuota.toFixed(2)}</p>
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

}


renderPrestamos();

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
  localStorage.removeItem("prestamos");
  prestamos.length = 0;
  renderPrestamos();
});

