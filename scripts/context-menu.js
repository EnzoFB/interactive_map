const divCreateContextMenu = document.getElementById("create-context-menu"),
    divEditContextMenu = document.getElementById("edit-context-menu")

const divCoordX = document.getElementById('coordX'),
        divCoordY = document.getElementById('coordY'),
        divDelete = document.getElementById('delete')

let pointSelected = false,
    idPoint

let JSONForm = []

// Créer un point
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault()

    document.getElementById('createLandmark').style.display = 'block'
    // const { clientX: mouseX, clientY: mouseY } = e

    const coords = { 
        x: Math.round((e.clientX - mapCoords.x) / zoomScale), 
        y: Math.round((e.clientY - mapCoords.y) / zoomScale)
    }

    document.getElementById("create-coords").innerText = `X: ${coords.x} | Y: ${coords.y}`
    divCreateContextMenu.style.left = `${Math.round(coords.x * zoomScale + mapCoords.x)}px`
    divCreateContextMenu.style.top = `${Math.round(coords.y * zoomScale + mapCoords.y) }px`
    divCreateContextMenu.classList.add("visible")
    // save.onclick = saveInfo()
    return false
}, false)

// Modifier un point
function setContextMenu(point, target) {
    deselectAll()

    target.classList.add("selected")
    target.style.zIndex = "2"
    pointSelected = true
    idPoint = landmarks.findIndex(e => e.coords.x === point.coords.x && e.coords.y === point.coords.y)
    document.getElementById('type').value = point.name
    document.getElementById('resourceIMG').style.backgroundImage = "none"

    if (point.name === 'domains' || point.name === 'dungeons' || point.name === 'statues') {
        document.getElementById('resourceIMG').style.backgroundImage = "url(./assets/" + point.name + ".webp)"
        document.getElementById('divQuantity').style.display = "none"

    } else if (point.name !== undefined){
        document.getElementById('resourceIMG').style.backgroundImage = "url(./assets/icons/" + point.name + ".webp)"
        document.getElementById('divQuantity').style.display = "block"
    }
    document.getElementById("coords_or_name").innerText = `${point.name}`
    divCoordX.value = point.coords.x
    divCoordY.value = point.coords.y
    quantity.value = point.quantity
    divEditContextMenu.style.left = `${Math.round(point.coords.x * zoomScale + mapCoords.x)}px`
    divEditContextMenu.style.top = `${Math.round(point.coords.y * zoomScale + mapCoords.y) }px`
    divEditContextMenu.style.zIndex = "2"
    divEditContextMenu.classList.add("visible")
    save.onclick = () => saveInfo(point)
}

divCoordX.addEventListener('change', changeX )

function changeX() {
    if (pointSelected) {
        landmarks[idPoint].coords.x = Number(divCoordX.value)
        setTransform()
    }
}

divCoordY.addEventListener('change', changeY )

function changeY() {
    if (pointSelected) {
        landmarks[idPoint].coords.y = Number(divCoordY.value)
        setTransform()
    }
}

const quantity = document.getElementById('quantity'),
    minusQ = document.getElementById('minusQ'),
    plusQ = document.getElementById('plusQ'),
    minusX = document.getElementById('minusX'),
    plusX = document.getElementById('plusX'),
    minusY = document.getElementById('minusY'),
    plusY = document.getElementById('plusY')

minusQ.addEventListener('click', () => { if (quantity.value > 0) quantity.value-- })
plusQ.addEventListener('click', () => quantity.value++)
minusX.addEventListener('click', () => { 
    if (coordX.value > 0) coordX.value--
    changeX()
})
plusX.addEventListener('click', () => {
    coordX.value++
    changeX()
})
minusY.addEventListener('click', () => { 
    if (coordY.value > 0) coordY.value--
    changeY()
})
plusY.addEventListener('click', () => {
    coordY.value++
    changeY()
})

