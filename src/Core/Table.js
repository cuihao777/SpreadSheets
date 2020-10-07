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

    /**
     * Data
     *
     * @type {DataSet}
     */
    dataSet = null;

    constructor(container, options) {
        const defaultOptions = {
            width: -1,
            height: -1
        };

        this.options = { ...defaultOptions, ...options };

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
        this.vScroll.addEventListener("scroll", this.onVerticalScroll);

        this.hScroll = new HorizontalScrollBar();
        this.el.appendChild(this.hScroll.el);
        this.hScroll.addEventListener("scroll", this.HorizontalScroll);

        this.vScroll.el.style.bottom = `${this.hScroll.el.offsetHeight}px`;
        this.hScroll.el.style.right = `${this.vScroll.el.offsetWidth}px`;

        this.canvas = new Canvas({
            width: this.el.clientWidth - this.vScroll.el.offsetWidth,
            height: this.el.clientHeight - this.hScroll.el.offsetHeight
        });
        this.el.appendChild(this.canvas.canvas);
    }

    onParentNodeResize() {
        this.render();
    }

    onVerticalScroll = (top, height) => {
        console.log(top, height);
    };

    HorizontalScroll = (left, width) => {
        console.log(left, width);
    };

    render() {
        const width = this.el.clientWidth - this.vScroll.el.offsetWidth + 1;
        const height = this.el.clientHeight - this.hScroll.el.offsetHeight + 1;

        this.canvas.resize(width, height);

        this.renderHeader();
        this.renderLineNo();
        this.renderData();
        this.renderGrid();
    }

    /**
     * Set DataSet
     *
     * @param dataSet {DataSet}
     */
    setDataSet(dataSet) {
        this.dataSet = dataSet;

        this.hScroll.width = dataSet.getWidth();
        this.vScroll.height = dataSet.getHeight();
    }

    renderHeader() {
        const header = this.dataSet.getHeader();
        const [, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();
        const { defaultRowHeight, defaultColumnWidth, headerColor } = Config.Table;
        const lineNoWidth = this.getLineNoWidth();

        // Render Line-No Header
        this.canvas.attr({ fillStyle: headerColor });
        this.canvas.fillRect(0, 0, lineNoWidth, defaultRowHeight);

        let offsetX = lineNoWidth;

        for (let i = firstColumnIndex; i < header.length; i++) {
            const field = header[i];
            const title = field.title || '';
            const align = ["left", "center", "right"].includes(field.align) ? field.align : 'center';

            const rect = {
                x: offsetX,
                y: 0,
                width: field.width || defaultColumnWidth,
                height: defaultRowHeight
            };

            this.canvas.attr({ fillStyle: headerColor });
            this.canvas.fillRect(rect.x, rect.y, rect.width, rect.height);

            const params = {
                x: rect.x,
                y: Math.trunc(rect.y + rect.height / 2),
                textAlign: 'start',
                textBaseline: 'middle',
                fontSize: 13
            };

            if (align === 'center') {
                params.x = Math.trunc(rect.x + rect.width / 2);
                params.textAlign = 'center';
            } else if (align === 'right') {
                params.x = rect.x + rect.width;
                params.textAlign = 'end';
            }

            this.canvas.attr({ fillStyle: "#000000" });
            this.canvas.fillText({
                text: title,
                ...params
            }, rect);

            offsetX += rect.width;

            if (offsetX > this.canvas.size.width) {
                break;
            }
        }
    }

    renderLineNo() {
        const data = this.dataSet.getData();
        const [firstRowIndex] = this.dataSet.getFirstCellPositionOnViewport();
        const { defaultRowHeight, headerColor } = Config.Table;

        for (let i = firstRowIndex, offsetY = defaultRowHeight; i < data.length; i++) {
            const width = this.getLineNoWidth();
            const height = data[i].height || defaultRowHeight;

            const rect = {
                x: 0,
                y: offsetY,
                width: width,
                height: height
            };

            this.canvas.attr({ fillStyle: headerColor });
            this.canvas.fillRect(rect.x, rect.y, rect.width, rect.height);

            const params = {
                x: Math.trunc(rect.x + rect.width / 2),
                y: Math.trunc(rect.y + rect.height / 2),
                textAlign: 'center',
                textBaseline: 'middle',
                fontSize: 13
            };

            this.canvas.attr({ fillStyle: "#000000" });
            this.canvas.fillText({
                text: i + 1,
                ...params
            }, rect);

            offsetY += height;

            if (offsetY > this.canvas.size.height) {
                break;
            }
        }
    }

    renderData() {
        const header = this.dataSet.getHeader();
        const data = this.dataSet.getData();
        const [firstRowIndex, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();
        const lineNoWidth = this.getLineNoWidth();
        const { defaultRowHeight, defaultColumnWidth } = Config.Table;

        for (let i = firstRowIndex, offsetY = defaultRowHeight; i < data.length; i++) {
            const height = data[i].height || defaultRowHeight;
            const cells = data[i].cells || [];

            for (let j = firstColumnIndex, offsetX = lineNoWidth; j < cells.length; j++) {
                const field = header[j];
                const cellWidth = field.width || defaultColumnWidth;
                const cellHeight = height;
                const align = ["left", "center", "right"].includes(field.align) ? field.align : 'center';
                const text = cells[j];

                const rect = {
                    x: offsetX,
                    y: offsetY,
                    width: cellWidth,
                    height: cellHeight
                };

                const params = {
                    x: rect.x,
                    y: Math.trunc(rect.y + rect.height / 2),
                    textAlign: 'start',
                    textBaseline: 'middle',
                    fontSize: 13
                };

                if (align === 'center') {
                    params.x = Math.trunc(rect.x + rect.width / 2);
                    params.textAlign = 'center';
                } else if (align === 'right') {
                    params.x = rect.x + rect.width;
                    params.textAlign = 'end';
                }

                this.canvas.attr({ fillStyle: "#000000" });
                this.canvas.fillText({
                    text: text,
                    ...params
                }, rect);

                offsetX += rect.width;

                if (offsetX > this.canvas.size.width) {
                    break;
                }
            }

            offsetY += height;

            if (offsetY > this.canvas.size.height) {
                break;
            }
        }
    }

    renderGrid() {
        const maxWidth = this.canvas.size.width;
        const maxHeight = this.canvas.size.height;
        const header = this.dataSet.getHeader();
        const data = this.dataSet.getData();
        const [firstRowIndex, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();
        const { defaultRowHeight, defaultColumnWidth, borderColor } = Config.Table;

        let rowEndpoint = 0;
        let columnEndpoint = 0;

        for (let i = firstColumnIndex; i < header.length; i++) {
            const field = header[i];
            const fieldWidth = field.width ? field.width : defaultColumnWidth;

            rowEndpoint += fieldWidth;

            if (rowEndpoint > maxWidth) {
                rowEndpoint = maxWidth;
                break;
            }
        }

        for (let i = firstRowIndex; i < data.length; i++) {
            const row = data[i];
            columnEndpoint += row.height ? row.height : defaultRowHeight;

            if (columnEndpoint > maxHeight) {
                columnEndpoint = maxHeight;
                break;
            }
        }

        const lineNoWidth = this.getLineNoWidth();

        // Render Header Grid
        this.canvas.save();
        this.canvas.setLineStyle();
        this.canvas.line([0, defaultRowHeight], [rowEndpoint + lineNoWidth, defaultRowHeight])
        this.canvas.restore();

        // Render LineNo Grid
        this.canvas.save();
        this.canvas.setLineStyle();
        this.canvas.line([lineNoWidth, 0], [lineNoWidth, columnEndpoint]);
        this.canvas.restore();

        for (let i = firstRowIndex, s = defaultRowHeight; i < data.length; i++) {
            const row = data[i];
            const rowHeight = row.height ? row.height : defaultRowHeight;
            s += rowHeight;

            this.canvas.save();
            this.canvas.attr({ strokeStyle: borderColor, lineWidth: 1 });
            this.canvas.line([0, s], [rowEndpoint + lineNoWidth, s])
            this.canvas.restore();
        }

        for (let i = firstColumnIndex, s = lineNoWidth; i < header.length; i++) {
            let column = header[i];
            const columnWidth = column.width ? column.width : defaultColumnWidth;
            s += columnWidth;

            this.canvas.save();
            this.canvas.attr({ strokeStyle: borderColor, lineWidth: 1 });
            this.canvas.line([s, 0], [s, columnEndpoint + defaultRowHeight])
            this.canvas.restore();
        }
    }

    getLineNoWidth() {
        return this.canvas.measureText({
            text: this.dataSet.getData().length,
            textAlign: 'start',
            textBaseline: 'middle',
            fontSize: 13
        }).width + 8;
    }
}

export default Table;
