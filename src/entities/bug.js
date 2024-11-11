import k from "../kaplayCtx";

export function makeBug(pos) {
    const bug = k.add([
        k.sprite("bug", { anim: "run"}),
        k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32)}),
        k.scale(4),
        k.anchor("center"),
        k.pos(pos),
        k.offscreen(),
        "enemy"
    ]);
    return bug;

}