// Defino los interes segun el plazo

const intunanio = 0.35;
const intcincoanio = 0.50;
const intdiezanio = 0.60;

// Obtengo el monto solicitado y el plazo elegido por el cliente

let monto = Number(prompt("Ingrese monto a solicitar:"));

let plazo = Number(prompt("Elija plazo 1 año, 5 año o 10 años:"));

// Funcion para conectar el plazo elegido con la tasa de interes correspondiente

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
      alert("Plazo inválido");
      interes = 0;
  }

  return interes;
}

// Funcion que calula el interes que pagara el cliente

function interesaPagar(monto, interes) {
  let interesCalculado = monto * interes;
  return interesCalculado;
}

// Con esta funcion calculo el monto toal que terminara pagando el cliente

function totalPagar(monto, interesCalculado) {
    let total = monto + interesCalculado;
    return total;
}



// Funcion para calcular cuanto pagara el cliente por mes

function cuotaMensual(total, plazo) {
  let meses = plazo * 12;
  let cuota = total / meses;
  return cuota;
}

// Array para almacenar todos los datos del prestamo solicitado

const datosPrestamo = [];

let interes = obtenerInteres(plazo);
let interesCalculado = interesaPagar(monto, interes);
let total = totalPagar(monto, interesCalculado);
let cuota = cuotaMensual(total, plazo);

datosPrestamo.push(monto, plazo, interesCalculado, total, cuota);

console.log(datosPrestamo)


