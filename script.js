let registroTablas = JSON.parse(localStorage.getItem('registroTablas')) || []
let cronometro = {
    minutos: 0,
    segundos: 0,
    milisegundos: 0
}
let nombreTabla = 'Tiempos del cronometro'
let registroTiempos = []
let intervalo = null

// Estructura registroTablas
/*
    [
        {
            nombreTabla: '',
            mejorTiempo: '',
            tiempos: registroTiempos
        }
    ]
*/

// Estructura de registroTiempos
/*
    [
        {
            puesto: 1,
            tiempo: cronometro
        },
        {
            puesto: 2,
            tiempo: cronometro
        }
    ]
*/

// Estructura cronometro
/*
    {
        minutos: 0,
        segundos: 0,
        milisegundos: 0
    }
*/

// ESTADOS DE LOS BOTONES
const estadoInicial = () => {
    cronometro = {
        minutos: 0,
        segundos: 0,
        milisegundos: 0
    }

    const mn = document.querySelector('.minutos')
    mn.textContent = '00'
    const sg = document.querySelector('.segundos')
    sg.textContent = '00'
    const ml = document.querySelector('.milisegundos')
    ml.textContent = '00'

    const datosTabla = document.querySelector('.datos-tabla')
    datosTabla.innerHTML = ''
    registroTiempos = []

    const seccionTabla = document.querySelector('.tiempos-del-cronometro')
    seccionTabla.style.display = 'none'
    const formularioGuardarTiempos = document.querySelector('.formulario-tabla')
    formularioGuardarTiempos.style.display = 'none'

    const botonIniciar = document.querySelector('.iniciar')
    const botonReiniciar = document.querySelector('.reiniciar')
    const botonContinuar = document.querySelector('.continuar')
    const botonParar = document.querySelector('.parar')
    botonIniciar.style.display = 'inline-block'
    botonReiniciar.style.display = 'inline-block'
    botonContinuar.style.display = 'none'
    botonParar.style.display = 'none'
}

const estadoActivado = () => {
    const botonIniciar = document.querySelector('.iniciar')
    const botonReiniciar = document.querySelector('.reiniciar')
    const botonContinuar = document.querySelector('.continuar')
    const botonParar = document.querySelector('.parar')
    const botonTiempoIntermedio = document.querySelector('.tiempo-intermedio')
    botonIniciar.style.display = 'none'
    botonReiniciar.style.display = 'none'
    botonContinuar.style.display = 'none'
    botonParar.style.display = 'inline-block'
    botonTiempoIntermedio.style.display = 'inline-block'
    renderizarTabla(registroTiempos, nombreTabla)
}

const estadoDetenido = () => {
    const botonParar = document.querySelector('.parar')
    const botonTiempoIntermedio = document.querySelector('.tiempo-intermedio')
    const botonContinuar = document.querySelector('.continuar')
    const botonReiniciar = document.querySelector('.reiniciar')
    botonParar.style.display = 'none'
    botonTiempoIntermedio.style.display = 'none'
    botonContinuar.style.display = 'inline-block'
    botonReiniciar.style.display = 'inline-block'

    // Mostrar opcion de guardar tiempos
    const formularioGuardarTiempos = document.querySelector('.formulario-tabla')
    formularioGuardarTiempos.style.display = 'block'
}

// FUNCIONES DE RENDERIZADO
// Se renderiza con el tiempo especificado en la variable de cronometro
const renderizarCronometro = (cronometro) => {
    const minutos = cronometro.minutos < 10 ? `0${cronometro.minutos}` : cronometro.minutos
    const segundos = cronometro.segundos < 10 ? `0${cronometro.segundos}` : cronometro.segundos
    const milisegundos = cronometro.milisegundos < 10 ? `0${cronometro.milisegundos}` : cronometro.milisegundos
    return `${minutos}:${segundos}:${milisegundos}`
}

