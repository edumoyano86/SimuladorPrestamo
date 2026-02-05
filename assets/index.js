const prestamos = [];

 // Declaro las variables de interes segun el plazo 
const intunanio = 0.35;
const intcincoanio = 0.50;
const intdiezanio = 0.60;

// Accediendo al DOM

const inputNombre = document.getElementById("nombre");
const inputIngreso = document.getElementById("ingreso");
const inputMonto = document.getElementById("monto");
const selectPlazo = document.getElementById("plazo");
const botonCalcular = document.getElementById("calcular");
const resultado = document.getElementById("resultado");
const historial = document.getElementById("historial");
const botonBorrar = document.getElementById("borrar");

// CALCULO DEL PRESTAMO Y GUARDADO EN LOCALSTORAGE

botonCalcular.addEventListener("click", () => {

  // Obtengo los valores ingresados por el usuario
  const nombre = inputNombre.value;
  const ingreso = Number(inputIngreso.value);
  const monto = Number(inputMonto.value);
  const plazo = Number(selectPlazo.value);

  if (nombre === "" || ingreso <= 0 || monto <= 0) {
    resultado.innerHTML = "<p>Por favor complete correctamente todos los campos</p>";
    return;
  }

   
  // Llamo a las funciones 
  const interes = obtenerInteres(plazo);
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
    <p><strong>Plazo:</strong> ${plazo} años</p>
    <p><strong>Intereses:</strong> $${interesCalculado}</p>
    <p><strong>Total a pagar:</strong> $${total}</p>
    <p><strong>Cuota mensual:</strong> $${cuota.toFixed(2)}</p>
  `;

  // Guardado de los prestamos en el localStorage
  localStorage.setItem("prestamos", JSON.stringify(prestamos));

});



// Todas las funciones que ya tenia en la primer entrega para el calculo de los datos
function obtenerInteres(plazo) {
  let interes;

  switch (plazo) {
    case 1:
      interes = intunanio;
      break;
    case 5:
      interes = intcincoanio;
      break;
    case 10:
      interes = intdiezanio;
      break;
    default:
      resultado.innerHTML = "Plazo inválido";
      interes = 0;
  }

  return interes;
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

