"use strict";
class NodeRenderer {
    constructor(canvas, scaleofrendering = 2, auto_canvas_resizing = true) {
        this.Rendings = [];
        this.LoopStatus = false;
        this.LastSize = {
            width: 0,
            height: 0
        };
        this.DeltaTime = 0;
        this.FPS = 0;
        this.MeasureFPS_frames = 0;
        this.HoldedItem = null;
        this.MousePos = new MousePostition(0, 0);
        this.Canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.AutoCanvasResizing = auto_canvas_resizing;
        NodeRenderer.RenderingScale = scaleofrendering;
        this.LastTime = Date.now();
        this.LastFPS = Date.now();
        this.AddEventListeners();
    }
    AddEventListeners() {
        addEventListener("mousedown", (ev) => { this.MouseDown(ev); });
        addEventListener("mouseup", (ev) => { this.MouseUp(ev); });
        addEventListener("mousemove", (ev) => { this.MouseMove(ev); });
    }
    AddRendering(obj) {
        this.Rendings.push(obj);
    }
    SetRenderingStatus(status) {
        if (status == true && this.LoopStatus == false) {
            this.LoopStatus = status;
            requestAnimationFrame(() => { this.LOOP(); });
            return;
        }
        this.LoopStatus = status;
    }
    ResizeCanvas(dev_mode = false) {
        if (!this.AutoCanvasResizing)
            return;
        if (this.Canvas.offsetHeight == this.LastSize.height && this.Canvas.offsetWidth == this.LastSize.width)
            return;
        this.Canvas.width = this.Canvas.offsetWidth * NodeRenderer.RenderingScale;
        this.Canvas.height = this.Canvas.offsetHeight * NodeRenderer.RenderingScale;
        if (dev_mode)
            console.log(this.Canvas.width + " - " + this.Canvas.height);
    }
    MeasureDeltaTime() {
        let now = Date.now();
        this.DeltaTime = now - this.LastTime;
        this.LastTime = now;
    }
    MeasureFPS() {
        if (Date.now() >= this.LastFPS + 1000) {
            this.LastFPS = Date.now();
            this.FPS = this.MeasureFPS_frames;
            this.MeasureFPS_frames = 0;
        }
        this.MeasureFPS_frames++;
    }
    // MEASURE FUNCTIONS END
    LOOP() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.ResizeCanvas();
        this.MeasureFPS();
        this.MeasureDeltaTime();
        this.ctx.font = "200px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.FPS.toString() + " FPS", 20, 200);
        this.Rendings.forEach((v, i) => { this.PrintableObjectLogic(v, i); });
        this.ExecuteHoldedItem();
        requestAnimationFrame(() => { this.LOOP(); });
    }
    PrintableObjectLogic(v, i) {
        this.ctx.save();
        if (this.HoldedItem != v)
            v.DRAW(this.ctx);
        if (v.DELETE == true) {
            this.Rendings = this.Rendings.filter((obj) => obj != v);
        }
        this.ctx.restore();
    }
    static CheckIfObjectClicked(Mouse, obj) {
        const Mx = Mouse.x * NodeRenderer.RenderingScale;
        const My = Mouse.y * NodeRenderer.RenderingScale;
        const x = obj.x;
        const y = obj.y;
        const w = obj.width;
        const h = obj.height;
        if ((Mx >= x && Mx <= x + w) && (My >= y && My <= y + h))
            return true;
        else
            return false;
    }
    MouseDown(ev) {
        this.Rendings.forEach((v) => {
            if ("OnHand" in v) {
                let d = v;
                if (NodeRenderer.CheckIfObjectClicked({ x: ev.pageX, y: ev.pageY }, d)) {
                    this.HoldedItem = d;
                    this.Rendings = this.Rendings.filter((obj) => obj != d);
                    this.Rendings.push(d);
                }
            }
            if ("MouseDown" in v)
                v.MouseDown(this.ctx, ev);
        });
    }
    MouseUp(ev) {
        this.HoldedItem = null;
        this.Rendings.forEach((v) => {
            if ("MouseUp" in v)
                v.MouseUp(this.ctx, ev);
        });
    }
    MouseMove(ev) {
        this.MousePos = new MousePostition(ev.pageX * NodeRenderer.RenderingScale, ev.pageY * NodeRenderer.RenderingScale);
        this.Rendings.forEach((v) => {
            if ("MouseMove" in v)
                v.MouseMove(this.ctx, ev);
        });
    }
    ExecuteHoldedItem(dev_mode = false) {
        if (dev_mode)
            console.log(this.HoldedItem);
        if (this.HoldedItem == null)
            return;
        this.ctx.save();
        this.HoldedItem.DRAW(this.ctx);
        this.ctx.restore();
        this.ctx.save();
        this.HoldedItem.OnHand(this.ctx, this.MousePos);
        this.ctx.restore();
    }
}
class DrawableObject {
    constructor() {
        //public AutoDesctructionOnClick = false;
        this.DELETE = false;
    }
}
class MouseDown {
}
class MouseUp {
}
class MouseMove {
}
class OnHand {
}
class MousePostition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class CAMERA {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
