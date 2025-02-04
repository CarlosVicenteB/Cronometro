let registroTablas = JSON.parse(localStorage.getItem('registroTablas')) || []
let cronometro = {
    minutos: 0,
    segundos: 0,
    milisegundos: 0
}
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
}

// FUNCIONES DE RENDERIZADO
const renderizarCronometro = (cronometro) => {
    const minutos = cronometro.minutos < 10 ? `0${cronometro.minutos}` : cronometro.minutos
    const segundos = cronometro.segundos < 10 ? `0${cronometro.segundos}` : cronometro.segundos
    const milisegundos = cronometro.milisegundos < 10 ? `0${cronometro.milisegundos}` : cronometro.milisegundos
    return `${minutos}:${segundos}:${milisegundos}`
}

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

// Se renderiza a medida que se presione el boton tiempoIntermedio o que se ponga ver a uno de los registros de tablas
const renderizarTabla = (registroCronometro, nombreTabla = 'Tiempos del cronometro') => {
    if (registroCronometro.length === 0) return
    
    const formularioTabla = document.querySelector('.formulario-tabla')
    formularioTabla.style.display = 'block'
    const seccionTabla = document.querySelector('.tiempos-del-cronometro')
    seccionTabla.style.display = 'block'
    const datosTabla = document.querySelector('.datos-tabla')
    datosTabla.innerHTML = ''
    const h2Tabla = document.querySelector('.titulo-tabla')
    h2Tabla.textContent = nombreTabla

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
        elemento.classList.toggle('elementos-historial')

        const nombre = document.createElement('p')
        nombre.classList.toggle('elemento-nombre')
        const mejorTiempo = document.createElement('p')
        mejorTiempo.classList.toggle('elemento-mejor-tiempo')
        const vertabla = document.createElement('button')
        vertabla.classList.toggle('elemento-ver')
        const eliminarTabla = document.createElement('button')
        eliminarTabla.classList.toggle('elemento-eliminar')

        vertabla.addEventListener('click', () => {
            mostrarTabla(tabla)
        })
        eliminarTabla.addEventListener('click', () => {
            borrarTabla(indice)
        })

        nombre.textContent = tabla.nombreTabla
        mejorTiempo.textContent = `Mejor tiempo: ${tabla.mejorTiempo}`
        vertabla.textContent = 'Ver'
        eliminarTabla.textContent = 'Delete'

        elemento.appendChild(nombre)
        elemento.appendChild(mejorTiempo)
        elemento.appendChild(vertabla)
        elemento.appendChild(eliminarTabla)

        listaHistorial.appendChild(elemento)
    })

}

if ( registroTablas.length > 0 ) renderizarHistorial()

// ACCIONES DE LOS BOTONES DEL CRONOMETRO
const botonIniciar = document.querySelector('.iniciar')
botonIniciar.addEventListener('click', () => {
    estadoActivado()
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

// ACCIONES VER Y ELIMINAR TABLAS
function mostrarTabla (tabla) {
    renderizarTabla(tabla.tiempos, tabla.nombreTabla)
    const formularioTabla = document.querySelector('.formulario-tabla')
    formularioTabla.style.display = 'none'
}

function borrarTabla (indice) {
    const nuevoRegistroTablas = registroTablas.filter((_, i) => i !== indice)
    console.log(nuevoRegistroTablas)
    localStorage.removeItem('registroTablas')
    localStorage.setItem('registroTablas', JSON.stringify(nuevoRegistroTablas))
    registroTablas = JSON.parse(localStorage.getItem('registroTablas')) || []
    renderizarHistorial()
}

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

    renderizarTabla(registroTiempos)
})

// MANEJAR LOS REGISTROS DE LOS TIEMPOS
// Llamar a una funcion de alerta cuando no tiene nombre o ya este en uso el nombre, en caso se guardo hacer algo con el boton para que no se aprete mas de una vez
const botonGuardar = document.querySelector('.guardar-tabla')
botonGuardar.addEventListener('click', (event) => {
    event.preventDefault()

    const { value: nombreTabla } = document.getElementById('nombre-tabla')
    const existeNombreTabla = registroTablas.some(tabla => tabla.nombreTabla === nombreTabla)
    if (nombreTabla === '' || existeNombreTabla) return

    const mejorTiempo = renderizarCronometro(registroTiempos[0].tiempo)
    let nuevoRegistroTabla = {
        nombreTabla,
        mejorTiempo,
        tiempos: [...registroTiempos]
    }

    registroTablas.push(nuevoRegistroTabla)
    localStorage.setItem('registroTablas', JSON.stringify(registroTablas))
    renderizarTabla(registroTiempos, nombreTabla)
    renderizarHistorial()
})
