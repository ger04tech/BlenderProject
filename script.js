import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- Configuración Básica ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Colores base para la niebla y el piso (Modo Oscuro)
const darkColor = 0x1e293b;
const lightColor = 0xe2e8f0; // Color gris claro para modo luz

// Niebla inicial
scene.fog = new THREE.Fog(darkColor, 10, 50);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5, 4, 8); // Posición inicial de la cámara

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Habilitar sombras
container.appendChild(renderer.domElement);

// --- Controles (OrbitControls) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Movimiento suave
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2; // No permitir mirar desde abajo del piso
controls.minDistance = 3;
controls.maxDistance = 15;

// --- Luces ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 10, 7);
mainLight.castShadow = true;
scene.add(mainLight);

// --- Creación del Escenario ---

// 1. Piso
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: darkColor,
    roughness: 0.8,
    metalness: 0.2
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// --- CARGA DEL MODELO 3D ---
let setupGroup = null; // Variable para controlar tu modelo

const loader = new GLTFLoader();

// Intentamos cargar el modelo
loader.load(
    './assets/SetupProyectFinal.glb', // <--- RUTA IMPORTANTE
    function (gltf) {
        const model = gltf.scene;
        setupGroup = model;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(model);

        // Ocultar pantalla de carga cuando termina
        const loaderDiv = document.getElementById('loader');
        if (loaderDiv) {
            loaderDiv.style.opacity = 0;
            setTimeout(() => loaderDiv.remove(), 500);
        }
    },
    undefined, // Progreso (opcional)
    function (error) {
        console.error('Error cargando el modelo:', error);
        alert("¡Error! No encuentro el archivo 'assets/SetupProyectFinal.glb'. Verifica el nombre.");

        // Si falla, quitamos el loader para que no se quede la pantalla blanca
        document.getElementById('loader').style.display = 'none';
    }
);

// --- Interactividad (Modo Luz / Modo Oscuro) ---
const btn = document.getElementById('toggle-lights');

if (btn) { // Verificamos que el botón exista para evitar errores
    btn.addEventListener('click', () => {
        // Alternar clase CSS en el body
        document.body.classList.toggle('light-mode');

        // Verificar si el modo luz está activado
        const isLightMode = document.body.classList.contains('light-mode');

        if (isLightMode) {
            // CAMBIAR A CLARO
            btn.textContent = "🌙 Modo Oscuro";

            // Actualizar colores de Three.js para que coincidan con el fondo blanco
            scene.fog.color.setHex(lightColor);
            plane.material.color.setHex(lightColor);

            // Ajustar estilo del botón
            btn.style.borderColor = "#0284c7";
            btn.style.color = "#0284c7";

        } else {
            // CAMBIAR A OSCURO
            btn.textContent = "☀️ Modo Luz";

            // Restaurar colores oscuros de Three.js
            scene.fog.color.setHex(darkColor);
            plane.material.color.setHex(darkColor);

            // Restaurar estilo del botón
            btn.style.borderColor = "#38bdf8";
            btn.style.color = "#38bdf8";
        }
    });
}

// --- Loop de Animación ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// --- Responsive ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();