// import GSAP
import gsap from "gsap";


// import css
import './style.css'

// import three

import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";

import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

// import gui

import * as dat from "dat.gui";
console.log(dat);

console.log(gsap);

// gui

const gui = new dat.GUI();

const world = {
    plane: {
        width: 19,
        height: 19,
        widthSegments: 31,
        heightSegments: 31,
    },
};
gui.add(world.plane, "width", 1, 50).onChange(generatePlane);

gui.add(world.plane, "height", 1, 50).onChange(generatePlane);

gui.add(world.plane, "widthSegments", 1, 50).onChange(generatePlane);

gui.add(world.plane, "heightSegments", 1, 50).onChange(generatePlane);

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    );

    // vertices for loop in gui

    const { array } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];

        array[i + 2] = z + Math.random();
    }

    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4);
    }

    planeMesh.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
}

// scene & camera
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
);

// renderer

const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// scene.add(mesh)
new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true,
});

console.log(planeGeometry);
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

console.log(planeMesh.geometry.attributes.position.array);

// vertices for loop

const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();

    // console.log(array[i])
}

// Colors

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
}

planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

// stars

const starGeometry = new THREE.BufferGeometry();

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
});

const starVerticies = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVerticies.push(x, y, z);
}
console.log(starVerticies);

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVerticies, 3)
);
console.log(starGeometry);
console.log(starMaterial);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// star end

const mouse = {
    x: undefined,
    y: undefined,
};

// animate

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(planeMesh);

        if (intersects.length > 0) {
            const { color } = intersects[0].object.geometry.attributes;

            // vertice 1
            color.setX(intersects[0].face.a, 0.1);
            color.setY(intersects[0].face.a, 0.5);
            color.setZ(intersects[0].face.a, 1);
            // vertice 2
            color.setX(intersects[0].face.b, 0.1);
            color.setY(intersects[0].face.b, 0.5);
            color.setZ(intersects[0].face.b, 1);
            // vertice 3
            color.setX(intersects[0].face.c, 0.1);
            color.setY(intersects[0].face.c, 0.5);
            color.setZ(intersects[0].face.c, 1);

            intersects[0].object.geometry.attributes.color.needsUpdate = true;

            const initialColor = {
                r: 0,
                g: 0.19,
                b: 0.4,
            };

            const hoverColor = {
                r: 0.1,
                g: 0.5,
                b: 1,
            };

            gsap.to(hoverColor, {
                r: initialColor.r,
                g: initialColor.g,
                b: initialColor.b,
                onUpdate: () => {
                    // vertice 1
                    color.setX(intersects[0].face.a, hoverColor.r);
                    color.setY(intersects[0].face.a, hoverColor.g);
                    color.setZ(intersects[0].face.a, hoverColor.b);
                    // vertice 2
                    color.setX(intersects[0].face.b, hoverColor.r);
                    color.setY(intersects[0].face.b, hoverColor.g);
                    color.setZ(intersects[0].face.b, hoverColor.b);
                    // vertice 3
                    color.setX(intersects[0].face.c, hoverColor.r);
                    color.setY(intersects[0].face.c, hoverColor.g);
                    color.setZ(intersects[0].face.c, hoverColor.b);
                    color.needsUpdate = true;
                },
            });
        }

        stars.rotation.x += 0.0005;
    }
}

animate();

addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});


{ /* button and camera listener */ }


document.querySelector('#viewWorkBtn').addEventListener('click', (e) => {
    e.preventDefault()
    gsap.to('#container', { opacity: 0 })

    gsap.to(camera.position, {
        z: 2,
        ease: "power3.inOut",
        duration: 1.5
    })
    gsap.to(camera.rotation, {
        x: 1.57,
        ease: "power3.inOut",
        duration: 1.5
    })
    gsap.to(camera.position, {
        y: 1000,
        ease: "power3.inOut",
        duration: 1.5,
        delay: 1.5,
        onComplete: () => {
            window.location = 'https://william.petradesain.com/landing.html'
        }
    })
})


// resize windows

addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()


    camera.aspect = innerWidth / innerHeight
    renderer.setSize(innerWidth, innerHeight);
})


// switch url when animation is over