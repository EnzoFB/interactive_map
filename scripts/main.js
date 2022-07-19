// const map = document.querySelector('.teyvat_map')
const markersDiv = document.getElementById('markers')
const landmarksDiv = document.getElementsByClassName('landmark')

let zoomScale = 1, 
    isMoving = false,
    isClicked = false,
    isDrawn = false,
    cptMarker = 1

let mapCoords = {x: 0, y: 0}, 
    mouseCoords = {x: 0, y: 0}

let landmarks = [], beacons = []
let savedPath = []

function createBeacon() {
    deselectAll()

    const x = Math.round(mouseCoords.x / zoomScale),
        y = Math.round(mouseCoords.y / zoomScale),
        beaconCoords = { x: x, y: y },
        point = {
            name: undefined,
            quantity: 1,
            coords: beaconCoords
        }

    beacons.push(beaconCoords)
    landmarks.push(point)

    let beaconDiv = document.createElement('div')
    beaconDiv.className = 'landmark beacon'
    beaconDiv.style = 'left :' + Math.round(mouseCoords.x + mapCoords.x) + 'px; top: ' + Math.round(mouseCoords.y + mapCoords.y) + 'px'
    beaconDiv.addEventListener('click', (e) => setContextMenu(point, e.target))
    markersDiv.appendChild(beaconDiv)
}

canvas.addEventListener('wheel', function(e) {
    deselectAll()
    
    let zoomX = (e.clientX - mapCoords.x) / zoomScale,
        zoomY = (e.clientY - mapCoords.y) / zoomScale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    
    (delta > 0) ? (zoomScale *= 1.2) : (zoomScale /= 1.2)
    zoomScale = Math.round(clamp(zoomScale, .5, 5) * 10) / 10
    
    debugZoom()

    mapCoords.x = e.clientX - zoomX * zoomScale
    mapCoords.y = e.clientY - zoomY * zoomScale
    
    setTransform()
    // ctx.canvas.width = map.getBoundingClientRect().width
    // ctx.canvas.height = map.getBoundingClientRect().height

    if (isDrawn) drawShortPath(savedPath)
})

function deselectAll() {
    divCreateContextMenu.classList.remove("visible")
    divEditContextMenu.classList.remove("visible")
    divEditContextMenu.style.width = '200px'
    markersDiv.querySelectorAll('.selected').forEach(e => {
        e.classList.remove('selected')
        e.style.zIndex = "1"
    })
    pointSelected = false
}