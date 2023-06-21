import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()


const clock = new THREE.Clock()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

//Loader
const loader = new GLTFLoader()
loader.load('/models/scene.gltf', (model) => {
    scene.add(model.scene)
    model.scene.position.set(0, -1.5, 0)

    const ghostMove = () => {
        const elapsedTime = clock.getElapsedTime()
        const ghost1Radius = 4

        model.scene.children[0].position.x = Math.cos(elapsedTime * 0.5) * ghost1Radius
        model.scene.children[0].position.y =Math.abs(Math.sin(elapsedTime)) * 0.2 + 0.3
        model.scene.children[0].position.z = Math.sin(elapsedTime * 0.5) * ghost1Radius
        model.scene.children[0].rotation.z = -elapsedTime * 0.5
        window.requestAnimationFrame(ghostMove)
    }

    ghostMove()
})

// loader.load('/models/scene.gltf', (model) => {
//     scene.add(model.scene)
//     model.scene.position.set(0, -1.5, 0)
//     model.scene.rotation.y = Math.PI
//     console.log(model.scene)
//     const ghostMove = () => {
//         const elapsedTime = clock.getElapsedTime()
//         const ghost1Radius = 6

//         model.scene.children[0].position.x = Math.cos(-elapsedTime * 0.32) * ghost1Radius
//         model.scene.children[0].position.y =Math.abs(Math.sin(elapsedTime)) * 0.2 + 0.3
//         model.scene.children[0].position.z = Math.sin(-elapsedTime * 0.32) * ghost1Radius
//         model.scene.children[0].rotation.z += 0.005
//         window.requestAnimationFrame(ghostMove)
//     }
//     ghostMove()
// })




//Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessexture = textureLoader.load('/textures/door/roughness.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

//walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
    })
)
walls.castShadow = true
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
house.add(walls)
walls.position.y = 2.5/2

//roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1 ,4),
    new THREE.MeshStandardMaterial({
        color: '#b35f45'
    })
)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI / 4
scene.add(roof)


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
     })
)
floor.receiveShadow = true

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

//Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.12,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessexture
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 0.9
door.position.z = 2 + 0.01


scene.add(door)

//Bushes
const bushGeo = new THREE.SphereGeometry(1, 16, 16)
const bushMat = new THREE.MeshStandardMaterial({color: '#89c854'})

const bush1 = new THREE.Mesh(bushGeo, bushMat)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.8, 0.2, 2.2)
bush1.castShadow = true

const bush2 = new THREE.Mesh(bushGeo, bushMat)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(2.4, 0.1, 2.1)
bush2.castShadow = true

const bush3 = new THREE.Mesh(bushGeo, bushMat)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-1.8, 0.1, 2.1)
bush3.castShadow = true

const bush4 = new THREE.Mesh(bushGeo, bushMat)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-2, 0.05, 2.55)
bush4.castShadow = true

house.add(bush1, bush2, bush3, bush4)

//Grave Yard
const graves = new THREE.Group()
scene.add(graves)

const graveGeo = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMat = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for(let i=0; i<40; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh(graveGeo, graveMat)
    grave.castShadow = true
    grave.position.set(x, 0.3, z)
    grave.rotation.z = (Math.random() - 0.5) * 0.25
    grave.rotation.y = (Math.random() - 0.5) * 0.25
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)

scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)

moonLight.castShadow = true

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

scene.add(moonLight)

//Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 6)

doorLight.castShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Ghosts
*/
const ghost1 = new THREE.PointLight('#ff2a00', 4, 2)

ghost1.castShadow = true

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)

ghost2.castShadow = true

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 3, 3)

ghost3.castShadow = true

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Animate
 */


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.abs(Math.sin(elapsedTime)) * 0.2

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 6
    ghost2.position.z = Math.sin(ghost2Angle) * 6
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (8 + Math.cos(elapsedTime))
    ghost3.position.z =Math.sin(ghost3Angle) * (8 + Math.cos(elapsedTime))
    ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()