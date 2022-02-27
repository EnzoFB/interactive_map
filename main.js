const map = document.querySelector('.teyvat_map')
let zoomScale = 1, 
    isMoving = false,
    mapHeight = map.clientHeight,
    mapWidth = map.clientWidth

let point = {x: 0, y: 0}, startPoint = {x: 0, y: 0}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function setTransform() {
    point.x = clamp(point.x, -mapWidth * zoomScale + window.innerWidth, 0)
    point.y = clamp(point.y, -mapHeight * zoomScale + window.innerHeight, 0)

    map.style.transform = 'translate(' + point.x + 'px, ' + point.y + 'px) scale(' + zoomScale + ')'
}

map.addEventListener('mousemove', function(e) {
    e.preventDefault()
    if (!isMoving) return
    
    point.x = (e.clientX) - startPoint.x
    point.y = (e.clientY) - startPoint.y

    setTransform()
})

map.addEventListener('mouseup', function(e) {
    isMoving = false
})

map.addEventListener('mousedown', function(e) {
    isMoving = true
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

map.addEventListener('click', function(e) {
    console.log('Pos: ', e.clientX, e.clientY)
})