let isSideMenuExpand = true

const divGeneral = document.getElementById('general'),
    menuResources = document.getElementById('menuResources'),
    divOptions = document.getElementById('options'),
    sideMenuListResources = document.getElementById('sideMenuListResources')

function hideSideMenu() {
    let menu = document.getElementById("sideMenu"),
        arrow = document.getElementById("expand")

    if (isSideMenuExpand) {
        menu.style.transform = "translateX(-400px)"
        arrow.style.borderRadius = "30% 0 0 30%"
        arrow.style.transform = "scaleX(-1)"
        isSideMenuExpand = false
    } else {
        menu.style.transform = "translateX(0px)"
        arrow.style.borderRadius = "0 30% 30% 0"
        arrow.style.transform = "scaleX(1)"
        isSideMenuExpand = true
    }
}

let tabContainer = document.getElementById('tab'),
    tablinks = tabContainer.getElementsByClassName('tablink')

for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener('click', (e) => {
        let cur = tabContainer.getElementsByClassName('active')
        if (cur.length > 0) cur[0].className = cur[0].className.replace(' active', '')
        console.log(e.target)
        e.target.classList.add("active")
    })
}