const prestamos = [];

 // Declaro las variables de interes segun el plazo 
const intunanio = 0.35;
const intcincoanio = 0.50;
const intdiezanio = 0.60;

// Lectura de los datos desde html

const inputMonto = document.getElementById("monto");
const selectPlazo = document.getElementById("plazo");
const botonCalcular = document.getElementById("calcular");
const resultado = document.getElementById("resultado");

botonCalcular.addEventListener("click", () => {
  // Obtengo los valores ingresados por el usuario
  const monto = Number(inputMonto.value);
  const plazo = Number(selectPlazo.value);
   
  // Llamo a las funciones 
  const interes = obtenerInteres(plazo);
  const interesCalculado = interesaPagar(monto, interes);
  const total = totalPagar(monto, interesCalculado);
  const cuota = cuotaMensual(total, plazo);

  // Guardo los datos en un objeto
  const prestamo = {
    monto: monto,
    plazo: plazo,
    intereses: interesCalculado,
    total: total,
    cuota: cuota,
  };

  prestamos.push(prestamo);
 // Muestro el resultado 
  resultado.innerHTML = `
    <p>Monto solicitado: $${monto}</p>
    <p>Plazo: ${plazo} años</p>
    <p>Intereses: $${interesCalculado}</p>
    <p>Total a pagar: $${total}</p>
    <p>Cuota mensual: $${cuota.toFixed(2)}</p>
  `;
});



// Todas las funciones que ya tenia para el calculo de los datos
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



