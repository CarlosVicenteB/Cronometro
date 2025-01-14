let cronometro = {
    minutos: 0,
    segundos: 0,
    milisegundos: 0
}
let intervalo = null
let registroTiempos = []

// Estructura de cada registro
/*
    [
        {
            puesto: 1
            tiempo: cronometro
        },
        ...
    ]
*/

const estadoInicial = () => {
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

const renderizarTiempo = (tiempo) => { // Extraer la logica para evitar repiticion de codigo
    const ml = document.querySelector('.milisegundos')
    if (tiempo.milisegundos < 99) {
        tiempo.milisegundos += 1
        ml.textContent = tiempo.milisegundos < 9 ? '0' + tiempo.milisegundos : tiempo.milisegundos
    } else{
        tiempo.milisegundos = 0
        ml.textContent = '00'
        const sg = document.querySelector('.segundos')
        if (tiempo.segundos < 59) {
            tiempo.segundos += 1
            sg.textContent = tiempo.segundos < 9 ? '0' + tiempo.segundos : tiempo.segundos
        } else {
            tiempo.segundos = 0
            sg.textContent = '00'
            const mn = document.querySelector('.minutos')
            if (tiempo.minutos < 59) {
                tiempo.minutos += 1
                mn.textContent = tiempo.minutos < 9 ? '0' + tiempo.minutos : tiempo.minutos
            } else {
                tiempo.minutos = 0
                mn.textContent = '00'
                clearInterval(intervalo)
            }
        }
    }
}

const renderizarTabla = () => {
    if (registroTiempos.length === 0) return
    const seccionTabla = document.querySelector('.tiempos-del-cronometro')
    seccionTabla.style.display = 'block'
    const datosTabla = document.querySelector('.datos-tabla')
    datosTabla.innerHTML = ''

    registroTiempos.forEach((registro) => {
        const tr = document.createElement('tr')
        tr.classList.add('campos-tabla-body')

        const tdPuesto = document.createElement('td')
        tdPuesto.textContent = registro.puesto

        const tdTiempo = document.createElement('td')
        tdTiempo.textContent = `
            ${registro.tiempo.minutos < 9 ? '0' + registro.tiempo.minutos : registro.tiempo.minutos}
            ${registro.tiempo.segundos < 9 ? '0' + registro.tiempo.segundos : registro.tiempo.segundos}
            ${registro.tiempo.milisegundos < 9 ? '0' + registro.tiempo.milisegundos : registro.tiempo.milisegundos}
        `

        tr.appendChild(tdPuesto)
        tr.appendChild(tdTiempo)

        datosTabla.appendChild(tr)
    })
}

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

    renderizarTabla()
})
