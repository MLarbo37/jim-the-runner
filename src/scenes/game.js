import { makeBug } from "../entities/bug";
import { makeJim } from "../entities/jim";
import { makeRing } from "../entities/ring";
import k from "../kaplayCtx";

export default function game() {
    k.setGravity(3100);
    const citySfx = k.play("city", {volume: 0.2, loop: true})

    const bgPieceWidth = 1920;
    const platformWidth = 1280;
    const bgPieces = [
        k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
        k.add([k.sprite("chemical-bg"), k.pos(bgPieceWidth, 0), k.scale(2), k.opacity(0.8)])
    ];
    const platforms = [
        k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
        k.add([k.sprite("platforms"), k.pos(platformWidth, 450), k.scale(4)])
    ];

    let score = 0;
    let scoreMultiplier = 0;

    const scoreText = k.add([
        k.text("SCORE : 0 ", {font: "mania", size: 72}),
        k.pos(20, 20),
    ])

    const jim = makeJim(k.vec2(200, 747));
    jim.setControls();
    jim.setEvents();
    jim.onCollide("enemy", (enemy) => {
        if (!jim.isGrounded()) {
            k.play("destroy", {volume: 0.5});
            k.play("hyper-ring", {volume: 0.5});
            k.destroy(enemy);
            jim.play("jump");
            jim.jump();
            scoreMultiplier += 1;
            score += 10 * scoreMultiplier;
            scoreText.text = `SCORE : ${score}`;
            if (scoreMultiplier === 1) jim.ringCollectUI.text = "+10";
            if (scoreMultiplier > 1) jim.ringCollectUI.text = `x${scoreMultiplier}`;
            k.wait(1, () => (jim.ringCollectUI.text = ""));
            return;
        }
        k.play("hurt", {volume: 0.5});
        k.setData("current-score", score);
        k.go("gameover", citySfx);
    });
    jim.onCollide("ring", (ring) => {
        k.play("ring", {volume: 0.5});
        k.destroy(ring);
        score++;
        scoreText.text = `SCORE : ${score}`;
        jim.ringCollectUI.text = "+1";
        k.wait(1, () => (jim.ringCollectUI.text = ""));
    })

    const spawnBug = () => {
        const bug = makeBug(k.vec2(1950, 773));
        bug.onUpdate(() => {
            if (gameSpeed < 3000) {
                bug.move(-(gameSpeed + 300), 0);
                return;
            }
            bug.move(-gameSpeed, 0);
        });

        bug.onExitScreen(() => {
            if (bug.pos.x < 0) {
                k.destroy(bug);
            }
        });

        const waitTime = k.rand(0.5, 2.5)
        k.wait(waitTime, spawnBug)
    };
    spawnBug();

    const spawnRing = () => {
        const ring = makeRing(k.vec2(1950,745));
        ring.onUpdate(() => {
            // if (gameSpeed < 3000) {
            //     ring.move(-(gameSpeed + 300), 0);
            //     return;
            // }
            ring.move(-gameSpeed, 0);
        });

        ring.onExitScreen(() => {
            if (ring.pos.x < 0) {
                k.destroy(ring);
            }
        });

        const waitTime = k.rand(0.5, 3)
        k.wait(waitTime, spawnRing)
    }
    spawnRing();

    let gameSpeed = 300;
    k.loop(10, () => {
        gameSpeed += 50
    });

    k.add([
        k.rect(1920, 300),
        k.opacity(0),
        k.area(),
        k.pos(0, 832),
        k.body({isStatic: true})
    ]);

    k.onUpdate(() => {
        if (jim.isGrounded()) scoreMultiplier = 0;
        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }

        bgPieces[0].move(-100, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (platforms[1].pos.x < 0) {
            platforms[0].moveTo(platforms[1].pos.x + platformWidth * 4, 450);
            platforms.push(platforms.shift());
        }

        platforms[0].move(-gameSpeed, 0);
        platforms[1].moveTo(platforms[0].pos.x + platformWidth * 4, 450);
    })
}