// Renderiza y actualiza el tiempo del cronometro en tiempo real
const renderizarTiempo = (tiempo) => {
    const ml = document.querySelector('.milisegundos')
    if (tiempo.milisegundos < 99) {
        tiempo.milisegundos += 1
        ml.textContent = tiempo.milisegundos < 10 ? '0' + tiempo.milisegundos : tiempo.milisegundos
    } else{
        tiempo.milisegundos = 0
        ml.textContent = '00'
        const sg = document.querySelector('.segundos')
        if (tiempo.segundos < 59) {
            tiempo.segundos += 1
            sg.textContent = tiempo.segundos < 10 ? '0' + tiempo.segundos : tiempo.segundos
        } else {
            tiempo.segundos = 0
            sg.textContent = '00'
            const mn = document.querySelector('.minutos')
            if (tiempo.minutos < 59) {
                tiempo.minutos += 1
                mn.textContent = tiempo.minutos < 10 ? '0' + tiempo.minutos : tiempo.minutos
            } else {
                tiempo.minutos = 0
                mn.textContent = '00'
                clearInterval(intervalo)
            }
        }
    }
}

/* Renderiza los puestos y tiempos de una tabla respecto a un registro de tiempos, es llamada por:
    - mostrarTabla
    - botonTiempoIntermedio
*/
const renderizarTabla = (registroCronometro, nombreTabla) => {
    if (registroCronometro.length === 0) return
    
    const seccionTabla = document.querySelector('.tiempos-del-cronometro')
    seccionTabla.style.display = 'block'
    const h2Tabla = document.querySelector('.titulo-tabla')
    h2Tabla.textContent = nombreTabla
    const datosTabla = document.querySelector('.datos-tabla')
    datosTabla.innerHTML = ''

    registroCronometro.forEach((registro) => {
        const tr = document.createElement('tr')
        tr.classList.add('campos-tabla-body')

        const tdPuesto = document.createElement('td')
        tdPuesto.textContent = registro.puesto

        const tdTiempo = document.createElement('td')
        tdTiempo.textContent = renderizarCronometro(registro.tiempo)
        tr.appendChild(tdPuesto)
        tr.appendChild(tdTiempo)

        datosTabla.appendChild(tr)
    })
}

// Se muestra en dos ocasiones, si hay registros en el localStorage o si se guarda un nuevo registro.
const renderizarHistorial = () => {
    const seccionHistorial = document.querySelector('.tiempos-local-storage')

    if ( registroTablas.length === 0 ) {
        seccionHistorial.style.display = 'none'
        return
    }

    seccionHistorial.style.display = 'block'
    
    const listaHistorial = document.querySelector('.lista-historial')
    listaHistorial.innerHTML = ''
    
    registroTablas.forEach((tabla, indice) => {
        const elemento = document.createElement('li')
        elemento.classList.add('elementos-historial')

        const nombre = document.createElement('p')
        nombre.classList.add('elemento-nombre')
        const mejorTiempo = document.createElement('p')
        mejorTiempo.classList.add('elemento-mejor-tiempo')
        const contenedorBotones = document.createElement('div')
        contenedorBotones.classList.add('historial-botones')

        // Acciones del historial
        const vertabla = document.createElement('button')
        vertabla.classList.add('elemento-ver')
        const eliminarTabla = document.createElement('button')
        eliminarTabla.classList.add('elemento-eliminar')
        vertabla.textContent = 'Ver'
        eliminarTabla.textContent = 'Borrar'
        contenedorBotones.appendChild(vertabla)
        contenedorBotones.appendChild(eliminarTabla)

        vertabla.addEventListener('click', () => {
            mostrarTabla(tabla)
        })
        eliminarTabla.addEventListener('click', () => {
            borrarTabla(indice)
        })

        nombre.textContent = tabla.nombreTabla
        mejorTiempo.textContent = `Mejor tiempo: ${tabla.mejorTiempo}`

        elemento.appendChild(nombre)
        elemento.appendChild(mejorTiempo)
        elemento.appendChild(contenedorBotones)

        listaHistorial.appendChild(elemento)
    })

}

if ( registroTablas.length > 0 ) renderizarHistorial()

