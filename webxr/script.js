import * as THREE from "three"
import { OrbitControls } from "OrbitControls"
import { BoxLineGeometry } from "BoxLineGeometry"
import { XRButton } from "XRButton"
import { XRControllerModelFactory } from "XRControllerModelFactory"

// Setup
const clock = new THREE.Clock()

let container
let camera, scene, raycaster, renderer
let controller1, controller2
let controllerGrip1, controllerGrip2

let room
let cube
let controls

let selected = false

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
	camera.position.set(0, 1.6, -1)
	scene.add(camera)

	controls = new OrbitControls(camera, container)
	controls.target.set(0, 1.6, 0)
	controls.update()

	room = new THREE.LineSegments(
		new BoxLineGeometry(2, 6, 2, 10, 30, 10).translate(0, 3, 0),
		new THREE.LineBasicMaterial({ color: 0xbcbcbc } )
	)
	scene.add(room)

	//scene.add( new THREE.HemisphereLight( 0xa5a5a5, 0x898989, 3 ))

	const light = new THREE.DirectionalLight(0xffffff, 3)
	light.position.set(0, 5, 0)
	light.lookAt(0, 0, 0)
	light.castShadow = true
	light.shadow.mapSize.set(4096, 4096)
	scene.add(light)

	// Test Cube
	const cubeGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25)
	const cubeMaterial = new THREE.MeshNormalMaterial()
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
	cube.position.set(0, 1, 0.5)
	cube.castShadow = true
	scene.add(cube)

	// Floor
	const floorGeometry = new THREE.PlaneGeometry(2, 2)
	const floorMaterial = new THREE.MeshStandardMaterial({
		color: new THREE.Color('grey'),
		side: THREE.DoubleSide
	})
	const floor = new THREE.Mesh(floorGeometry, floorMaterial)
	floor.rotation.x = Math.PI * 0.5
	floor.position.set(0, 0.1, 0)
	floor.receiveShadow = true
	scene.add(floor)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.shadowMap.enabled = true
	renderer.xr.enabled = true
	container.appendChild(renderer.domElement)

	window.addEventListener('resize', onWindowResize)

	document.body.appendChild(XRButton.createButton( renderer, { 'optionalFeatures': [ 'depth-sensing'] } ) )

	// Controllers
	controller1 = renderer.xr.getController(0)
	controller1.addEventListener('selectstart', onSelectStart)
	controller1.addEventListener('selectend', onSelectEnd)
	scene.add(controller1)

	controller2 = renderer.xr.getController(1)
	controller2.addEventListener('selectstart', onSelectStart)
	controller2.addEventListener('selectend', onSelectEnd)
	scene.add(controller2)

	const controllerModelFactory = new XRControllerModelFactory()

	controllerGrip1 = renderer.xr.getControllerGrip(0)
	controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
	scene.add(controllerGrip1)

	controllerGrip2 = renderer.xr.getControllerGrip(1)
	controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
	scene.add(controllerGrip2)
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

// selectStart
function onSelectStart(event)
{
	selected = true
	//console.log(event.target)
}

// selectEnd
function onSelectEnd(event)
{
	selected = false
	//console.log(event.target)
}

// Render
function render() {
	const delta = clock.getDelta() * 60
	const elapsedTime = clock.getElapsedTime()

	renderer.render(scene, camera)

	//cube.position.y = (Math.sin(elapsedTime) * 0.2) + 1
	cube.rotation.x = elapsedTime * 0.2
	cube.rotation.y = elapsedTime * 0.2
	cube.rotation.z = elapsedTime * 0.2

	if(selected){
		cube.position.x = Math.sin(elapsedTime * 0.2) * 0.5
		cube.position.z = Math.cos(elapsedTime * 0.2) * 0.5
	}
}
