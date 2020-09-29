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

        this.options = {...defaultOptions, ...options};

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

    drawGrid(header, data, options) {
        const maxWidth = this.size.width;
        const maxHeight = this.size.height;
        const {defaultColumnWidth, defaultRowHeight} = options;

        let rowEndpoint = 0;
        let columnEndpoint = 0;

        for (let i = 0; i < header.length; i++) {
            const field = header[i];
            const fieldWidth = field.width ? field.width : defaultColumnWidth;

            rowEndpoint += fieldWidth;

            if (rowEndpoint > maxWidth) {
                rowEndpoint = maxWidth;
                break;
            }
        }

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            columnEndpoint += row.height ? row.height : defaultRowHeight;

            if (columnEndpoint > maxHeight) {
                columnEndpoint = maxHeight;
                break;
            }
        }

        for (let i = 0, s = 0; i < data.length; i++) {
            const row = data[i];
            const rowHeight = row.height ? row.height : defaultRowHeight;
            s += rowHeight;

            this.context.save();
            this.context.translate(-0.5, -0.5);
            this.context.moveTo(0, s);
            this.context.lineTo(rowEndpoint, s);
            this.context.strokeStyle = "#e6e6e6";
            this.context.stroke();
            this.context.restore();
        }

        for (let i = 0, s = 0; i < header.length; i++) {
            let column = header[i];
            const columnWidth = column.width ? column.width : defaultColumnWidth;
            s += columnWidth;

            this.context.save();
            this.context.translate(-0.5, -0.5);
            this.context.moveTo(s, 0);
            this.context.lineTo(s, columnEndpoint);
            this.context.strokeStyle = "#e6e6e6";
            this.context.stroke();
            this.context.restore();
        }
    }

    renderText(text, x, y) {
        this.context.font = "14px bold 等线";
        this.context.fillStyle = "#000000";
        this.context.fillText(text, x, y);
    }
}

export default Canvas;
