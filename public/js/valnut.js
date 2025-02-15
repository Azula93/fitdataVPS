// IMAGENES GET
const getResultImg = "/public/assets/img (12).webp";
const imgMacro = "/public/assets/img (22).webp";
// // IMAGENES GET

// FUNCIONES PARA FILTRAR TEXTO PARA LA TABLA MIS DATOS
function filtrarYLimpiarTextoGet(texto) {
  // Primero, elimina todas las etiquetas HTML
  const textoSinHTML = texto.replace(/<\/?[^>]+(>|$)/g, "");

  // Expresión regular para extraer palabras permitidas y números
  const regex = /(\bkcal\b|\d+)(?:\.|\s+)?/gi;

  // Extraer solo los elementos que coinciden con la expresión regular
  const coincidencias = textoSinHTML.match(regex);

  if (coincidencias) {
    // Unir las coincidencias con un espacio
    return coincidencias.join(' ');
  }

  return '';
}

function filtrarYLimpiarTextoMacro(texto) {
   // Primero, elimina todas las etiquetas HTML
   const textoSinHTML = texto.replace(/<\/?[^>]+(>|$)/g, "");

   // Expresión regular para extraer palabras permitidas y números
   const regex = /(\bCarbohidratos\b|\bProteínas\b|\bGrasas\b|\bgr\b|\d+)/gi;
 
   // Extraer solo los elementos que coinciden con la expresión regular
   const coincidencias = textoSinHTML.match(regex);
 
   if (coincidencias) {
     // Unir las coincidencias con un espacio
     return coincidencias.join(' ');
   }
 
   return '';
}
// FUNCIONES PARA FILTRAR TEXTO PARA LA TABLA MIS DATOS


function limitarNumero(input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
    document.getElementById('errorMensajeTalla').textContent = 'Máximo 3 dígitos permitidos.';
    document.getElementById('errorMensajePeso').textContent = 'Máximo 3 dígitos permitidos.';
    document.getElementById('errorMensajeEdad').textContent = 'Máximo 2 dígitos permitidos.';

  } else {

    document.getElementById('errorMensajeTalla').textContent = '';
    document.getElementById('errorMensajePeso').textContent = '';
    document.getElementById('errorMensajeEdad').textContent = '';

  }
}


function obtenerSeleccion(name) {
  const opciones = document.getElementsByName(name);
  for (const opcion of opciones) {
    if (opcion.checked) {
      console.log(opcion.value);
      return opcion.value;
    }
  }
  return ""; // Por defecto, devuelve una cadena vacía si no se selecciona ninguna opción
}

function GeneroSeleccionado() {
  return obtenerSeleccion("genero");
}

function factorActividad() {
  return obtenerSeleccion("factorActividad");
}

function EleccionDeporte() {
  return obtenerSeleccion("Deportista");
}

