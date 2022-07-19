window.addEventListener('resize', () => {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
    if (isDrawn) drawShortPath(savedPath)
})

function drawShortPath(array) {
    isDrawn = true
    savedPath = array
    // Dessine une ligne entre chaque point du tableau reçu
    if (array.length > 1 && isDrawn) {

        // Vide la zone de dessin
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < array.length -1; i++) {
            let tmp = array[i], nxt = array[i+1]
            ctx.beginPath()
            ctx.strokeStyle = 'antiquewhite'
            ctx.lineWidth = 5
            ctx.moveTo(beacons[tmp].x * zoomScale + mapCoords.x, beacons[tmp].y * zoomScale + mapCoords.y)
            ctx.lineTo(beacons[nxt].x * zoomScale + mapCoords.x, beacons[nxt].y * zoomScale + mapCoords.y)
            ctx.stroke()
            ctx.closePath()
        }
    }
}

function shortTrace() {
    let bestDist
    isDrawn = true

    for (let i = 0; i < beacons.length; i++) {
        let shortestPath = calcShortestPath()
        if (shortestPath.dist < bestDist || bestDist === undefined) {
            drawShortPath(shortestPath.array)
            bestDist = shortestPath.dist
        }
    }
}

function brutTrace() {
    isDrawn = true

    if (beacons.length < 10) {
        let brutPath = calcBrutPath()
        drawShortPath(brutPath)
    } else { alert("9 MAX J'AI DIT")}
}

function calcBrutPath() {
    const allPaths = permutePath(beacons.map(a => a.id))
    let copy = structuredClone(allPaths).reverse()
    let bestPath = {distance: 99999, path: []}

    for (let i = 0; i < allPaths.length; i++ ) {
        let currentPath = allPaths[i], currentSum = 0
        
        for (let j = 0; j < currentPath.length - 1 && currentSum < bestPath.distance; j++ ) {
            let dist = calcDistBtwPtns(beacons[currentPath[j]], beacons[currentPath[j+1]])

            currentSum += dist
        }

        if (currentSum < bestPath.distance) bestPath = {distance: currentSum, path: currentPath}
    }

    console.log("bestPath: ", bestPath.distance, bestPath.path)

    return bestPath.path
}

function calcShortestPath() {
    // Récupère un tableau d'id
    const allPaths = Array.from(beacons.keys())

    // Deep copy du tableau d'id et creation d'un objet path
    let copy = [...allPaths], path = {array: [], dist: 0}

    // boucle sur tout les elements du tableau
    for (let i = 0; i < allPaths.length; i++) {

        // choisit un id random parmi le tableau copy
        let random = Math.floor(Math.random() * copy.length)

        // si le tableau de path est superieur a 2
        if (path.array.length >= 2) {
            let bestPath = [], bestDist;

            // insere l'id random dans le tableau path
            path.array.unshift(copy[random])

            // pour chaque elements de path
            for (let j = 0; j < path.array.length; j++) {

                // calcul de la somme des distances entre chaque points du tableau
                let sum = calcSumInArray(path.array)

                // si la somme est inferieur a la somme la plus courte deja enregistrer, la garder
                if (sum < bestDist || bestDist === undefined) {
                    bestDist = sum
                    bestPath = [...path.array]
                }

                // inverse les 2 dernieres valeurs
                if (j < path.array.length - 1) [path.array[j], path.array[j+1]] = [path.array[j+1], path.array[j]]
            }
            
            // enregistre le meilleur chemin et la meilleur distance
            path.array = [...bestPath]
            path.dist = bestDist
            
        } else { path.array.push(copy[random]) }

        // retire l'id choisit precedement
        copy.splice(random, 1)
    }
    // renvoie le meilleur chemin trouver
    return path
}

function permutePath(array) {
    let ret = [];

    for (let i = 1; i < array.length; i = i + 1) {
        let rest = permutePath(array.slice(0, i).concat(array.slice(i + 1)));

        if(!rest.length) {
        ret.push([array[i]])
        } else {
        for(let j = 0; j < rest.length; j = j + 1) {
            ret.push([array[i]].concat(rest[j]))
        }
        }
    }
    return ret;
}

function calcSumInArray(array) {
    let sum = 0
    for (let i = 0; i < array.length - 1; i++) {
        sum += calcDistBtwPtns(beacons[array[i]], beacons[array[i+1]])
    }
    return sum
}

function calcDistBtwPtns(a, b) {
    const res = Math.round(
        Math.sqrt(
            Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2)
        )
    )
    return res
}