const Vo2Bad = "/public/assets/img (24).webp";
const Vo2Regular = "/public/assets/img (18).webp";
const Vo2Bueno = "/public/assets/img (14).webp";
const Vo2MuyBueno = "/public/assets/img (15).webp";
const Vo2Error = "/public/assets/img (19).webp";
const Vo2imgthink = "/public/assets/img (8).webp";

function limitarNumero(input, maxLength) {
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        
        document.getElementById('errorMensajePPM').textContent = 'Máximo 3 dígitos permitidos.';
        document.getElementById('errorMensajeH').textContent = 'Máximo 2 dígitos permitidos.';
    } else {
       
        document.getElementById('errorMensajePPM').textContent = '';
        document.getElementById('errorMensajeH').textContent = '';
    }
}

function eliminarEtiquetasHTML(texto) {
    return texto.replace(/<\/?[^>]+(>|$)/g, "");
  }
  

document.getElementById('vo2-form').addEventListener('submit',async function (e) {
    e.preventDefault();

    let BPM = document.getElementById("BPM").value;
    let altura = document.getElementById("H").value;

    let H = altura / 100;

    let PPM = BPM / 4;

    let Vo2Max = Math.trunc(PPM * 0.2 + PPM * H * 1.33 * 1.8 + 3.5);

    let Mets = Vo2Max / 3.5;

    document.getElementById("resultadoVo2").innerHTML = `${Vo2Max} ml/kg/min`;
    document.getElementById("numMets").innerHTML = `${Math.trunc(Mets)} `;

    let vo2Final = document.getElementById("resultadoVo2").innerHTML = `${Vo2Max} ml/kg/min`;
    let metsFinal = document.getElementById("numMets").innerHTML = `${Math.trunc(Mets)}`;

    let resultadoMets = '';
    let errorMets = '';


    switch (true) {

        case Math.trunc(Mets) <= 9:
            resultadoMets = `<p class="fs-4 text-center">Tu condicion fisica es:</p><p class="fs-2 text-danger fw-bold text-center"> MUY MALA</p><img class="w-25 mx-auto d-block" src="${Vo2Bad}" alt="ImagenBad">`;
            break;

        case Math.trunc(Mets) == 10:
            resultadoMets = `<p class="fs-4 text-center"> Tu condicion fisica es:</p><p class="fs-2 text-warning fw-bold text-center"> REGULAR </p><img class="w-25 mx-auto d-block" src="${Vo2Regular}" alt="ImagenBad"> `;
            break;

        case Math.trunc(Mets) == 11:
            resultadoMets = `<p class="fs-4 text-center"> Tu condicion fisica es:</p><p class="fs-2 text-success fw-bold text-center"> SALUDABLE</p><img class="w-25 mx-auto d-block" src="${Vo2Bueno}" alt="ImagenOK">`;
            break;

        case Math.trunc(Mets) == 12 || Math.trunc(Mets) == 13:
            resultadoMets = `<p class="fs-4 text-center"> Tu condicion fisica es:</p><p class="fs-2 text-success fw-bold text-center"> BUENA</p><img class="w-25 mx-auto d-block" src="${Vo2Bueno}" alt="ImagenOK">`;
            break;

        case Math.trunc(Mets) >= 14:
            resultadoMets = `<p class="fs-4 text-center"> Tu condicion fisica es:</p><br><p class="fs-2 text-success fw-bold text-center"> MUY BUENA </p> <img class="w-50 mx-auto d-block" src="${Vo2MuyBueno}" alt="ImagenOK">`;
            break;

        default:
            resultadoMets = ` <p class="fs-2 text-danger fw-bold text-center"> Error! </p>`;
    }
    document.getElementById("resultadoMets").innerHTML = resultadoMets;
    document.getElementById('resultVo2').innerHTML = resultadoMets;
    const textoLimpioVo2 = eliminarEtiquetasHTML(vo2Final);
    const textoLimpiomets = eliminarEtiquetasHTML(metsFinal);

    console.log(vo2Final , metsFinal)
    document.getElementById("errorVo2").innerHTML = errorMets;
    // document.getElementById('generate-pdf').style.display = 'block';

    try {
        const response = await fetch('/guardar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vo2: textoLimpioVo2, 
                mets: textoLimpiomets
                })
        });
    
        if (response.ok) {
            console.log('Datos vo2 enviados exitosamente');
        } else {
            console.error('Error al enviar los datos vo2');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});



// document.getElementById('expect-form').addEventListener('submit', async function (e) {

//     e.preventDefault();

//     // Toma los datos ingresados en la actividad fisica de la expectativa de vida
//     const opcinesActFisica = document.getElementsByName("expectvida");
//     let ActividadFisicaExpectVida = "";

//     for (const opcion of opcinesActFisica) {
//         if (opcion.checked) {
//             ActividadFisicaExpectVida = opcion.value;
//             break;
//         }
//     }
    
//     let BPM = document.getElementById("BPM").value;
//     let altura = document.getElementById("H").value;

