const canvas = document.querySelector("#main-canvas") as HTMLCanvasElement


const rend = new NodeRenderer(canvas, 3, true);

rend.SetRenderingStatus(true)

let i = 0;


class test extends DrawableObject implements OnHand, MouseDown {
    NAME = "hello"

    width = 400;
    height = 600;
    x = 0;
    y = 0;
    DifferentX = 0;
    DifferentY = 0;

    Text = "null";

    constructor(Description: string = "null") {
        super()
        this.Text = Description;
        this.NAME = this.NAME + i.toString();
        i++;
    }

    protected Generate_Rounded_Rectangle(x: number, y: number, width: number, height: number, radius: number) {
        let p = new Path2D()
        p.moveTo(x, y + radius)
        p.quadraticCurveTo(x, y, x + radius, y)
        p.lineTo(x + width - radius, y);
        p.quadraticCurveTo(x + width, y, x + width, y + radius)
        p.lineTo(x + width, y + height - radius)
        p.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        p.lineTo(x + radius, y + height)
        p.quadraticCurveTo(x, y + height, x, y + height - radius)
        p.closePath()
        return p;
    }


    DRAW(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#00f5d4";

        let r = 10;
        let d = 50;
        (() => {
            let up = new Path2D()
            up.moveTo(this.x + r, this.y)
            up.lineTo(this.x + this.width - r, this.y)
            up.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + r)
            up.lineTo(this.x + this.width, this.y + d)
            up.lineTo(this.x, this.y + d)
            up.lineTo(this.x, this.y + r)
            up.quadraticCurveTo(this.x, this.y, this.x + r, this.y)
            up.closePath()
            ctx.fill(up)
        })();

        (() => {
            ctx.fillStyle = "black"
            let mid = new Path2D();
            mid.moveTo(this.x, this.y + d)
            mid.lineTo(this.x + this.width, this.y + d)
            mid.lineTo(this.x + this.width, this.y + this.height - r)
            mid.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - r, this.y + this.height)
            mid.lineTo(this.x + r, this.y + this.height)
            mid.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - r)
            mid.closePath()
            ctx.fill(mid)
        })();

        (() => {
            let TextSize = 50;
            ctx.fillStyle = "#353535"
            ctx.font = TextSize + "px Roboto"
            ctx.fillText("INFO", this.x + 5, this.y + TextSize / 2 + d / 2 - 2)
        })();

        (() => { // description set up
            let TextSize = 40;
            let padding = 20;
            ctx.fillStyle = "white"
            ctx.font = TextSize + "px Roboto"
            ctx.fillText(this.Text, this.x + 5, this.y + d + r + TextSize / 2 + padding)

        })();

    }

    MouseDown(ctx: CanvasRenderingContext2D, ev: MouseEvent): void {
        this.DifferentX = this.x - ev.pageX * NodeRenderer.RenderingScale
        this.DifferentY = this.y - ev.pageY * NodeRenderer.RenderingScale
    }

    OnHand(ctx: CanvasRenderingContext2D, mouse: MousePostition): void {
        this.x = mouse.x + this.DifferentX
        this.y = mouse.y + this.DifferentY

        let p = this.Generate_Rounded_Rectangle(this.x, this.y, this.width, this.height, 10)
        ctx.strokeStyle = "white"
        ctx.lineWidth = 10
        ctx.stroke(p)
    }
}


let first = new test("Hi, Click 'W' to make more me!")
first.width += 300;
rend.AddRendering(first)
addEventListener("keyup", (ev) => {
    if (ev.key == "w") {
        let another = new test("Wow! You did it!!")
        rend.AddRendering(another)
    }
})

addEventListener("contextmenu", (ev) => {
    ev.preventDefault()
})