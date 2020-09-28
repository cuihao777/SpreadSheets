import Container from "./Container";

class Canvas {
    /**
     * Context for Canvas
     *
     * @type {CanvasRenderingContext2D}
     */
    context = null;

    /**
     * Init
     *
     * @param container {Container}
     * @param options {Object}
     */
    constructor(container, options = {}) {
        const defaultOptions = {
            width: -1,
            height: -1
        };

        this.options = { ...defaultOptions, ...options };

        this.container = container;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.viewPortSize.width;
        this.canvas.height = this.container.viewPortSize.height;
        this.container.appendViewPort(this.canvas);

        this.context = this.canvas.getContext('2d');

        this.container.event.on("resize", (event) => {
            this.canvas.width = event.viewPort.width;
            this.canvas.height = event.viewPort.height;
        });
    }

    get size() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    drawGrid() {

    }

    renderText(text, x, y) {
        this.context.font = "14px bold 等线";
        this.context.fillStyle = "#000000";
        this.context.fillText(text, x, y);
    }

    clear() {
        const { context, canvas } = this;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(0.5, 0.5);

        context.moveTo(0, 0);
        context.lineTo(0, canvas.height - 1);
        context.lineTo(canvas.width - 1, canvas.height - 1);
        context.lineTo(canvas.width - 1, 0);
        context.lineTo(0, 0);
        context.lineWidth = 1;
        context.strokeStyle = "#d4d4d4";
        context.stroke();

        context.restore();
    }
}

export default Canvas;