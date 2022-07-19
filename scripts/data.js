let isLoad = false

let rawData = []

readData()

async function readData() {
    if (!isLoad) {
        const json = await getJSON()
        drawPoints(json.waypoints)
        rawData = json
        generateLists()
    }
}

async function getJSON() {
    return fetch('./data/data.json')
        .then(res => {return res.json() })
        .catch(err => console.log(err))
}

// Genere tous les points du JSON
function drawPoints(array) {
    // console.log("waypoints", array)

    array.forEach(element => {
        // Genere les lieux
        if (element['coords'] !== undefined) {
            loadPlaces(element)
        } 
        // Genere les ressources
        else if (element['name'] === 'resources') {
            loadResources(element['types']) 
        }

    })
    isLoad = true
    setTransform()
}

function loadPlaces(dataPlaces) {
    const coords = dataPlaces['coords']
            
    coords.forEach(e => {
        const point = {
            name: dataPlaces.name,
            quantity: 1,
            coords: {
                x: e.x,
                y: e.y
            }
        }
        // const pointCoords = {
        //     x: e.x,
        //     y: e.y
        // }
        const pointCoords = point.coords
        const landmark = document.createElement('div')
        landmark.addEventListener('click', () => setContextMenu(point, landmark))
        landmarks.push(point)
        
        switch (dataPlaces.name) {
            case 'statues': 
                landmark.className = 'landmark statues'
                break
            case 'dungeons': 
                landmark.className = 'landmark dungeons'
                break
            case 'domains': 
                landmark.className = 'landmark domains'
                break
            default: console.log("Erreur")
        }
        landmark.style = 'left :' + (pointCoords.x * zoomScale + mapCoords.x) + 'px; top: ' + (pointCoords.y * zoomScale + mapCoords.y) + 'px'
        markersDiv.appendChild(landmark)
    })
}

function loadResources(dataResources) {
    console.log('loadresources', dataResources)

    dataResources.forEach(element => {
        // Genere la liste des ressources dans le sideMenu
        const li = document.createElement('li'),
            divResources = document.getElementsByClassName(element.name)

        let isSelected = false

        li.addEventListener('click', () => {
            if (isSelected) {
                isSelected = false
                li.classList.remove('selected')
                Array.from(divResources).forEach(e => e.style.display = "none")
                // document.getElementsByClassName(element.name).forEach(() => li.style.display = "none")
                
            } else {
                isSelected = true
                li.classList.add('selected')
                // document.getElementsByClassName(element.name).forEach(() => li.style.display = "block")
                Array.from(divResources).forEach(e => e.style.display = "block")

            }
            // console.log(element.name, isSelected)
        })
        li.style.backgroundImage = 'url(./assets/icons/' + element.name + '.webp), url(./assets/Background_Item_1_Star.webp)'
        sideMenuListResources.appendChild(li)

        // Genere les points de toutes les ressources
        if (element['info'].length != 0) {
            element['info'].forEach(el => {
                const typeCoords = el.coords,
                    landmark = document.createElement('div')
                
                const point = {
                    name: element.name,
                    quantity: Number(el.quantity),
                    coords: {
                        x: Number(el.coords.x),
                        y: Number(el.coords.y)
                    }
                }

                landmark.addEventListener('click', () => setContextMenu(point, landmark))
                landmarks.push(point)
                landmark.className = 'landmark resources'
                landmark.classList.add(element.name)
                landmark.style.display = 'none'
                landmark.style.backgroundImage = 'url(./assets/icons/' + element.name + '.webp), url(./assets/Background_Item_1_Star.webp)'
                markersDiv.appendChild(landmark)
            })
        }
    })
}