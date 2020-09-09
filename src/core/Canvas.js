class Canvas {
    constructor(container) {
        this.container = document.querySelector(container);
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 300;

        this.context = this.canvas.getContext('2d');

        this.container.appendChild(this.canvas);
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