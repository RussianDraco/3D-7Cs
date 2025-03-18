AFRAME.registerComponent('player-movement', {
    init: function () {
        this.keys = {};
        this.speed = 0.05;
        this.turnSpeed = 1;
        this.cameraDistance = -6;
        this.cameraHeight = 6;
        this.player = this.el;
        this.camera = document.querySelector('#player-camera');

        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    },

    tick: function () {
        let position = this.player.getAttribute('position');
        let rotation = this.player.getAttribute('rotation');

        if (this.keys['KeyW']) {
            position.z += Math.cos(THREE.MathUtils.degToRad(rotation.y)) * this.speed;
            position.x += Math.sin(THREE.MathUtils.degToRad(rotation.y)) * this.speed;
        }
        if (this.keys['KeyS']) {
            position.z -= Math.cos(THREE.MathUtils.degToRad(rotation.y)) * this.speed;
            position.x -= Math.sin(THREE.MathUtils.degToRad(rotation.y)) * this.speed;
        }
        if (this.keys['KeyA']) {
            rotation.y += this.turnSpeed;
        }
        if (this.keys['KeyD']) {
            rotation.y -= this.turnSpeed;
        }

        this.player.setAttribute('position', position);
        this.player.setAttribute('rotation', rotation);

        let cameraX = position.x + Math.sin(THREE.MathUtils.degToRad(rotation.y)) * this.cameraDistance;
        let cameraZ = position.z + Math.cos(THREE.MathUtils.degToRad(rotation.y)) * this.cameraDistance;
        let cameraY = position.y + this.cameraHeight;

        this.camera.setAttribute('position', { x: cameraX, y: cameraY, z: cameraZ });

    }
});

AFRAME.registerShader('wave-shader', {
    schema: {
        time: { type: 'time', is: 'uniform' }, // Time variable for animation
        color: { type: 'color', is: 'uniform', default: '#0077be' } // Water color
    },

    vertexShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
            vUv = uv;
            vec3 pos = position;
            float waveHeight = 0.5 * sin(pos.x * 0.2 + time * 0.002) + 0.3 * cos(pos.y * 0.2 + time * 0.002);
            pos.z += waveHeight;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,

    fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        
        void main() {
            float waveShade = 0.5 + 0.5 * sin(vUv.y * 20.0);
            gl_FragColor = vec4(color * waveShade, 1.0);
        }
    `
});


document.querySelector('#player').setAttribute('player-movement', '');
