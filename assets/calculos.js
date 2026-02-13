
// FUNCIONES de calculos matematicos

function obtenerInteres(tipo, plazo, tiposPrestamo) {

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
  let cuota = total / plazo;
  return cuota;
}