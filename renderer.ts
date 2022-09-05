class NodeRenderer {
    private Canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private Rendings: DrawableObject[] = [];

    private AutoCanvasResizing: boolean;

    static RenderingScale: number;

    constructor(canvas: HTMLCanvasElement, scaleofrendering: number = 2, auto_canvas_resizing = true) {
        this.Canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.AutoCanvasResizing = auto_canvas_resizing;
        NodeRenderer.RenderingScale = scaleofrendering;
        this.LastTime = Date.now()
        this.LastFPS = Date.now()


        this.AddEventListeners()
    }

    private AddEventListeners() {
        addEventListener("mousedown", (ev) => { this.MouseDown(ev) });
        addEventListener("mouseup", (ev) => { this.MouseUp(ev) })
        addEventListener("mousemove", (ev) => { this.MouseMove(ev) })

    }

    AddRendering(obj: DrawableObject) {
        this.Rendings.push(obj)
    }


    private LoopStatus: boolean = false
    SetRenderingStatus(status: boolean) {
        if (status == true && this.LoopStatus == false) {
            this.LoopStatus = status;
            requestAnimationFrame(() => { this.LOOP() })
            return;
        }
        this.LoopStatus = status;
    }

    LastSize = {
        width: 0,
        height: 0
    }
    private ResizeCanvas(dev_mode = false) {
        if (!this.AutoCanvasResizing) return;
        if (this.Canvas.offsetHeight == this.LastSize.height && this.Canvas.offsetWidth == this.LastSize.width) return;
        this.Canvas.width = this.Canvas.offsetWidth * NodeRenderer.RenderingScale;
        this.Canvas.height = this.Canvas.offsetHeight * NodeRenderer.RenderingScale;
        if (dev_mode) console.log(this.Canvas.width + " - " + this.Canvas.height)
    }

    // MEASURE FUNCTIONS START
    private LastTime: number;
    private DeltaTime = 0;
    private LastFPS: number;
    private FPS = 0;

    private MeasureDeltaTime() {
        let now = Date.now()
        this.DeltaTime = now - this.LastTime
        this.LastTime = now;
    }

    private MeasureFPS_frames = 0;
    MeasureFPS() {
        if (Date.now() >= this.LastFPS + 1000) {
            this.LastFPS = Date.now()
            this.FPS = this.MeasureFPS_frames
            this.MeasureFPS_frames = 0;
        }
        this.MeasureFPS_frames++;
    }
    // MEASURE FUNCTIONS END





    private LOOP() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height)
        this.ResizeCanvas()
        this.MeasureFPS()
        this.MeasureDeltaTime()


        this.ctx.font = "200px Arial"
        this.ctx.fillStyle = "white"
        this.ctx.fillText(this.FPS.toString() + " FPS", 20, 200)

        this.Rendings.forEach((v, i) => { this.PrintableObjectLogic(v, i) })

        this.ExecuteHoldedItem()

        requestAnimationFrame(() => { this.LOOP() })
    }

    private PrintableObjectLogic(v: DrawableObject, i: number) {
        this.ctx.save()
        if (this.HoldedItem != v) v.DRAW(this.ctx)

        if (v.DELETE == true) {
            this.Rendings = this.Rendings.filter((obj) => obj != v)
        }

        this.ctx.restore()
    }

    static CheckIfObjectClicked(Mouse: MousePostition, obj: OnHand & DrawableObject): boolean {
        const Mx = Mouse.x * NodeRenderer.RenderingScale
        const My = Mouse.y * NodeRenderer.RenderingScale
        const x = obj.x
        const y = obj.y
        const w = obj.width
        const h = obj.height

        if ((Mx >= x && Mx <= x + w) && (My >= y && My <= y + h)) return true
        else return false
    }

    HoldedItem: (DrawableObject & OnHand) | null = null;
    private MouseDown(ev: MouseEvent) {
        this.Rendings.forEach((v) => {
            if ("OnHand" in v) {
                let d = (v as DrawableObject & OnHand)
                if (NodeRenderer.CheckIfObjectClicked({ x: ev.pageX, y: ev.pageY }, d)) {
                    this.HoldedItem = d;
                    this.Rendings = this.Rendings.filter((obj) => obj != d)
                    this.Rendings.push(d);
                }
            }

            if ("MouseDown" in v) ((v as unknown) as MouseDown).MouseDown(this.ctx, ev)
        })
    }

    private MouseUp(ev: MouseEvent) {
        this.HoldedItem = null;

        this.Rendings.forEach((v) => {
            if ("MouseUp" in v) ((v as unknown) as MouseUp).MouseUp(this.ctx, ev)
        })
    }

    MousePos: MousePostition = new MousePostition(0, 0)
    private MouseMove(ev: MouseEvent) {
        this.MousePos = new MousePostition(ev.pageX * NodeRenderer.RenderingScale, ev.pageY * NodeRenderer.RenderingScale)
        this.Rendings.forEach((v) => {
            if ("MouseMove" in v) ((v as unknown) as MouseMove).MouseMove(this.ctx, ev)
        })
    }

    private ExecuteHoldedItem(dev_mode = false) {
        if (dev_mode) console.log(this.HoldedItem)
        if (this.HoldedItem == null) return;
        this.ctx.save()
        this.HoldedItem.DRAW(this.ctx)
        this.ctx.restore()
        this.ctx.save()
        this.HoldedItem.OnHand(this.ctx, this.MousePos);
        this.ctx.restore()
    }

}

abstract class DrawableObject {
    //public AutoDesctructionOnClick = false;
    public DELETE: boolean = false;
    //abstract NAME: string;
    abstract DRAW(ctx: CanvasRenderingContext2D): void;
}

abstract class MouseDown {
    abstract MouseDown(ctx: CanvasRenderingContext2D, ev: MouseEvent): void;
}

abstract class MouseUp {
    abstract MouseUp(ctx: CanvasRenderingContext2D, ev: MouseEvent): void
}

abstract class MouseMove {
    abstract MouseMove(ctx: CanvasRenderingContext2D, ev: MouseEvent): void
}

abstract class OnHand {
    abstract x: number
    abstract y: number
    abstract width: number
    abstract height: number
    /**
     * Event is called when Object is held by mouse
     * @param mouse is scaled mouse position on page
     */
    abstract OnHand(ctx: CanvasRenderingContext2D, mouse: MousePostition): void;
}


class MousePostition {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

class CAMERA {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y
    }
}