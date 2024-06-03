function playSound(sound) {
    switch (sound) {
        case game.audio.blockCollisionSound:
            if (game.audio.sfx) { sound.play(); }
            break;
        case game.audio.failCollisionSound:
            if (game.audio.sfx) { sound.play(); }
            break;
        case game.audio.laserProjectileSound:
            if (game.audio.sfx) { sound.play(); }
            break;
        case game.audio.laserProjectileExplosionSound:
            if (game.audio.sfx) { sound.play(); }
            break;
        case game.audio.pickupCollisionSound:
            if (game.audio.sfx) { sound.play(); }
            break;
        case game.audio.playerCollisionSound:
            if (game.audio.sfx) { sound.play(); }
            break;
        default:
            break;
    }
}