class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.setupRenderer();
        this.setupLighting();
        this.setupCamera();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light with shadows
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(10, 10, 0);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
    }

    setupCamera() {
        this.camera.position.set(0, 8, 0);
        this.camera.lookAt(0, 0, 0);
    }

    createTable() {
        const tableGeometry = new THREE.BoxGeometry(
            UTILS.TABLE_WIDTH, 
            UTILS.TABLE_HEIGHT, 
            UTILS.TABLE_LENGTH
        );
        const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x1B5E20 });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.receiveShadow = true;
        return table;
    }

    createPaddle() {
        const paddleGeometry = new THREE.BoxGeometry(
            UTILS.PADDLE_WIDTH,
            UTILS.PADDLE_HEIGHT,
            UTILS.PADDLE_DEPTH
        );
        const paddleMaterial = new THREE.MeshPhongMaterial({ color: 0xC62828 });
        const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddle.castShadow = true;
        return paddle;
    }

    createBall() {
        const ballGeometry = new THREE.SphereGeometry(UTILS.BALL_RADIUS, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.castShadow = true;
        return ball;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}