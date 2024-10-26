import k from "../kaplayCtx";

export function makeJim(pos) {
    const jim = k.add([
        k.sprite("jim", {anim: "run"}),
        k.scale(4),
        k.area(),
        k.anchor("center"),
        k.pos(pos)
    ]);
}