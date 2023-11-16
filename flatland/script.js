import * as THREE from "three"

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
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/***********
** MESHES **
************/
// testSphere
const geometry = new THREE.SphereGeometry(1)
const material = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(geometry, material)

testSphere.position.set(0, 0, -3)
scene.add(testSphere)

/*******************
** ANIMATION LOOP **
********************/
// Animate
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()