const map = document.querySelector('.teyvat_map')
let zoomScale = 1, 
    isMoving = false,
    isClicked = false,
    mapHeight = map.clientHeight,
    mapWidth = map.clientWidth,
    cptMarker = 1

let point = {x: 0, y: 0}, startPoint = {x: 0, y: 0}

let coordsLandmarks = []

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function setTransform() {
    point.x = clamp(point.x, -mapWidth * zoomScale + window.innerWidth, 0)
    point.y = clamp(point.y, -mapHeight * zoomScale + window.innerHeight, 0)

    let marker = document.getElementsByClassName('landmark')
    console.log(marker[0])
    // marker[0].style.transform = 'translate(' + (coordsLandmarks.x + point.x) + 'px, ' + (coordsLandmarks.y + point.y) + 'px)'
    // marker[0].style.transform = 'translate(' + point.x + 'px, ' + point.x + 'px)'

    map.style.transform = 'translate(' + point.y + 'px, ' + point.x + 'px) scale(' + zoomScale + ')'
}

function createLandmark() {
    let coordsLandmark = {x: startPoint.x, y: startPoint.y }
    coordsLandmarks.push(coordsLandmark)

    let landmark = document.createElement('div')
    let text = document.createTextNode(cptMarker)
    cptMarker++

    landmark.appendChild(text)
    landmark.className = 'landmark'
    landmark.style = 'left :' + (startPoint.x - 25) + 'px; top: ' + (startPoint.y - 25) + 'px'
    
    document.body.appendChild(landmark)
 
    // console.log('Landmark created at: ', startPoint.x, startPoint.y)
    // console.log('Map at: ', point.x, point.y)
    console.table(coordsLandmarks)
}

map.addEventListener('mousemove', function(e) {
    e.preventDefault()
    isClicked = false
    if (!isMoving) return
    
    point.x = (e.clientX) - startPoint.x
    point.y = (e.clientY) - startPoint.y

    setTransform()
})

map.addEventListener('mouseup', function(e) {
    isMoving = false
    // console.log(isClicked ? 'click' : 'drag')

    if (isClicked) {
        createLandmark()
    }
})

map.addEventListener('mousedown', function(e) {
    isMoving = true
    isClicked = true
    startPoint = { 
        x: e.clientX - point.x, 
        y: e.clientY - point.y 
    }
})

map.addEventListener('wheel', function(e) {
    e.preventDefault()
    let zoomX = (e.clientX - point.x) / zoomScale,
        zoomY = (e.clientY - point.y) / zoomScale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    
    (delta > 0) ? (zoomScale *= 1.2) : (zoomScale /= 1.2)
    zoomScale = clamp(zoomScale, 1, 5)

    point.x = e.clientX - zoomX * zoomScale
    point.y = e.clientY - zoomY * zoomScale

    setTransform()
})