//     let H = altura / 100;

//     let PPM = BPM / 4;

//     let Vo2Max = Math.trunc(PPM * 0.2 + PPM * H * 1.33 * 1.8 + 3.5);

//     let inactivo = Vo2Max / 0.5;
//     let activo = Vo2Max / 0.4;

//     let resultadoExpectVida = '';


//     switch (true) {
//         case ActividadFisicaExpectVida == 'menos 3 v-s':
//             resultadoExpectVida = `<p class="fs-2">Tu expectativa de vida es  <b class="expectYears">${inactivo} años.</b> <img class="w-50" src="${Vo2imgthink}" alt="Imagenthink">
//             <br>Recuerda que este dato es <b>SOLO UNA ESTIMACIóN.</b> 
//             Tu expectativa de vida puede variar en función de tus habitos de vida y condiciones externas.</p>`;
//             break;

//         case ActividadFisicaExpectVida == 'mas 3 v-s':
//             resultadoExpectVida = `<p class="fs-2">Tu expectativa de vida es <b class="expectYears">${activo} años.</b> <img class="w-50" src="${Vo2imgthink}" alt="Imagentjink">
//             <br>Recuerda que este dato es <b>SOLO UNA ESTIMACIóN.</b><br>  
//             Tu expectativa de vida puede variar en función de tus habitos de vida y condiciones externas.</p>`;
//             break;

//         default:
//             resultadoExpectVida = `<p class="text-danger fw-bold"> Selecciona cuantas veces por semana realizas ejercicio!</p> <img class="w-50" src="${Vo2Error}" alt="ImagenError">`;

//     }

//     document.getElementById('resultExpect').innerHTML = resultadoExpectVida;
//     document.getElementById("resultExpect").innerHTML = `${resultadoExpectVida} años`;
//     let expectFinal = document.querySelector(".expectYears").innerHTML = `${resultadoExpectVida}`;
//     const textoLimpioExpect = eliminarEtiquetasHTML(expectFinal);
//     console.log(textoLimpioExpect)
    
//     try {
//         const response = await fetch('/guardar-datos', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ expect_vida: textoLimpioExpect })
//         });
    
//         if (response.ok) {
//             console.log('Datos expect_vida enviados exitosamente');
//         } else {
//             console.error('Error al enviar los datos expect_vida');
//         }
//     } catch (error) {
//         console.error('Error en la solicitud:', error);
//     }
// });

document.getElementById('expect-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Toma los datos ingresados en la actividad fisica de la expectativa de vida
    const opcionesActFisica = document.getElementsByName("expectvida");
    let ActividadFisicaExpectVida = "";

    for (const opcion of opcionesActFisica) {
        if (opcion.checked) {
            ActividadFisicaExpectVida = opcion.value;
            break;
        }
    }
    
    let BPM = document.getElementById("BPM").value;
    let altura = document.getElementById("H").value;

    let H = altura / 100;
    let PPM = BPM / 4;
    let Vo2Max = Math.trunc(PPM * 0.2 + PPM * H * 1.33 * 1.8 + 3.5);

    let inactivo = Vo2Max / 0.5;
    let activo = Vo2Max / 0.4;

    // Mapeo de resultados según la opción seleccionada
    const resultados = {
        'menos 3 v-s': `<p class="fs-2">Tu expectativa de vida es <b class="expectYears">${inactivo} años.</b> <img class="w-50" src="${Vo2imgthink}" alt="Imagenthink">
            <br>Recuerda que este dato es <b>SOLO UNA ESTIMACIóN.</b> 
            Tu expectativa de vida puede variar en función de tus habitos de vida y condiciones externas.</p>`,
        'mas 3 v-s': `<p class="fs-2">Tu expectativa de vida es <b class="expectYears">${activo} años.</b> <img class="w-50" src="${Vo2imgthink}" alt="Imagentjink">
            <br>Recuerda que este dato es <b>SOLO UNA ESTIMACIóN.</b><br>  
            Tu expectativa de vida puede variar en función de tus habitos de vida y condiciones externas.</p>`,
        'default': `<p class="text-danger fw-bold"> Selecciona cuantas veces por semana realizas ejercicio!</p> <img class="w-50" src="${Vo2Error}" alt="ImagenError">`
    };

    // Obtener el resultado correspondiente
    let resultadoExpectVida = resultados[ActividadFisicaExpectVida] || resultados['default'];

    document.getElementById('resultExpect').innerHTML = resultadoExpectVida;

    // Extraer y limpiar el contenido
    let expectElement = document.querySelector(".expectYears");
    const textoLimpioExpect = expectElement ? eliminarEtiquetasHTML(expectElement.innerHTML) : '';

    console.log(textoLimpioExpect);
    
    try {
        const response = await fetch('/guardar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expect_vida: textoLimpioExpect })
        });
    
        if (response.ok) {
            console.log('Datos expect_vida enviados exitosamente');
        } else {
            console.error('Error al enviar los datos expect_vida');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});
