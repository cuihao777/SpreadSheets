import ResizeObserver from 'resize-observer-polyfill';
import throttle from 'lodash/throttle';
import Events from 'events';
import Canvas from './Canvas'

class Container {
    /**
     * Event Manager
     *
     * @type {EventEmitter}
     */
    event = new Events();

    /**
     * Parent Node
     *
     * @type {HTMLElement}
     */
    parentNode = null;

    constructor(parentNode, options) {
        const defaultOptions = {
            width: -1,
            height: -1,
            defaultColumnWidth: 100,
            defaultRowHeight: 25
        };

        this.options = {...defaultOptions, ...options};

        this.element = document.createElement("div");
        this.element.className = "spread-container";
        this.element.style.width = this.options.width !== -1 ? this.options.width : '100%';
        this.element.style.height = this.options.height !== -1 ? this.options.height : '100%';

        this.parentNode = parentNode;
        parentNode.appendChild(this.element);

        this.onParentNodeResize = throttle(this.onParentNodeResize, 100);
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.onParentNodeResize(entry.target);
            }
        });

        resizeObserver.observe(this.parentNode);

        this.viewport = document.createElement("div");
        this.viewport.className = "viewport";
        this.element.appendChild(this.viewport);
        this.canvas = new Canvas({
            width: this.viewport.clientWidth,
            height: this.viewport.clientHeight
        });
        this.canvas.appendTo(this.viewport);
    }

    onParentNodeResize() {
        const width = this.viewport.clientWidth;
        const height = this.viewport.clientHeight;

        this.canvas.resize(width, height);
        this.drawGrid();
    }

    setData(header, data) {
        this.header = header;
        this.data = data;
    }

    drawGrid() {
        const maxWidth = this.canvas.size.width;
        const maxHeight = this.canvas.size.height;
        const {defaultColumnWidth, defaultRowHeight} = this.options;
        const {header, data} = this;

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

            this.canvas.save();
            this.canvas.setLineStyle();
            this.canvas.line([0, s], [rowEndpoint, s])
            this.canvas.restore();
        }

        for (let i = 0, s = 0; i < header.length; i++) {
            let column = header[i];
            const columnWidth = column.width ? column.width : defaultColumnWidth;
            s += columnWidth;

            this.canvas.save();
            this.canvas.setLineStyle();
            this.canvas.line([s, 0], [s, columnEndpoint])
            this.canvas.restore();
        }
    }
}

export default Container;