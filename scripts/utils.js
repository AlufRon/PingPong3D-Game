// Utility functions for the game
const UTILS = {
    // Constants for game setup
    TABLE_WIDTH: 4,
    TABLE_LENGTH: 8,
    TABLE_HEIGHT: 0.1,
    PADDLE_WIDTH: 0.3,
    PADDLE_HEIGHT: 0.3,
    PADDLE_DEPTH: 0.05,
    BALL_RADIUS: 0.1,
    
    // Convert Three.js vector to Cannon.js vector
    cannonVector: function(threeVector) {
        return new CANNON.Vec3(threeVector.x, threeVector.y, threeVector.z);
    },

    // Convert Cannon.js vector to Three.js vector
    threeVector: function(cannonVector) {
        return new THREE.Vector3(cannonVector.x, cannonVector.y, cannonVector.z);
    },

    // Clamp a value between min and max
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Calculate AI paddle movement
    calculateAIMove: function(ballPosition, paddlePosition, difficulty = 0.8) {
        const targetZ = ballPosition.z;
        const currentZ = paddlePosition.z;
        const diff = targetZ - currentZ;
        return currentZ + diff * difficulty;
    }
};