// ACCIONES DE LOS BOTONES DEL CRONOMETRO
const botonIniciar = document.querySelector('.iniciar')
botonIniciar.addEventListener('click', () => {
    estadoActivado()
    // alerta('Se desactivo brevemente las acciones del historial', 'informativo')
    intervalo = setInterval(() => renderizarTiempo(cronometro), 1000 / 100)
})

const botonParar = document.querySelector('.parar')
botonParar.addEventListener('click', () => {
    estadoDetenido()
    clearInterval(intervalo)
})

const botonContinuar = document.querySelector('.continuar')
botonContinuar.addEventListener('click', () => {
    estadoActivado()
    intervalo = setInterval(() => renderizarTiempo(cronometro), 1000 / 100)
})

const botonReiniciar = document.querySelector('.reiniciar')
botonReiniciar.addEventListener('click', () => {
    estadoInicial()
})

const botonTiempoIntermedio = document.querySelector('.tiempo-intermedio')
botonTiempoIntermedio.addEventListener('click', () => {
    let orden = registroTiempos.length + 1
    registroTiempos.push({
        puesto: orden,
        tiempo: {
            minutos: cronometro.minutos,
            segundos: cronometro.segundos,
            milisegundos: cronometro.milisegundos
        }
    })

    renderizarTabla(registroTiempos, nombreTabla)
})

// ACCIONES VER Y ELIMINAR TABLAS
function mostrarTabla (tabla) {
    renderizarTabla(tabla.tiempos, tabla.nombreTabla)
    const formularioTabla = document.querySelector('.formulario-tabla')
    formularioTabla.style.display = 'none'
}

function borrarTabla (indice) {
    const nuevoRegistroTablas = registroTablas.filter((_, i) => i !== indice)
    localStorage.removeItem('registroTablas')
    localStorage.setItem('registroTablas', JSON.stringify(nuevoRegistroTablas))
    registroTablas = JSON.parse(localStorage.getItem('registroTablas')) || []
    renderizarHistorial()
}

// GUARDAR TABLA
const botonGuardar = document.querySelector('.guardar-tabla')
botonGuardar.addEventListener('click', (event) => {
    event.preventDefault()

    if (registroTiempos.length == 0) {
        alerta('No se encontro datos para guardar', 'incorrecto')
        return
    }

    const { value: nombreT } = document.getElementById('nombre-tabla')
    const existeNombreTabla = registroTablas.some(tabla => tabla.nombreTabla === nombreTabla)
    if (nombreT === '') {
        alerta('Asigne un nombre a la tabla', 'incorrecto')
        return
    }
    if (existeNombreTabla) {
        alerta('Este nombre esta en uso', 'incorrecto')
        return
    }

    const mejorTiempo = renderizarCronometro(registroTiempos[0].tiempo)
    let nuevoRegistroTabla = {
        nombreTabla: nombreT,
        mejorTiempo,
        tiempos: registroTiempos
    }

    registroTablas.push(nuevoRegistroTabla)
    localStorage.setItem('registroTablas', JSON.stringify(registroTablas))
    renderizarTabla(registroTiempos, nombreT)

    renderizarHistorial()
    estadoInicial(1)
    alerta('El registro se guardo correctamente', 'correcto')
    document.getElementById('nombre-tabla').value = ''
})

// Alerta y Retroalimentación de las acciones
/* 
    Estados:
    - informativo
    - correcto
    - incorrecto
*/
const alerta = (mensaje, estado = 'informativo') => {
    const contenedor = document.querySelector('.contenedor-alerta');
    const mensajeElemento = contenedor.querySelector('.mensaje-alerta');

    mensajeElemento.className = 'mensaje-alerta';

    mensajeElemento.classList.add(`alerta-${estado}`);
    mensajeElemento.textContent = mensaje;

    contenedor.style.display = 'block';

    setTimeout(() => {
        contenedor.style.display = 'none';
        mensajeElemento.textContent = '';
        mensajeElemento.className = 'mensaje-alerta';
    }, 2000);
};
