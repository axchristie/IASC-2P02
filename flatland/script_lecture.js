import * as THREE from "three"
import * as dat from "lil-gui"
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
scene.background = new THREE.Color('gray')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(2, 2, 4)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.localClippingEnabled = false

/***********
** MESHES **
************/
// Clipping plane
const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: true
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)

plane.rotation.x = Math.PI * 0.5
scene.add(plane)

// Torus
const geometry = new THREE.TorusGeometry(2, 0.5)
const material = new THREE.MeshNormalMaterial({
    clippingPlanes: [ clippingPlane ]
})
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

/************* 
** CONTROLS **
*************/
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*******
** UI **
********/
// UI
const ui = new dat.GUI()

// UI Objects
/* TAKE ONE */
const uiObject = {
    play: false,
    rotate: false,
    speed: 0.5,
    distance: 2,
    rotationSpeed: 1,
}

uiObject.reset = () =>
{
    uiObject.play = false
    uiObject.rotate = false
    uiObject.speed = 0.5
    uiObject.distance = 2
    uiObject.rotationSpeed = 1
}

// Plane UI
const planeFolder = ui.addFolder('Plane')

planeFolder
    .add(planeMaterial, 'wireframe')
    .name('Wireframe')

planeFolder
    .add(renderer, 'localClippingEnabled')
    .name('Clip traveler')

// Rotation Folder
const rotationFolder = ui.addFolder('Traveler Rotation')

rotationFolder
    .add(uiObject, 'rotationSpeed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Rotation Speed')
    .listen()


 rotationFolder
    .add(uiObject, 'rotate')
    .name('Rotate traveler')
    .listen()


// Travel Folder
const travelFolder = ui.addFolder('Traveler Journey')

travelFolder
    .add(uiObject, 'speed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Travel Speed')
    .listen()


travelFolder
    .add(uiObject, 'distance')
    .min(0.1)
    .max(10)
    .step(0.5)
    .name('Travel Distance')
    .listen()


travelFolder
    .add(uiObject, 'play')
    .name('Move traveler')
    .listen()

// Reset Folder
const resetFolder = ui.addFolder('Reset')

resetFolder
    .add(uiObject, 'reset')
    .name('Reset Traveler')


/*******************
** ANIMATION LOOP **
********************/
// Animate
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    //plane.rotation.x = Math.PI * elapsedTime * 0.1

    // Animate sphere
    //console.log(uiObject.play)
    if(uiObject.play)
    {
        torus.position.y = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance
    }

    if(uiObject.rotate)
    {
        torus.rotation.x = elapsedTime * uiObject.rotationSpeed
        torus.rotation.y = elapsedTime * uiObject.rotationSpeed
    }

    // Controls
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()