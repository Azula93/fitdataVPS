// IMAGEMES IMC
const imclow = '/public/assets/img (18).webp';
const imcOK = '/public/assets/img (14).webp';
const imcBad = '/public/assets/img (16).webp';
const imcError = '/public/assets/img (19).webp';
// // IMAGENES IMC


// // IMAGENES ICC
const imagenMujerOk = '/public/assets/img (14).webp';
const imagenMujerbad = '/public/assets/img (16).webp';
const imagenHombreOk = '/public/assets/img (15).webp';
const imagenHombreBad = '/public/assets/img (17).webp';
const iccimgError = '/public/assets/img (19).webp';
// // IMAGENES ICC

// *********************ALERTA- RELACION IMC-ICC******************************************************************
// Variables para almacenar los valores de los elementos
let formulaImc = null;
let formulaIcc = null;
let Generoseleccionado = null;

// Función para obtener valores de los elementos por sus IDs
function obtenerValores() {
  // Obtener los valores de los inputs por sus IDs
  const peso = parseFloat(document.getElementById('peso').value);
  const talla = parseFloat(document.getElementById('talla').value);
  const cintura = parseFloat(document.getElementById('cintura').value);
  const cadera = parseFloat(document.getElementById('cadera').value);

  // Calcular el IMC
  formulaImc = (peso / (talla * talla)).toFixed(2);

  // Calcular el ICC
  formulaIcc = (cintura / cadera).toFixed(2);

  // Obtener el género seleccionado
  const opciones = document.getElementsByName("genero");
  for (const opcion of opciones) {
    if (opcion.checked) {
      Generoseleccionado = opcion.value;
      break;
    }
  }

  // Mostrar los resultados en la consola para verificar
  console.log(`IMC: ${formulaImc}, ICC: ${formulaIcc}, Género: ${Generoseleccionado}`);
  
  // Verificar la condición y mostrar la alerta si corresponde
  verificarCondicionYMostrarAlerta();
}

// Función para verificar la condición y mostrar la alerta
function verificarCondicionYMostrarAlerta() {

  
    if (formulaImc !== null && formulaIcc !== null && Generoseleccionado !== null) {
      // Condición para mujeres: ICC > 0.85
      if (Generoseleccionado === "mujer" && formulaIcc > 0.85) {
          Swal.fire({
              icon: 'warning',
              title: 'Atención',
              html: `Tu IMC e ICC son altos, esto <b>sugiere</b> no solo un exceso de peso en relación con tu altura, sino también una distribución de grasa en el área abdominal, <b>consulta</b> a un profesional para una evaluación y orientación. Tu IMC es ${formulaImc}.`,
          });
      }
      // Condición para hombres: ICC > 0.94
      else if (Generoseleccionado === "hombre" && formulaIcc > 0.94) {
          Swal.fire({
              icon: 'warning',
              title: 'Atención',
              html: `Tu IMC e ICC son altos, esto <b>sugiere</b> no solo un exceso de peso en relación con tu altura, sino también una distribución de grasa en el área abdominal, <b>consulta</b> a un profesional para una evaluación y orientación. Tu IMC es ${formulaImc}.`,
          });
      } else {
          console.log('ICC en rango normal');
      }
  }
}
// *********************ALERTA- RELACION IMC-ICC******************************************************************


// LIMITAR NUMERO
function limitarNumero(input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
    
    document.getElementById('errorMensajePeso').textContent = 'Máximo 3 dígitos permitidos.';
    document.getElementById('errorMensajeAltura').textContent = 'Máximo 3 dígitos permitidos.';
    document.getElementById('errorMensajePcintura').textContent = 'Máximo 3 dígitos permitidos.';
    document.getElementById('errorMensajePcadera').textContent = 'Máximo 3 dígitos permitidos.';
  } else {
    document.getElementById('errorMensajePeso').textContent = '';
    document.getElementById('errorMensajeAltura').textContent = '';
    document.getElementById('errorMensajePcintura').textContent = '';
    document.getElementById('errorMensajePcadera').textContent = '';

  }
}
// FIN LIMITAR NUMERO

