const map = document.querySelector('.teyvat_map')

let zoomScale = 1, 
    isMoving = false,
    isClicked = false,
    mapHeight = map.clientHeight,
    mapWidth = map.clientWidth,
    cptMarker = 1

let mapCoords = {x: 0, y: 0}, 
    mouseCoords = {x: 0, y: 0}

let coordsLandmarks = []

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

function setTransform() {
    mapCoords.x = clamp(mapCoords.x, -mapWidth * zoomScale + window.innerWidth, 0)
    mapCoords.y = clamp(mapCoords.y, -mapHeight * zoomScale + window.innerHeight, 0)

    let markers = document.getElementsByClassName('landmark')
    for (let i = 0; i < markers.length; i++) {
        markers[i].style.left = (coordsLandmarks[i].x * zoomScale + mapCoords.x )  + 'px'
        markers[i].style.top = (coordsLandmarks[i].y * zoomScale + mapCoords.y )  + 'px'
    }

    map.style.transform = 'translate(' + mapCoords.x + 'px, ' + mapCoords.y + 'px) scale(' + zoomScale + ')'
}

function createLandmark() {
    let coordsLandmark = {x: mouseCoords.x / zoomScale, y: mouseCoords.y / zoomScale }
    coordsLandmarks.push(coordsLandmark)

    let landmark = document.createElement('div')
    let text = document.createTextNode(cptMarker)
    cptMarker++

    landmark.appendChild(text)
    landmark.className = 'landmark'
    landmark.style = 'left :' + (mouseCoords.x + mapCoords.x) + 'px; top: ' + (mouseCoords.y + mapCoords.y) + 'px'
    
    document.body.appendChild(landmark)
 
    console.log('Mouse at: ', mouseCoords.x, mouseCoords.y)
    console.log('Map at: ', mapCoords.x, mapCoords.y)
}

map.addEventListener('mousemove', function(e) {
    e.preventDefault()
    isClicked = false
    if (!isMoving) return

    map.style.cursor = 'grab'
    
    mapCoords.x = (e.clientX) - mouseCoords.x
    mapCoords.y = (e.clientY) - mouseCoords.y

    setTransform()
})

map.addEventListener('mouseup', function(e) {
    isMoving = false
    // console.log(isClicked ? 'click' : 'drag')
    map.style.cursor = 'pointer'

    if (isClicked) {
        createLandmark()
    }
})

map.addEventListener('mousedown', function(e) {
    isMoving = true
    isClicked = true
    mouseCoords = { 
        x: e.clientX - mapCoords.x, 
        y: e.clientY - mapCoords.y 
    }
})

map.addEventListener('wheel', function(e) {
    e.preventDefault()
    let zoomX = (e.clientX - mapCoords.x) / zoomScale,
        zoomY = (e.clientY - mapCoords.y) / zoomScale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    
    (delta > 0) ? (zoomScale *= 1.2) : (zoomScale /= 1.2)
    zoomScale = clamp(zoomScale, 1, 5)

    mapCoords.x = e.clientX - zoomX * zoomScale
    mapCoords.y = e.clientY - zoomY * zoomScale

    setTransform()
})