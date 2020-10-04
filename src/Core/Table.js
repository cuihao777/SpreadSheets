import ResizeObserver from 'resize-observer-polyfill';
import throttle from 'lodash/throttle';
import Canvas from './Canvas';
import VerticalScrollBar from './VerticalScrollBar'
import HorizontalScrollBar from './HorizontalScrollBar'
import { Config } from '@/Config'

function createTable(width = -1, height = -1) {
    const el = document.createElement("div");
    el.className = "spread-table";

    Object.assign(el.style, {
        width: width !== -1 ? `${width}px` : '100%',
        height: height !== -1 ? `${height}px` : '100%'
    });

    return el;
}

class Table {
    /**
     * Parent Node
     *
     * @type {HTMLElement}
     */
    container = null;

    /**
     * Root node of current component
     *
     * @type {HTMLElement}
     */
    el = null;

    /**
     * Vertical ScrollBar
     *
     * @type {VerticalScrollBar}
     */
    vScroll = null;

    /**
     * Horizontal ScrollBar
     *
     * @type {HorizontalScrollBar}
     */
    hScroll = null;

    constructor(container, options) {
        const defaultOptions = {
            width: -1,
            height: -1
        };

        this.options = {...defaultOptions, ...options};

        this.el = createTable(this.options.width, this.options.height);
        this.container = container;
        this.container.appendChild(this.el);

        this.onParentNodeResize = throttle(this.onParentNodeResize, 100);
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.onParentNodeResize(entry.target);
            }
        });

        resizeObserver.observe(this.container);

        this.vScroll = new VerticalScrollBar();
        this.el.appendChild(this.vScroll.el);

        this.hScroll = new HorizontalScrollBar();
        this.el.appendChild(this.hScroll.el);

        this.vScroll.el.style.bottom = `${this.hScroll.el.offsetHeight}px`;
        this.hScroll.el.style.right = `${this.vScroll.el.offsetWidth}px`;

        this.canvas = new Canvas({
            width: this.el.clientWidth - this.vScroll.el.offsetWidth,
            height: this.el.clientHeight - this.hScroll.el.offsetHeight
        });
        this.el.appendChild(this.canvas.canvas);
    }

    onParentNodeResize() {
        const width = this.el.clientWidth - this.vScroll.el.offsetWidth;
        const height = this.el.clientHeight - this.hScroll.el.offsetHeight;

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
        const {header, data} = this;

        let rowEndpoint = 0;
        let columnEndpoint = 0;

        for (let i = 0; i < header.length; i++) {
            const field = header[i];
            const fieldWidth = field.width ? field.width : Config.Table.defaultColumnWidth;

            rowEndpoint += fieldWidth;

            if (rowEndpoint > maxWidth) {
                rowEndpoint = maxWidth;
                break;
            }
        }

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            columnEndpoint += row.height ? row.height : Config.Table.defaultRowHeight;

            if (columnEndpoint > maxHeight) {
                columnEndpoint = maxHeight;
                break;
            }
        }

        for (let i = 0, s = 0; i < data.length; i++) {
            const row = data[i];
            const rowHeight = row.height ? row.height : Config.Table.defaultRowHeight;
            s += rowHeight;

            this.canvas.save();
            this.canvas.setLineStyle();
            this.canvas.line([0, s], [rowEndpoint, s])
            this.canvas.restore();
        }

        for (let i = 0, s = 0; i < header.length; i++) {
            let column = header[i];
            const columnWidth = column.width ? column.width : Config.Table.defaultColumnWidth;
            s += columnWidth;

            this.canvas.save();
            this.canvas.setLineStyle();
            this.canvas.line([s, 0], [s, columnEndpoint])
            this.canvas.restore();
        }
    }

    drawContent() {

    }
}

export default Table;