import * as THREE from "three"
import * as  dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/**********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('white')

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
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// Cube Materials
const redMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('red') })
const greenMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('green') })
const blueMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('blue') })

const drawCube = (i, material) =>
{
    const cube = new THREE.Mesh(cubeGeometry, material)
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = i - 10

    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI

    scene.add(cube)
}

drawCube(0, redMaterial)

/**********************
** UI & TEXT PARSERS **
***********************/
// uiobj
let preset = {}

const uiobj = {
    text: '',
    textArray: ''
}

// Text Parsers
// Load source text
fetch("https://raw.githubusercontent.com/amephraim/nlp/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer's%20Stone.txt")
    .then(response => response.text())
    .then((data) =>
    {
        uiobj.text = data
        parseTextandTerms()
    }
    )

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
        findTermInParsedText("cupboard", redMaterial)

        // Find term 2 - green
        findTermInParsedText("hat", greenMaterial)

        // Find term 3 - blue
        findTermInParsedText("broom", blueMaterial)
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

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()