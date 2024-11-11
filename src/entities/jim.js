import k from "../kaplayCtx";

export function makeJim(pos) {
    const jim = k.add([
        k.sprite("jim", {anim: "run"}),
        k.scale(4),
        k.area(),
        k.anchor("center"),
        k.pos(pos),
        k.body({ jumpForce: 1700 }),
        {
            ringCollectUI: null,
            setControls: () => {
                k.onButtonPress("jump", () => {
                    if (jim.isGrounded()) {
                        jim.play("jump");
                        jim.jump();
                        k.play("jump", { volume: 0.5 });
                    }
                });
            },
            setEvents: () => {
                jim.onGround(() => {
                    jim.play("run")
                });
            }
        }
    ]);

    jim.ringCollectUI = jim.add([
        k.text("", {font: "mania", size: 24}),
        k.color(255, 255, 0),
        k.anchor("center"),
        k.pos(30, -10)
    ]);
    return jim;
}