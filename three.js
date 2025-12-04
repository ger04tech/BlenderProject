// Este archivo crea el "Mapa de Importación" necesario para que funcione Three.js desde la CDN
// Se inyecta dinámicamente usando JavaScript

const importMap = {
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
};

const im = document.createElement('script');
im.type = 'importmap';
im.textContent = JSON.stringify(importMap);
document.head.appendChild(im);