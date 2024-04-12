import * as THREE from "three"
import { BoxLineGeometry } from "BoxLineGeometry"
import { XRButton } from "XRButton"

// Setup
const clock = new THREE.Clock()

let container
let camera, scene, raycaster, renderer

let room
let cube

init()
animate()

// Init
function init() {

	container = document.createElement('div')
	document.body.appendChild(container)

	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x505050)

	camera = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		10)
	camera.position.set(0, 1.6, 3)
	scene.add(camera)

	room = new THREE.LineSegments(
		new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
		new THREE.LineBasicMaterial({ color: 0xbcbcbc } )
	)
	scene.add(room)

	scene.add( new THREE.HemisphereLight( 0xa5a5a5, 0x898989, 3 ))

	const light = new THREE.DirectionalLight(0xffffff, 3)
	light.position.set(1, 1, 1).normalize()
	scene.add(light)

	// Test Cube
	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
	const cubeMaterial = new THREE.MeshNormalMaterial()
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
	cube.position.set(0, 1, -3)
	scene.add(cube)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.xr.enabled = true
	container.appendChild(renderer.domElement)

	window.addEventListener('resize', onWindowResize)

	document.body.appendChild(XRButton.createButton( renderer, { 'optionalFeatures': [ 'depth-sensing'] } ) )
}

// Resize
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}

// Animate
function animate() {
	renderer.setAnimationLoop(render)
}

// Render
function render() {
	const delta = clock.getDelta() * 60
	const elapsedTime = clock.getElapsedTime()

	renderer.render(scene, camera)

	cube.position.y = (Math.sin(elapsedTime) * 0.2) + 1
}