// FUNCIONES PARA FILTRAR TEXTO PARA LA TABLA MIS DATOS
function filtrarYLimpiarTextoImc(texto) {
  // Primero, elimina todas las etiquetas HTML
  const textoSinHTML = texto.replace(/<\/?[^>]+(>|$)/g, "");

  // Expresión regular para extraer palabras permitidas y números
  const regex = /(\bBAJO PESO\b|\bPESO NORMAL\b|\bSOBREPESO\b|\bOBESIDAD GRADO I\b|\bOBESIDAD GRADO II\b|\bOBESIDAD GRADO III\b|\d+)(?:\.|\s+)?/gi;

  

  // Extraer solo los elementos que coinciden con la expresión regular
  const coincidencias = textoSinHTML.match(regex);

  if (coincidencias) {
    // Unir las coincidencias con un espacio
    return coincidencias.join(' ');
  }

  return '';
}

function filtrarYLimpiarTextoIcc(texto) {
  // Primero, elimina todas las etiquetas HTML
  const textoSinHTML = texto.replace(/<\/?[^>]+(>|$)/g, "");

  // Expresión regular para extraer palabras permitidas y números
  const regex = /(\bSIN RIESGO CARDIOVASCULAR\b|\bCON RIESGO CARDIOVASCULAR\b|\d+)(?:\.|\s+)?/gi;


  // Extraer solo los elementos que coinciden con la expresión regular
  const coincidencias = textoSinHTML.match(regex);

  if (coincidencias) {
    // Unir las coincidencias con un espacio
    return coincidencias.join(' ');
  }

  return '';
}
// FUNCIONES PARA FILTRAR TEXTO PARA LA TABLA MIS DATOS

// calcula IMC
document.getElementById('imc-form').addEventListener('submit', async function (e) {
  e.preventDefault();
obtenerValores();
  const peso = parseFloat(document.getElementById('peso').value);
  const talla = parseFloat(document.getElementById('talla').value);
  const formulaImc = (peso / (talla * talla)).toFixed(2);

  let resultImc = '';
  let errorImc = '';

  switch (true) {

    case formulaImc < 18.5:
      resultImc = `Tu IMC es <b> ${formulaImc} </b> Esto se clasifica como:<p class="pb-4 fs-4 text-center text-warning"> <b>BAJO PESO</b></p> <img class="img-fluid w-50 text-center" src="${imclow}" alt="imclow">`;
      break;

    case formulaImc >= 18.5 && formulaImc <= 24.9:
      resultImc = `Tu IMC es <b> ${formulaImc} </b> Esto se clasifica como: <p class="pb-4 fs-4 text-center text-success"> <b>PESO NORMAL</b> </p> <img class="img-fluid w-50 text-center" src="${imcOK}" alt="ImagenOK">`;
      break;

    case formulaImc >= 25 && formulaImc <= 29.9:
      resultImc = `Tu IMC es <b> ${formulaImc} </b> Esto se clasifica como: <p class="pb-4 fs-4 text-center text-warning"><b>SOBREPESO</b></p> <img class="img-fluid w-50 text-center" src="${imcBad}" alt="imcBad">`;
      break;

    case formulaImc >= 30 && formulaImc <= 34.9:
      resultImc = `Tu IMC es <b> ${formulaImc} </b> Esto se clasifica como:<p class="pb-4 fs-4 text-center text-danger"> <b>OBESIDAD GRADO I</b> </p><img class="img-fluid w-50 text-center" src="${imcBad}" alt="imcBad">`;
      break;

    case formulaImc >= 35 && formulaImc <= 39.9:
      resultImc = `Tu IMC es <b> ${formulaImc} </b> Esto se clasifica como: <p class="pb-4 fs-4 text-center text-danger"><b>OBESIDAD GRADO II</b></p> <img class="img-fluid w-50 text-center" src="${imcBad}" alt="imcBad">`;
      break;

    case formulaImc >= 40:
      resultImc = `Tu IMC es <b> ${formulaImc} </b> Esto se clasifica como: <p class="pb-4 fs-4 text-center text-danger"> <b> OBESIDAD GRADO III</b></p> <img class="img-fluid w-50 text-center" src="${imcBad}" alt="imcBad">`;
      break;

    default:
      resultImc = `<p class="pt-3 fs-4 text-center text-danger"><b>ERROR! <br> Ingresa los datos de manera correcta</br></p> <img class="img-fluid w-50 text-center" src="${imcError}" alt="imcError">`

  }
  document.getElementById('resultImc').innerHTML = resultImc;
  document.getElementById("errorImc").innerHTML = errorImc;
  const textoLimpioImc = filtrarYLimpiarTextoImc(resultImc);


if (formulaImc >= 25 && formulaImc <= 29.9) {
    Swal.fire({
      icon: 'info',
      title: 'Atención',
      text: 'Tu peso es mayor al esperado para tu talla, necesitas mas pruebas para determinar si el excedente es grasa 🧈 o músculo💪',
    });
  } else if (formulaImc >= 30 && formulaImc <= 40){
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
html: `Tu resultado indica obesidad. Sin embargo, el IMC <b>NO</b> muestra dónde se encuentra la grasa corporal. Se recomienda consultar a un profesional de la salud para confirmar este resultado.`,
    });
  }

  try {
    const response = await fetch('/guardar-datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imc: textoLimpioImc})
    });

    if (response.ok) {
        console.log('Datos IMC enviados exitosamente');
    } else {
        console.error('Error al enviar los datos IMC');
    }
} catch (error) {
    console.error('Error en la solicitud:', error);
}
});


