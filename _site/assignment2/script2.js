import * as THREE from "three"
import * as  dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth / 2.5,
    height: window.innerWidth / 2.5,
    aspectRatio: 1
}

/**********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl2')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, -20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** LIGHTS **
************/
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/***********
** MESHES **
************/
// Cube Geometry
const cubeGeometry = new THREE.SphereGeometry(0.5)

// Cube Materials
const orangeMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('orange') })
const pinkMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('pink') })
const aquaMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('aqua') })

const drawCube = (i, material) =>
{
    const cube = new THREE.Mesh(cubeGeometry, material)
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = i - 10

    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI

    cube.blerg = Math.random()

    scene.add(cube)
}

/**********************
** UI & TEXT PARSERS **
***********************/
// uiobj
let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'dudley',
    term2: 'snape',
    term3: 'malfoy',
    rotateCamera: false,
    animateBubbles: false,
    reveal() {
        preset = ui.save()
        //console.log(uiobj.term1, uiobj.term2, uiobj.term3)
        // Parse Text and Terms
        parseTextandTerms()

        // Hide termsFolder ui
        termsFolder.hide()

        // Show cubesFolder ui
        cubesFolder.show()

        // Show cameraFolder ui
        cameraFolder.show()
    }
}


// ui
const ui = new dat.GUI({
    container: document.querySelector('#parent2')
})


/*
// Terms Folder
const termsFolder = ui.addFolder('Enter Terms')

termsFolder
    .add(uiobj, 'term1')
    .name('Red Term')

termsFolder
    .add(uiobj, 'term2')
    .name('Green Term')

termsFolder
    .add(uiobj, 'term3')
    .name('Blue Term')

termsFolder
    .add(uiobj, 'reveal')
    .name('Reveal')
*/

// Cubes Folder
const cubesFolder = ui.addFolder('Filter Terms')
//cubesFolder.hide()

cubesFolder
    .add(orangeMaterial, 'visible')
    .name(`${uiobj.term1}`)

cubesFolder
    .add(pinkMaterial, 'visible')
    .name(`${uiobj.term2}`)

cubesFolder
    .add(aquaMaterial, 'visible')
    .name(`${uiobj.term3}`)

cubesFolder
    .add(uiobj, 'animateBubbles')
    .name('Animate Bubbles')

// Camera Folder

const cameraFolder = ui.addFolder('Camera')
//cameraFolder.hide()

cameraFolder
    .add(uiobj, 'rotateCamera')
    .name('Rotate Camera')

// Text Parsers
    // Parse and Tokenize Text
    const parseTextandTerms = () =>
    {
        // Strip periods and downcase text
        const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
        //console.log(parsedText)

        // Tokenize text
        uiobj.textArray = parsedText.split(/[^\w']+/)
        //console.log(uiobj.textArray)

        // Find term 1 - red
        findTermInParsedText(uiobj.term1, orangeMaterial)

        // Find term 2 - green
        findTermInParsedText(uiobj.term2, pinkMaterial)

        // Find term 3 - blue
        findTermInParsedText(uiobj.term3, aquaMaterial)
    }

    // Find term in tokenized text
    const findTermInParsedText = (term, material) =>
    {
        for (let i = 0; i < uiobj.textArray.length; i++)
        {
            //console.log(uiobj.textArray[i])
            if(uiobj.textArray[i] === term)
            {
                //console.log(uiobj.textArray[i], i)
                // convert i into n, which is a value between 0 and 20
                const n = (100 / uiobj.textArray.length) * i * 0.2

                // call drawCube function using converted n value
                //drawCube(n, material)

                // call drawCube function 5 times using converted n value
                for(let a = 0; a < 5; a++)
                {
                    drawCube(n, material)
                }
            }
        }
    }

    // Load source text
    fetch("https://raw.githubusercontent.com/amephraim/nlp/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer's%20Stone.txt")
        .then(response => response.text())
        .then((data) =>
        {
            uiobj.text = data
            parseTextandTerms()
        }
        )

/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Orbit Controls
    controls.update()

    // Camera rotation
    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16
    }

    // Rotate cubes
    if(uiobj.animateBubbles)
    {
         for(let i = 0; i < scene.children.length; i++)
        {
            if(scene.children[i].type === "Mesh")
            {
                scene.children[i].scale.x = Math.sin(elapsedTime * scene.children[i].blerg)
                scene.children[i].scale.y = Math.sin(elapsedTime * scene.children[i].blerg)
                scene.children[i].scale.z = Math.sin(elapsedTime * scene.children[i].blerg)
            }
        }
    }

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()