function generateLists() {
    const divListPlaces = document.getElementById('places'),
        divListResources = document.getElementById('resources')

    rawData.waypoints.forEach(element => {
        if (element.name !== 'resources') {
            // console.log(element)
            const li = document.createElement('li')
            document.getElementById("coords_or_name").innerText = `${element.name}`
            li.style.backgroundImage = "url(./assets/" + element.name + ".webp), url(./assets/Background_Item_1_Star.webp)"
            divListPlaces.appendChild(li)
            li.addEventListener('click', () => {
                document.getElementById("coords_or_name").innerText = `${element.name}`
                document.getElementById('type').value = element.name
                document.getElementById('resourceIMG').style.backgroundImage = 'url(./assets/' + element.name + '.webp)'
                document.getElementById('divQuantity').style.display = "none"
                // markersDiv.getElementsByClassName('selected')[0].className = "landmark " + element.name + " selected"
                // markersDiv.getElementsByClassName('selected')[0].style.backgroundImage = "url(./assets/" + element.name + ".webp)"
                quantity.value = 1
                divEditContextMenu.style.width = '200px'
            })
        } else if (element.name === 'resources') {
            // console.log(element.types)
            element.types.forEach(e => {
                // console.log(e)
                const li = document.createElement('li')
                li.style.backgroundImage = "url(./assets/icons/" + e.name + ".webp), url(./assets/Background_Item_1_Star.webp)"
                divListResources.appendChild(li)
                li.addEventListener('click', () => {
                    document.getElementById("coords_or_name").innerText = `${e.name}`
                    document.getElementById('type').value = e.name
                    document.getElementById('resourceIMG').style.backgroundImage = 'url(./assets/icons/' + e.name + '.webp)'
                    document.getElementById('divQuantity').style.display = "block"
                    // markersDiv.getElementsByClassName('selected')[0].className = "landmark resources " + e.name + " selected"
                    // markersDiv.getElementsByClassName('selected')[0].style.backgroundImage = 'url(./assets/icons/' + e.name + '.webp), url(./assets/Background_Item_1_Star.webp)'
                    divEditContextMenu.style.width = '200px'
                })
            })
        } else {
            console.log("Erreur")
        }
    });
}

// console.log(rawData.waypoints.find(x => x.name === 'resources').types.length)

document.getElementById('IMGtype').addEventListener('click', () => {
    divEditContextMenu.style.width = '800px'
})

const form = document.getElementById('form'),
    save = document.getElementById('save')

// save.addEventListener('click', saveInfo)

function saveInfo(obj) {
    const formType = form.elements['type'].value,
        formQuantity = Number(form.elements['quantity'].value),
        formCoords = { x: Number(form.elements['coordX'].value), y: Number(form.elements['coordY'].value) }

    obj.name = formType
    obj.quantity = formQuantity

    if (obj.name === 'domains' || obj.name === 'dungeons' || obj.name === 'statues') {
        let tmp = rawData.waypoints.find(x => x.name === obj.name)
        tmp.coords.push(formCoords)
        markersDiv.getElementsByClassName('selected')[0].className = "landmark " + obj.name + " selected"
        markersDiv.getElementsByClassName('selected')[0].style.backgroundImage = 'url(./assets/' + obj.name + '.webp)'
        console.log('NEW PLACE')
    } else {
        const info = { 
            quantity: formQuantity,
            coords: formCoords
        }
        let tmp = rawData.waypoints.find(x => x.name === 'resources').types.find(x => x.name === formType).info
        tmp.push(info)
        markersDiv.getElementsByClassName('selected')[0].className = "landmark resources " + obj.name + " selected"
        markersDiv.getElementsByClassName('selected')[0].style.backgroundImage = 'url(./assets/icons/' + obj.name + '.webp), url(./assets/Background_Item_1_Star.webp)'
        console.log('NEW RESOURCE')
    }
    console.log(rawData, landmarks)
}