// calcula ICC
document.getElementById('icc-form').addEventListener('submit',async function (e) {
  e.preventDefault();
obtenerValores();
  //  Toma los datos ingresados en el genero
  const opciones = document.getElementsByName("genero");
  let Generoseleccionado = "";

  for (const opcion of opciones) {
    if (opcion.checked) {
      Generoseleccionado = opcion.value;
      break; // Sale del bucle tan pronto como se encuentra una opción seleccionada
    }
  }

  let cintura = document.getElementById("cintura").value;
  let cadera = document.getElementById("cadera").value;
  const formulaIcc = (cintura / cadera).toFixed(2);

  let resultadoIcc = "";
  let errorIcc = '';

  switch (true) {

    // CASOS MUJERES 
    case formulaIcc < 0.85 && Generoseleccionado === "mujer":
      resultadoIcc = `<p class="fs-4 text-center">Tu ICC es <b> ${formulaIcc} </b> Esto se clasifica como:<p class="pb-4 fs-4 text-center text-success"><b> SIN RIESGO CARDIOVASCULAR</b></p> <img class="img-fluid w-50 text-center" src="${imagenMujerOk}" alt="ImagenOK"></p>`;
      break;

    case formulaIcc > 0.85 && Generoseleccionado === "mujer":
      resultadoIcc = `<p class="fs-4 text-center">Tu ICC es <b> ${formulaIcc} </b> Esto se clasifica como: <p class="pb-4 fs-4 text-center text-danger"><b> CON RIESGO CARDIOVASCULAR</b></p> <img class="img-fluid w-50 text-center" src="${imagenMujerbad}" alt="Imagenbad"></p>`;
      break;

    // CASOS HOMBRES
    case formulaIcc < 0.94 && Generoseleccionado === "hombre":
      resultadoIcc = `<p class="fs-4 text-center">Tu ICC es <b> ${formulaIcc} </b> Esto se clasifica como: <p class="pb-4 fs-4 text-center text-success"> <b>SIN RIESGO CARDIOVASCULAR </b></p> <img class="img-fluid w-50 text-center" src="${imagenHombreOk}" alt="ImagenOK"></p>`;
      break;

    case formulaIcc > 0.94 && Generoseleccionado === "hombre":
      resultadoIcc = `<p class="fs-4 text-center">Tu ICC es <b> ${formulaIcc} </b> Esto se clasifica como: <p class="pb-4 fs-4 text-center text-danger"><b> CON RIESGO CARDIOVASCULAR </b></p> <img class="img-fluid w-50 text-center" src="${imagenHombreBad}" alt="Imagenbad"></p>`;
      break;

    default:
      resultadoIcc = `<p class="fs-4 text-center text-danger fw-bold">ERROR! <br> Verifica que hayas ingresado los datos de manera correcta</b></p> <img class="img-fluid w-50 text-center" src="${iccimgError}" alt="ImagenError">`
  }
  document.getElementById('resultIcc').innerHTML = resultadoIcc;
  document.getElementById("errorIcc").innerHTML = errorIcc;
  const textoLimpioIcc = filtrarYLimpiarTextoIcc(resultadoIcc);

  
  try {
    const response = await fetch('/guardar-datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ icc: textoLimpioIcc })
    });

    if (response.ok) {
        console.log('Datos Icc enviados exitosamente');
    } else {
        console.error('Error al enviar los datos IMC');
    }
} catch (error) {
    console.error('Error en la solicitud:', error);
}
  
});


