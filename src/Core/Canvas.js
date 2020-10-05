let dpr = () => {
    let ratio = window.devicePixelRatio || 1;
    dpr = () => ratio;
    return dpr();
};

function npx(px) {
    return Math.trunc(px * dpr());
}

function npxLine(px) {
    const n = npx(px);
    return n > 0 ? n - 0.5 : 0.5;
}

class Canvas {
    /**
     * Canvas Element
     *
     * @type {HTMLCanvasElement}
     */
    canvas = null;

    /**
     * Context for Canvas
     *
     * @type {CanvasRenderingContext2D}
     */
    context = null;

    size = {
        width: 0,
        height: 0
    };

    /**
     * Init
     *
     * @param options {Object}
     */
    constructor(options = {}) {
        const defaultOptions = {
            width: 0,
            height: 0
        };

        this.options = { ...defaultOptions, ...options };

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.resize(this.options.width, this.options.height);
        this.context.scale(dpr(), dpr());
    }

    resize(width, height) {
        this.size.width = width;
        this.size.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = npx(width);
        this.canvas.height = npx(height);
    }

    clear() {
        const { width, height } = this.canvas;
        this.context.clearRect(0, 0, width, height);
        return this;
    }

    attr(options) {
        Object.assign(this.context, options);
        return this;
    }

    save() {
        this.context.save();
        this.context.beginPath();
    }

    restore() {
        this.context.restore();
        return this;
    }

    beginPath() {
        this.context.beginPath();
        return this;
    }

    translate(x, y) {
        this.context.translate(npx(x), npx(y));
        return this;
    }

    scale(x, y) {
        this.context.scale(x, y);
        return this;
    }

    clearRect(x, y, w, h) {
        this.context.clearRect(x, y, w, h);
        return this;
    }

    fillRect(x, y, w, h) {
        this.context.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
        return this;
    }

    border(style, color) {
        const { context } = this;
        context.lineWidth = 1;
        context.strokeStyle = color;

        if (style === 'medium') {
            context.lineWidth = npx(2) - 0.5;
        } else if (style === 'thick') {
            context.lineWidth = npx(3);
        } else if (style === 'dashed') {
            context.setLineDash([npx(3), npx(2)]);
        } else if (style === 'dotted') {
            context.setLineDash([npx(1), npx(1)]);
        } else if (style === 'double') {
            context.setLineDash([npx(2), 0]);
        }
        return this;
    }

    line(...xys) {
        const { context } = this;
        if (xys.length > 1) {
            context.beginPath();
            const [x, y] = xys[0];
            context.moveTo(npxLine(x), npxLine(y));
            for (let i = 1; i < xys.length; i += 1) {
                const [x1, y1] = xys[i];
                context.lineTo(npxLine(x1), npxLine(y1));
            }
            context.stroke();
        }
        return this;
    }

    fillText({
                 text, x, y,
                 fontStyle = 'normal',
                 fontVariant = 'normal',
                 fontWeight = 'normal',
                 fontSize = 13,
                 textAlign = 'start',
                 textBaseline = 'top'
             }, rect) {
        if (rect) {
            this.context.save();
            this.context.rect(npx(rect.x), npx(rect.y), npx(rect.width), npx(rect.height));
            this.context.clip();
        }

        this.context.font = `${fontStyle} ${fontVariant} ${fontWeight} ${npx(fontSize)}px Arial`;
        this.context.textBaseline = textBaseline;
        this.context.textAlign = textAlign;
        this.context.fillText(text, npx(x), npx(y));

        if (rect) {
            this.context.restore();
        }
    }

    measureText({
                    text,
                    fontStyle = 'normal',
                    fontVariant = 'normal',
                    fontWeight = 'normal',
                    fontSize = 13,
                    textAlign = 'start',
                    textBaseline = 'top'
                }) {
        this.context.font = `${fontStyle} ${fontVariant} ${fontWeight} ${npx(fontSize)}px Arial`;
        this.context.textBaseline = textBaseline;
        this.context.textAlign = textAlign;
        return this.context.measureText(text);
    }

    setLineStyle() {
        this.attr({
            strokeStyle: '#d4d4d4',
            lineWidth: 1
        });
    }
}

export default Canvas;
