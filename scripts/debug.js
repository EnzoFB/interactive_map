const debugMenu = document.getElementById('debug')
let isDebugExpanded = true

window.addEventListener('mousemove', (e) => {
    document.getElementById("rt-mouse").innerText = `X: ${Math.round((e.clientX + -mapCoords.x) / zoomScale) }, Y: ${Math.round((e.clientY + -mapCoords.y) / zoomScale)}`
})

debugMenu.addEventListener('click', showDebug)

function debugZoom() {
    document.getElementById("rt-zoom").innerText = `ZoomScale: ${zoomScale}`    
}

function showDebug() {
    if (isDebugExpanded) {
        debugMenu.style.transform = 'translateY(175px)'

        isDebugExpanded = false
    } else {
        debugMenu.style.transform = 'translateY(0px)'

        isDebugExpanded = true
    }
}