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

const botonIniciar = document.querySelector('.iniciar')
botonIniciar.addEventListener('click', () => estadoActivado())

const botonParar = document.querySelector('.parar')
botonParar.addEventListener('click', () => estadoDetenido())

const botonContinuar = document.querySelector('.continuar')
botonContinuar.addEventListener('click', () => estadoActivado())

const botonReiniciar = document.querySelector('.reiniciar')
botonReiniciar.addEventListener('click', () => estadoInicial())