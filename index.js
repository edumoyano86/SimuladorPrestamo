const intunanio = 0.35;
const intcincoanio = 0.50;
const intdiezanio = 0.60;

let monto = Number(prompt("Ingrese monto a solicitar:"));

let plazo = Number(prompt("Elija plazo 1 año, 5 año o 10 años:"));


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


function interesaPagar(monto, interes) {
  let interesCalculado = monto * interes;
  return interesCalculado;
}



function totalPagar(monto, interesCalculado) {
    let total = monto + interesCalculado;
    return total;
}

console.log(totalPagar(monto, interesaPagar(monto, obtenerInteres(plazo))));