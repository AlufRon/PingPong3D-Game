class Game {
    constructor() {
        this.renderer = new GameRenderer();
        this.world = new CANNON.World();
        this.score = { player: 0, ai: 0 };
        this.setupPhysics();
        this.createGameObjects();
        this.setupEventListeners();
    }

    setupPhysics() {
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
    }

    createGameObjects() {
        // Create table
        this.table = this.renderer.createTable();
        this.renderer.scene.add(this.table);
        const tableBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(UTILS.TABLE_WIDTH/2, UTILS.TABLE_HEIGHT/2, UTILS.TABLE_LENGTH/2))
        });
        this.world.addBody(tableBody);

        // Create paddles
        this.playerPaddle = this.renderer.createPaddle();
        this.aiPaddle = this.renderer.createPaddle();
        this.playerPaddle.position.set(-UTILS.TABLE_WIDTH/2 - 0.5, UTILS.PADDLE_HEIGHT/2, 0);
        this.aiPaddle.position.set(UTILS.TABLE_WIDTH/2 + 0.5, UTILS.PADDLE_HEIGHT/2, 0);
        this.renderer.scene.add(this.playerPaddle, this.aiPaddle);

        // Create ball
        this.ball = this.renderer.createBall();
        this.ball.position.set(0, UTILS.BALL_RADIUS + UTILS.TABLE_HEIGHT, 0);
        this.renderer.scene.add(this.ball);
        
        this.ballBody = new CANNON.Body({
            mass: 0.1,
            shape: new CANNON.Sphere(UTILS.BALL_RADIUS)
        });
        this.ballBody.position.copy(UTILS.cannonVector(this.ball.position));
        this.world.addBody(this.ballBody);
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            const relativeZ = (e.clientY / window.innerHeight) * 2 - 1;
            const paddleZ = UTILS.clamp(
                relativeZ * UTILS.TABLE_LENGTH/2,
                -UTILS.TABLE_LENGTH/2 + UTILS.PADDLE_HEIGHT/2,
                UTILS.TABLE_LENGTH/2 - UTILS.PADDLE_HEIGHT/2
            );
            this.playerPaddle.position.z = paddleZ;
        });

        window.addEventListener('resize', () => this.renderer.handleResize());
    }

    updateAI() {
        const aiZ = UTILS.calculateAIMove(this.ball.position, this.aiPaddle.position);
        this.aiPaddle.position.z = UTILS.clamp(
            aiZ,
            -UTILS.TABLE_LENGTH/2 + UTILS.PADDLE_HEIGHT/2,
            UTILS.TABLE_LENGTH/2 - UTILS.PADDLE_HEIGHT/2
        );
    }

    updateScore(winner) {
        if (winner === 'player') this.score.player++;
        else this.score.ai++;
        
        document.querySelector('.scoreboard').textContent = 
            `Player: ${this.score.player} \u00A0\u00A0 AI: ${this.score.ai}`;
    }

    resetBall() {
        this.ballBody.position.set(0, UTILS.BALL_RADIUS + UTILS.TABLE_HEIGHT, 0);
        this.ballBody.velocity.set(
            (Math.random() > 0.5 ? 1 : -1) * 5,
            2,
            (Math.random() * 2 - 1) * 3
        );
    }

    checkBoundaries() {
        const ballX = this.ball.position.x;
        if (Math.abs(ballX) > UTILS.TABLE_WIDTH + 1) {
            this.updateScore(ballX < 0 ? 'ai' : 'player');
            this.resetBall();
        }
    }

    update() {
        this.world.step(1/60);
        this.ball.position.copy(UTILS.threeVector(this.ballBody.position));
        this.ball.quaternion.copy(UTILS.threeVector(this.ballBody.quaternion));
        
        this.updateAI();
        this.checkBoundaries();
        this.renderer.render();
    }
}