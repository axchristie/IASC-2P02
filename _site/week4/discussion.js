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
renderer.localClippingEnabled = true

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

// testSphere
const geometry = new THREE.SphereGeometry(1)
const material = new THREE.MeshNormalMaterial({
	clippingPlanes: [ clippingPlane ],
	visible: false
})
const testSphere = new THREE.Mesh(geometry, material)

scene.add(testSphere)

// torus
const torusGeometry = new THREE.TorusGeometry(2)
const torusMaterial = new THREE.MeshNormalMaterial({
	clippingPlanes: [ clippingPlane ],
	visible: false
})
const torus = new THREE.Mesh(torusGeometry, torusMaterial)

scene.add(torus)

// torusKnot
const torusKnotGeometry = new THREE.TorusKnotGeometry(3, 0.6)
const torusKnotMaterial = new THREE.MeshNormalMaterial({
	clippingPlanes: [ clippingPlane ],
	visible: true
})
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)

scene.add(torusKnot)


/*******
** UI **
********/
// UI
const ui = new dat.GUI()

// UI Objects
/* TAKE ONE */
const uiObject = {}
uiObject.play = false
uiObject.rotateTorus = false
uiObject.moveTorus = false
uiObject.rotateTorusKnot = false
uiObject.moveTorusKnot = false

// Plane UI
const planeFolder = ui.addFolder('Plane')

planeFolder
    .add(planeMaterial, 'wireframe')

// testSphere UI
const sphereFolder = ui.addFolder('Sphere')

sphereFolder
	.add(material, 'visible')
	.name('Visible')

sphereFolder
    .add(uiObject, 'play')
    .name('Animate sphere')

sphereFolder
    .add(testSphere.position, 'y')
    .min(-5)
    .max(5)
    .step(0.1)
    .name('Height')

// torus UI
const torusFolder = ui.addFolder('Torus')

torusFolder
	.add(torusMaterial, 'visible')
	.name('Visible')

torusFolder
	.add(uiObject, 'rotateTorus')
	.name('Rotate')

torusFolder
	.add(uiObject, 'moveTorus')
	.name('Move')

// torusKnot UI
const torusKnotFolder = ui.addFolder('Torus Knot')

torusKnotFolder
	.add(torusKnotMaterial, 'visible')
	.name('Visible')

torusKnotFolder
	.add(uiObject, 'rotateTorusKnot')
	.name('Rotate')

torusKnotFolder
	.add(uiObject, 'moveTorusKnot')
	.name('Move')

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
        testSphere.position.y = Math.sin(elapsedTime * 0.4)
    }

	// Animate torus
	// Rotate
	if(uiObject.rotateTorus){
		torus.rotation.y = elapsedTime * 0.5
	}
	// Move
	if(uiObject.moveTorus){
		torus.position.y = Math.sin(elapsedTime * 0.4) * 2
	}

	// Animate torusKnot
	// Rotate
	if(uiObject.rotateTorusKnot){
		torusKnot.rotation.x = elapsedTime * 0.2
		torusKnot.rotation.y = elapsedTime * 0.2
		torusKnot.rotation.z = elapsedTime * 0.2
	}
	if(uiObject.moveTorusKnot){
		torusKnot.position.y = Math.sin(elapsedTime * 0.4) * 2
	}

    // Controls
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()
