const divMap = document.querySelector('.teyvat_map')

let mapHeight = divMap.getBoundingClientRect().height,
    mapWidth = divMap.getBoundingClientRect().width

function setTransform() {
    // Empeche de dépasser les bords
    mapCoords.x = clamp(mapCoords.x, -mapWidth * zoomScale + window.innerWidth, 0)
    mapCoords.y = clamp(mapCoords.y, -mapHeight * zoomScale + window.innerHeight, 0)

    // Deplace tous les points
    let markers = document.getElementsByClassName('landmark')
    for (let i = 0; i < markers.length; i++) {
        // console.log(landmarks[i].coords)
        markers[i].style.left = (landmarks[i].coords.x * zoomScale + mapCoords.x )  + 'px'
        markers[i].style.top = (landmarks[i].coords.y * zoomScale + mapCoords.y )  + 'px'
    }

    // Deplace la map
    divMap.style.transform = 'translate(' + mapCoords.x + 'px, ' + mapCoords.y + 'px) scale(' + zoomScale + ')'
}

canvas.addEventListener('mousedown', function(e) {

    if (e.button === 0 || e.button === 1) {
        isMoving = true
        isClicked = true
    }

    mouseCoords = { 
        x: e.clientX - mapCoords.x, 
        y: e.clientY - mapCoords.y 
    }

    if (e.target.offsetParent != divCreateContextMenu || e.target.offsetParent != divEditContextMenu ) deselectAll()
})

canvas.addEventListener('mousemove', function(e) {
    e.preventDefault()

    document.getElementById("rt-map").innerText = `X: ${Math.round(mapCoords.x)}, Y: ${Math.round(mapCoords.y)}`

    isClicked = false
    if (!isMoving) return

    canvas.style.cursor = 'grabbing'
    
    mapCoords.x = (e.clientX) - mouseCoords.x
    mapCoords.y = (e.clientY) - mouseCoords.y

    setTransform()
    if (isDrawn) drawShortPath(savedPath)
})

window.addEventListener('mouseup', function(e) {
    isMoving = false
    canvas.style.cursor = 'grab'
})