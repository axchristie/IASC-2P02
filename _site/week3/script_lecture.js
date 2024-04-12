import * as THREE from "three"

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
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(0, 0, 5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

/***********
** MESHES **
************/
// testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

//scene.add(testSphere)

// testCube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshNormalMaterial()
const testCube = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(testCube)

// torus
const torusGeometry = new THREE.TorusGeometry(2, 0.2)
const torusMaterial = new THREE.MeshNormalMaterial()
const torus = new THREE.Mesh(torusGeometry, torusMaterial)

scene.add(torus)

/*******************
** ANIMATION LOOP **
********************/
//Animate
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate testSphere
        //testSphere.position.z = Math.sin(elapsedTime)
    // Make it move faster
        //testSphere.position.z = Math.sin(elapsedTime * 10)
    // Make it move slower
        //testSphere.position.z = Math.sin(elapsedTime * 0.5)
    // Make it travel farther
        //testSphere.position.z = Math.sin(elapsedTime) * 10
    // Make it travel shorter
        //testSphere.position.z = Math.sin(elapsedTime) * 0.5
    // Make it travel faster and shorter
        //testSphere.position.z = Math.sin(elapsedTime * 10) * 0.5

   // Animate testCube
        // Rotate cube
        testCube.rotation.x = elapsedTime
        testCube.rotation.y = elapsedTime
        testCube.rotation.z = elapsedTime

        // Scale cube
        testCube.scale.x = Math.sin(elapsedTime * 0.5) * 2
        testCube.scale.y = Math.sin(elapsedTime * 0.5) * 2
        testCube.scale.z = Math.sin(elapsedTime * 0.5) * 2

	// Rotate Torus
	torus.rotation.y = elapsedTime

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()