// calcula GET
document.getElementById('get-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  // Obtener los datos seleccionados
  const factorActividad = obtenerSeleccion("factorActividad");
  const Generoseleccionado = obtenerSeleccion("genero");

  let resultadoGet = "";
  let errorGet = '';
  let alertGet = '';

  const talla = parseInt(document.getElementById("talla").value);
  const peso = parseInt(document.getElementById("peso").value);
  const edad = parseInt(document.getElementById("edad").value);

  // FORMULAS
  const formulaHombresSedentario = (66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 1.2;
  const formulaHombresLeve = (66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 1.55;
  const formulaHombresModerada = (66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 1.8;
  const formulaHombresIntensa = (66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 2.1;

  const formulaMujeresSedentaria = (655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.2;
  const formulaMujeresLeve = (655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.56;
  const formulaMujeresModerada = (655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.64;
  const formulaMujeresIntensa = (655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.82;

  switch (true) {
    // Casos mujeres
    case Generoseleccionado === 'mujer' && factorActividad === "Menos de 3 horas semanales":
      resultadoGet = `Tu gasto energético total es de <b> ${Math.round(formulaMujeresSedentaria)} </b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;
    case Generoseleccionado === 'mujer' && factorActividad === "3 Horas semanales":
      resultadoGet = `Tu gasto energético total es de  <b> ${Math.round(formulaMujeresLeve)} </b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;
    case Generoseleccionado === 'mujer' && factorActividad === "6 Horas semanales":
      resultadoGet = `Tu gasto energético total es de <b> ${Math.round(formulaMujeresModerada)}</b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;
    case Generoseleccionado === 'mujer' && factorActividad === "4-5 horas Diarias":
      resultadoGet = `Tu gasto energético total es de <b> ${Math.round(formulaMujeresIntensa)}</b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;

    // Casos hombres
    case Generoseleccionado === 'hombre' && factorActividad === "Menos de 3 horas semanales":
      resultadoGet = `Tu gasto energético total es de <b> ${Math.round(formulaHombresSedentario)}</b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;
    case Generoseleccionado === 'hombre' && factorActividad === "3 Horas semanales":
      resultadoGet = `Tu gasto energético total es de <b> ${Math.round(formulaHombresLeve)}</b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;
    case Generoseleccionado === 'hombre' && factorActividad === "6 Horas semanales":
      resultadoGet = `Tu gasto energético total es de <b> ${Math.round(formulaHombresModerada)}</b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;
    case Generoseleccionado === 'hombre' && factorActividad === "4-5 horas Diarias":
      resultadoGet = `Tu gasto energético total es de <b> ${Math.round(formulaHombresIntensa)}</b> kcal <img class="rounded mx-auto d-block img-fluid w-50" src="${getResultImg}" alt="ImagenOK">`;
      break;

default:
      alertGet = `<p class="textoGetResult">⚠️Ingresa todos los datos de manera correcta⚠️</p>`;
       // Mostrar el resultado usando SweetAlert
    Swal.fire({
      title: 'Oopss!',
      html: alertGet,
      icon: 'error',
      confirmButtonText: 'Aceptar'
  });
      break;

  }
  

document.getElementById('resultGet').innerHTML = resultadoGet;
  document.getElementById("errorGet").innerHTML = errorGet;
  const textoLimpioGet = filtrarYLimpiarTextoGet(resultadoGet);

  try {
    const response = await fetch('/guardar-datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gasto_energetico: textoLimpioGet })
    });

    if (response.ok) {
      console.log('Datos get enviados exitosamente');
      console.log(resultadoGet);

    } else {
      console.error('Error al enviar los datos get');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
});

// Calcula Macronutrientes
document.getElementById('macro-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Función para obtener los valores seleccionados
  const obtenerSeleccion = (nombre) => document.querySelector(`input[name="${nombre}"]:checked`)?.value || '';

  // Obtener valores de entrada
  const talla = parseInt(document.getElementById("talla").value);
  const peso = parseInt(document.getElementById("peso").value);
  const edad = parseInt(document.getElementById("edad").value);

  const factorActividad = obtenerSeleccion("factorActividad");
  const generoSeleccionado = obtenerSeleccion("genero");
  const deportistaSeleccionado = obtenerSeleccion("Deportista");
  
     // Validar que los campos necesarios estén completos
    if (!talla || !peso || !edad || !factorActividad || !generoSeleccionado || !deportistaSeleccionado) {
      // Usar SweetAlert para mostrar el mensaje
      Swal.fire({
        icon: 'error',
        title: '¡Campos incompletos!',
        text: 'Por favor, completa todos los datos antes de calcular los macronutrientes.',
        confirmButtonText: 'Aceptar'
      });
      return; // Detiene la ejecución si falta algún dato
    }



  // Función para calcular las fórmulas basadas en el género
  const calcularFormulas = (genero, actividad) => {
    const base = genero === 'hombre'
      ? 66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad
      : 655 + 9.56 * peso + 1.85 * talla - 4.68 * edad;

    const multiplicadores = {
      'Menos de 3 horas semanales': 1.2,
      '3 Horas semanales': 1.55,
      '6 Horas semanales': 1.8,
      '4-5 horas Diarias': 2.1,
    };

    const multiplicador = multiplicadores[factorActividad] || 1.2;
    const total = base * multiplicador;

    return {
      carbohidratos: total * 0.50 / 4,
      proteinas: total * 0.25 / 4,
      grasas: total * 0.25 / 9
    };
  };

  // Función para calcular las fórmulas para no deportistas
  const calcularFormulasND = (genero, actividad) => {
    const base = genero === 'hombre'
      ? 66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad
      : 655 + 9.56 * peso + 1.85 * talla - 4.68 * edad;

    const multiplicadores = {
      'Menos de 3 horas semanales': 1.2,
      '3 Horas semanales': 1.56,
      '6 Horas semanales': 1.64,
      '4-5 horas Diarias': 1.82,
    };

    const multiplicador = multiplicadores[factorActividad] || 1.2;
    const total = base * multiplicador;

    return {
      carbohidratos: total * 0.60 / 4,
      proteinas: total * 0.25 / 4,
      grasas: total * 0.15 / 9
    };
  };

  // Calcular los valores basados en las selecciones del usuario
  const resultados = deportistaSeleccionado === 'Deportista'
    ? calcularFormulas(generoSeleccionado, factorActividad)
    : calcularFormulasND(generoSeleccionado, factorActividad);

  // Crear mensaje de resultados
  const { carbohidratos, proteinas, grasas } = resultados;
  const macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(carbohidratos)} gr</b>,<br>
    Tu requerimiento de Proteínas es <b>${Math.round(proteinas)} gr</b>,<br>
    Tu requerimiento de Grasas es <b>${Math.round(grasas)} gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;

  // Mostrar los resultados
  document.getElementById('resultMacro').innerHTML = macronutrientesGr;
  const textoLimpioMacro = filtrarYLimpiarTextoMacro(macronutrientesGr);
  document.getElementById("errorMacro").innerHTML = errorMacro;

  try {
        const response = await fetch('/guardar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ macro	: textoLimpioMacro })
        });
    
        if (response.ok) {
            console.log('Datos macro enviados exitosamente');
        } else {
            console.error('Error al enviar los datos macro');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }

});


// codigo antiguo.largo
//  document.getElementById('macro-form').addEventListener('submit', async function (e) {
  //   e.preventDefault();
  //   // Funcion para calcular los macronutientes en Gramos
  
  //   let errorMacro = '';
  //   let macronutrientesGr = '';
  
  
  //   const talla = parseInt(document.getElementById("talla").value);
  //   const peso = parseInt(document.getElementById("peso").value);
  //   const edad = parseInt(document.getElementById("edad").value);
  
  //   const factorActividad = obtenerSeleccion("factorActividad");
  //   const Generoseleccionado = obtenerSeleccion("genero");
  //   const Deporteseleccionado = obtenerSeleccion("Deportista");
  
  
  //   // FORMULA HOMBRES GET
  //   let formulaHombresSedentario = ((66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 1.2);
  //   let formulaHombresLeve = (66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 1.55;
  //   let formulaHombresModerada = (66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 1.8;
  //   let formulaHombresIntensa = ((66.5 + 13.75 * peso + 5.0 * talla - 6.78 * edad) * 2.1);
  
  //   // FORMULAS PORCENTAJES HOMBRES DEPORTISTAS
  //   let GrChosHombresSed = ((formulaHombresSedentario) * 0.50 / 4);
  //   let GrProtHombreSed = ((formulaHombresSedentario) * 0.25 / 4);
  //   let GrGrasasHombreSed = ((formulaHombresSedentario) * 0.25 / 9);
  
  //   let GrChosHombreLeve = ((formulaHombresLeve) * 0.50 / 4);
  //   let GrProtHombreLeve = ((formulaHombresLeve) * 0.25 / 4);
  //   let GrGrasasHombreLeve = ((formulaHombresLeve) * 0.25 / 9);
  
  
  //   let GrChosHombreMod = ((formulaHombresModerada) * 0.50 / 4);
  //   let GrProtHombreMod = ((formulaHombresModerada) * 0.25 / 4);
  //   let GrGrasasHombreMod = ((formulaHombresModerada) * 0.25 / 9);
  
  //   let GrChosHombreInt = ((formulaHombresIntensa) * 0.50 / 4);
  //   let GrProtHombreInt = ((formulaHombresIntensa) * 0.25 / 4);
  //   let GrGrasasHombreInt = ((formulaHombresIntensa) * 0.25 / 9);
  
  //   // FORMULAS PORCENTAJES HOMBRES NODEPORTISTAS
  //   let GrChosHombresSedND = ((formulaHombresSedentario) * 0.60 / 4);
  //   let GrProtHombreSedND = ((formulaHombresSedentario) * 0.25 / 4);
  //   let GrGrasasHombreSedND = ((formulaHombresSedentario) * 0.15 / 9);
  
  //   let GrChosHombreLeveND = ((formulaHombresLeve) * 0.60 / 4);
  //   let GrProtHombreLeveND = ((formulaHombresLeve) * 0.25 / 4);
  //   let GrGrasasHombreLeveND = ((formulaHombresLeve) * 0.15 / 9);
  
  //   let GrChosHombreModND = ((formulaHombresModerada) * 0.60 / 4);
  //   let GrProtHombreModND = ((formulaHombresModerada) * 0.25 / 4);
  //   let GrGrasasHombreModND = ((formulaHombresModerada) * 0.15 / 9);
  
  //   let GrChosHombreIntND = ((formulaHombresIntensa) * 0.60 / 4);
  //   let GrProtHombreIntND = ((formulaHombresIntensa) * 0.25 / 4);
  //   let GrGrasasHombreIntND = ((formulaHombresIntensa) * 0.15 / 9);
  
  
  //   // FORMULA MUJERES GET
  //   let formulaMujeresSedentaria = ((655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.2);
  //   let formulaMujeresLeve = ((655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.56);
  //   let formulaMujeresModerada = ((655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.64);
  //   let formulaMujeresIntensa = ((655 + 9.56 * peso + 1.85 * talla - 4.68 * edad) * 1.82);
  
  
  //   // FORMULAS PORCENTAJES MUJERES DEPORTISTAS
  //   let GrChosMujerSed = ((formulaMujeresSedentaria) * 0.50 / 4);
  //   let GrProtMujerSed = ((formulaMujeresSedentaria) * 0.25 / 4);
  //   let GrGrasasMujerSed = ((formulaMujeresSedentaria) * 0.25 / 9);
  
  //   let GrChosMujerLeve = ((formulaMujeresLeve) * 0.50 / 4);
  //   let GrProtMujerLeve = ((formulaMujeresLeve) * 0.25 / 4);
  //   let GrGrasasMujerLeve = ((formulaMujeresLeve) * 0.25 / 9);
  
  //   let GrChosMujerMod = ((formulaMujeresModerada) * 0.50 / 4);
  //   let GrProtMujerMod = ((formulaMujeresModerada) * 0.25 / 4);
  //   let GrGrasasMujerMod = ((formulaMujeresModerada) * 0.25 / 9);
  
  //   let GrChosMujerInt = ((formulaMujeresIntensa) * 0.50 / 4);
  //   let GrProtMujerInt = ((formulaMujeresIntensa) * 0.25 / 4);
  //   let GrGrasasMujerInt = ((formulaMujeresIntensa) * 0.25 / 9);
  
  //   // FORMULAS PORCENTAJES MUJERES NO DEPORTISTAS
  //   let GrChosMujerSedND = ((formulaMujeresSedentaria) * 0.60 / 4);
  //   let GrProtMujerSedND = ((formulaMujeresSedentaria) * 0.25 / 4);
  //   let GrGrasasMujerSedND = ((formulaMujeresSedentaria) * 0.15 / 9);
  
  //   let GrChosMujerLeveND = ((formulaMujeresLeve) * 0.60 / 4);
  //   let GrProtMujerLeveND = ((formulaMujeresLeve) * 0.25 / 4);
  //   let GrGrasasMujerLeveND = ((formulaMujeresLeve) * 0.15 / 9);
  
  //   let GrChosMujerModND = ((formulaMujeresModerada) * 0.60 / 4);
  //   let GrProtMujerModND = ((formulaMujeresModerada) * 0.25 / 4);
  //   let GrGrasasMujerModND = ((formulaMujeresModerada) * 0.15 / 9);
  
  //   let GrChosMujerIntND = ((formulaMujeresIntensa) * 0.60 / 4);
  //   let GrProtMujerIntND = ((formulaMujeresIntensa) * 0.25 / 4);
  //   let GrGrasasMujerIntND = ((formulaMujeresIntensa) * 0.15 / 9);
  
  //   switch (true) {
  
  //     // CASOS MUJERES DEPORTISTAS
  //     case Deporteseleccionado === 'Deportista' && factorActividad === 'Menos de 3 horas semanales' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerSed)} gr</b> ,<br>
  //         Tu requerimiento de Proteinas es <b>${Math.round(GrProtMujerSed)}gr</b>,<br>
  //         Tu requerimiento de Grasas es <b>${Math.round(GrGrasasMujerSed)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'Deportista' && factorActividad === '3 Horas semanales' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerLeve)}gr</b>,<br>
  //           Tu requerimiento de Proteinas es<b> ${Math.round(GrProtMujerLeve)}gr</b>,<br>
  //           Tu requerimiento de Grasas es <b>${Math.round(GrGrasasMujerLeve)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'Deportista' && factorActividad === '6 Horas semanales' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerMod)}gr</b>,<br>
  //           Tu requerimiento de Proteinas es <b>${Math.round(GrProtMujerMod)}gr</b>,<br>
  //           Tu requerimiento de Grasas es <b>${Math.round(GrGrasasMujerMod)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'Deportista' && factorActividad === '4-5 horas Diarias' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerInt)}gr</b>,<br>
  //             Tu requerimiento de Proteinas es <b>${Math.round(GrProtMujerInt)}gr</b>,<br>
  //             Tu requerimiento de Grasas <b>es ${Math.round(GrGrasasMujerInt)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     // CASOS MUJERES NO DEPORTISTAS
  //     case Deporteseleccionado === 'No deportista' && factorActividad === 'Menos de 3 horas semanales' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerSedND)}gr</b>,<br>
  //            Tu requerimiento de Proteinas es <b>${Math.round(GrProtMujerSedND)}gr</b>,<br>
  //            Tu requerimiento de Grasas es <b>${Math.round(GrGrasasMujerSedND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'No deportista' && factorActividad === '3 Horas semanales' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerLeveND)}gr</b>,<br>
  //            Tu requerimiento de Proteinas es <b>${Math.round(GrProtMujerLeveND)}gr</b>,<br>
  //            Tu requerimiento de Grasas es <b>${Math.round(GrGrasasMujerLeveND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'No deportista' && factorActividad === '6 Horas semanales' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerModND)}gr</b>,<br>
  //             Tu requerimiento de Proteinas es <b>${Math.round(GrProtMujerModND)}gr</b>,<br>
  //             Tu requerimiento de Grasas es <b>${Math.round(GrGrasasMujerModND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'No deportista' && factorActividad === '4-5 horas Diarias' && Generoseleccionado === 'mujer':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosMujerIntND)}gr</b>,<br>
  //          Tu requerimiento de Proteinas es <b>${Math.round(GrProtMujerIntND)}gr</b>,<br>
  //          Tu requerimiento de Grasas es <b>${Math.round(GrGrasasMujerIntND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     // CASOS HOMBRES DEPORTISTAS
  //     case Deporteseleccionado === 'Deportista' && factorActividad === 'Menos de 3 horas semanales' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombresSed)}gr</b>,<br>
  //          Tu requerimiento de Proteinas es <b>${Math.round(GrProtHombreSed)}gr</b>,<br>
  //          Tu requerimiento de Grasas es <b>${Math.round(GrGrasasHombreSed)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'Deportista' && factorActividad === '3 Horas semanales' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombreLeve)}gr</b>,<br>
  //           Tu requerimiento de Proteinas es<b> ${Math.round(GrProtHombreLeve)}gr</b>,<br>
  //           Tu requerimiento de Grasas es<b> ${Math.round(GrGrasasHombreLeve)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'Deportista' && factorActividad === '6 Horas semanales' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombreMod)}gr</b>,<br>
  //             Tu requerimiento de Proteinas es <b>${Math.round(GrProtHombreMod)}gr</b>,<br>
  //             Tu requerimiento de Grasas es <b>${Math.round(GrGrasasHombreMod)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'Deportista' && factorActividad === '4-5 horas Diarias' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombreInt)}gr</b>,<br>
  //            Tu requerimiento de Proteinas es <b>${Math.round(GrProtHombreInt)}gr</b>,<br>
  //            Tu requerimiento de Grasas es <b>${Math.round(GrGrasasHombreInt)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     //  CASOS HOMBRES NO DEPORTISTAS
  //     case Deporteseleccionado === 'No deportista' && factorActividad === 'Menos de 3 horas semanales' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombresSedND)}gr</b>,<br>
  //             Tu requerimiento de Proteinas es <b>${Math.round(GrProtHombreSedND)}gr</b>,<br>
  //             Tu requerimiento de Grasas es <b>${Math.round(GrGrasasHombreSedND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'No deportista' && factorActividad === '3 Horas semanales' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombreLeveND)}gr</b>,<br>
  //               Tu requerimiento de Proteinas es <b>${Math.round(GrProtHombreLeveND)}gr</b>,<br>
  //               Tu requerimiento de Grasas es <b>${Math.round(GrGrasasHombreLeveND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'No deportista' && factorActividad == '6 Horas semanales' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombreModND)}gr</b>,<br>
  //             Tu requerimiento de Proteinas es <b>${Math.round(GrProtHombreModND)}gr</b>,<br>
  //             Tu requerimiento de Grasas es <b>${Math.round(GrGrasasHombreModND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     case Deporteseleccionado === 'No deportista' && factorActividad === '4-5 horas Diarias' && Generoseleccionado === 'hombre':
  //       macronutrientesGr = `Tu requerimiento de Carbohidratos es <b>${Math.round(GrChosHombreIntND)}gr</b>,<br>
  //             Tu requerimiento de Proteinas es <b>${Math.round(GrProtHombreIntND)}gr</b>,<br>
  //             Tu requerimiento de Grasas es <b>${Math.round(GrGrasasHombreIntND)}gr</b> <img class="rounded mx-auto d-block img-fluid w-50" src="${imgMacro}" alt="ImagenOK">`;
  //       break;
  
  //     default:
  //       macronutrientesGr = `<p class="textoGetResult text-danger"> Puedes realizar el cálculo cuando ingreses todos los datos solicitados 
  //           en la sección del GET ☝️</p>`
  //   }
  //   document.getElementById('resultMacro').innerHTML = macronutrientesGr;
  //   const textoLimpio = eliminarEtiquetasHTML(macronutrientesGr);
  //   document.getElementById("errorMacro").innerHTML = errorMacro;
  //   // document.getElementById('generate-pdf').style.display = 'block';
  
  
  //   try {
  //     const response = await fetch('/guardar-datos', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ macro	: textoLimpio })
  //     });
  
  //     if (response.ok) {
  //         console.log('Datos macro enviados exitosamente');
  //     } else {
  //         console.error('Error al enviar los datos macro');
  //     }
  // } catch (error) {
  //     console.error('Error en la solicitud:', error);
  // }
  // });
