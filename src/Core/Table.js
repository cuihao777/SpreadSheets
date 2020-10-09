import ResizeObserver from 'resize-observer-polyfill';
import throttle from 'lodash/throttle';
import Canvas from './Canvas';
import VerticalScrollBar from './VerticalScrollBar';
import HorizontalScrollBar from './HorizontalScrollBar';
import { CellRange, ColumnRange, FullRange, RowRange } from './DataSet';
import { Config } from '@/Config';

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
        this.vScroll.addEventListener("mousewheel", this.onMouseWheel);

        this.hScroll = new HorizontalScrollBar();
        this.el.appendChild(this.hScroll.el);
        this.hScroll.addEventListener("scroll", this.onHorizontalScroll);

        this.vScroll.el.style.bottom = `${this.hScroll.el.offsetHeight}px`;
        this.hScroll.el.style.right = `${this.vScroll.el.offsetWidth}px`;

        this.canvas = new Canvas({
            width: this.el.clientWidth - this.vScroll.el.offsetWidth,
            height: this.el.clientHeight - this.hScroll.el.offsetHeight
        });
        this.el.appendChild(this.canvas.el);
        this.canvas.addEventListener({
            "mousewheel": this.onMouseWheel,
            "mousedown": this.onMouseDown,
            "mouseup": this.onMouseUp,
            "mousemove": this.onMouseMove,
        });
    }

    onParentNodeResize() {
        this.render();
    }

    onMouseDown = (x, y) => {
        const index = this.getIndex(x, y);

        if (index === null) {
            return;
        }

        const [xIndex, yIndex] = index;

        if (xIndex === -1 && yIndex === -1) {
            this.dataSet.setSelected(new FullRange());
        } else if (xIndex === -1) {
            this.dataSet.setSelected(new ColumnRange(yIndex, yIndex));
        } else if (yIndex === -1) {
            this.dataSet.setSelected(new RowRange(xIndex, xIndex));
        } else {
            this.dataSet.setSelected(new CellRange(index, index));
        }

        this.render();
    };

    onMouseUp = (x, y) => {
        const index = this.getIndex(x, y);
        const selected = this.dataSet.getSelected();

        if (index === null || selected instanceof FullRange) {
            return;
        }

        const [xIndex, yIndex] = index;

        if (selected instanceof ColumnRange) {
            this.dataSet.setSelected({ to: yIndex });
        } else if (selected instanceof RowRange) {
            this.dataSet.setSelected({ to: xIndex });
        } else if (selected instanceof CellRange) {
            this.dataSet.setSelected({ to: index });
        }

        this.render();
    };

    onMouseMove = (x, y) => {
        const index = this.getIndex(x, y);
        const selected = this.dataSet.getSelected();

        if (index === null) {
            return;
        }

        const [xIndex, yIndex] = index;
        const toIndex = this.dataSet.getSelected().to;

        if (selected instanceof ColumnRange) {
            if (toIndex !== yIndex) {
                this.dataSet.setSelected({ to: yIndex });
                this.render();
            }
        } else if (selected instanceof RowRange) {
            if (toIndex !== xIndex) {
                this.dataSet.setSelected({ to: xIndex });
                this.render();
            }
        } else if (selected instanceof CellRange) {
            if (toIndex[0] !== index[0] || toIndex[1] !== index[1]) {
                this.dataSet.setSelected({ to: index });
                this.render();
            }
        }
    };

    getIndex(x, y) {
        const [firstRowIndex, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();
        const { defaultRowHeight: headerHeight, blankWidth, blankHeight } = Config.Table;
        const lineNoWidth = this.getLineNoWidth();
        const widthCache = this.dataSet.cache.width;
        const heightCache = this.dataSet.cache.height;
        const lastColumnIndex = this.dataSet.cache.width.length - 1;
        const lastRowIndex = this.dataSet.cache.height.length - 1;
        let targetX = widthCache[firstColumnIndex] + x - lineNoWidth;
        let targetY = heightCache[firstRowIndex] + y - headerHeight;

        let xIndex = firstColumnIndex;
        let yIndex = firstRowIndex;

        let selectedIndex = {
            row: -2,
            column: -2
        };

        if (targetX <= this.dataSet.width - blankWidth) {
            while (xIndex <= lastColumnIndex && widthCache[xIndex] < targetX) {
                xIndex++;
            }
            selectedIndex.column = xIndex - 1;
        }

        if (targetY <= this.dataSet.height - blankHeight) {
            while (yIndex <= lastRowIndex && heightCache[yIndex] < targetY) {
                yIndex++;
            }
            selectedIndex.row = yIndex - 1;
        }

        if (selectedIndex.row === -2 || selectedIndex.column === -2) {
            return null;
        } else {
            return [selectedIndex.row, selectedIndex.column];
        }
    }

    onVerticalScroll = (top) => {
        const heightCache = this.dataSet.cache.height;
        const [firstRowIndex, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();

        let i = 0;
        while (i < heightCache.length) {
            const currentHeight = heightCache[i];
            const nextHeight = heightCache[i + 1];

            if (top >= currentHeight && top < nextHeight) {
                break;
            }

            i++;
        }

        if (i !== firstRowIndex) {
            this.dataSet.setFirstCellPositionOnViewport(i, firstColumnIndex);
            this.render();
        }
    };

    onHorizontalScroll = (left) => {
        const widthCache = this.dataSet.cache.width;
        const [firstRowIndex, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();

        let i = 0;
        while (i < widthCache.length) {
            const currentWidth = widthCache[i];
            const nextWidth = widthCache[i + 1];

            if (left >= currentWidth && left < nextWidth) {
                break;
            }

            i++;
        }

        if (i !== firstColumnIndex) {
            this.dataSet.setFirstCellPositionOnViewport(firstRowIndex, i);
            this.render();
        }
    };

    onMouseWheel = (_, deltaY) => {
        let [firstRowIndex, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();
        let [firstRowIndexBeforeChange, firstColumnIndexBeforeChange] = [firstRowIndex, firstColumnIndex];
        const data = this.dataSet.getData();
        const dataCount = data.length;
        const { defaultRowHeight, blankHeight } = Config.Table;

        if (deltaY > 0) {
            let totalHeight = 0;
            let totalLine = 0;
            for (let i = firstRowIndex; i < dataCount; i++) {
                const rowHeight = data[i].height || defaultRowHeight;
                totalHeight += rowHeight;

                if (totalHeight > this.canvas.size.height) {
                    break;
                }

                totalLine += 1;
            }

            if (totalHeight + blankHeight > this.canvas.size.height) {
                firstRowIndex += totalLine < 3 ? totalLine : 3;
                this.vScroll.top = this.dataSet.cache.height[firstRowIndex];
            }
        }

        if (deltaY < 0) {
            firstRowIndex = firstRowIndex - 3 < 0 ? 0 : firstRowIndex - 3;
            this.vScroll.top = this.dataSet.cache.height[firstRowIndex];
        }

        if (firstRowIndexBeforeChange !== firstRowIndex || firstColumnIndexBeforeChange !== firstColumnIndex) {
            this.dataSet.setFirstCellPositionOnViewport(firstRowIndex, firstColumnIndex);
            this.render();
        }
    };

    render() {
        const width = this.el.clientWidth - this.vScroll.el.offsetWidth + 1;
        const height = this.el.clientHeight - this.hScroll.el.offsetHeight + 1;

        this.canvas.resize(width, height);
        this.renderHeader();
        this.renderLineNo();
        this.renderData();
        this.renderGrid();
        this.renderSelectedRange();
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

        this.canvas.save();
        this.canvas.attr({ strokeStyle: borderColor, lineWidth: 1 });

        // Render Header Grid
        this.canvas.line([0, defaultRowHeight], [rowEndpoint + lineNoWidth, defaultRowHeight]);

        // Render LineNo Grid
        this.canvas.line([lineNoWidth, 0], [lineNoWidth, columnEndpoint + defaultRowHeight]);

        for (let i = firstRowIndex, s = defaultRowHeight; i < data.length; i++) {
            const row = data[i];
            const rowHeight = row.height ? row.height : defaultRowHeight;
            s += rowHeight;
            this.canvas.line([0, s], [rowEndpoint + lineNoWidth, s]);

            if (s > this.canvas.size.height) {
                break;
            }
        }

        for (let i = firstColumnIndex, s = lineNoWidth; i < header.length; i++) {
            let column = header[i];
            const columnWidth = column.width ? column.width : defaultColumnWidth;
            s += columnWidth;
            this.canvas.line([s, 0], [s, columnEndpoint + defaultRowHeight]);

            if (s > this.canvas.size.width) {
                break;
            }
        }
        this.canvas.restore();
    }

    renderSelectedRange() {
        const selectedRange = this.dataSet.getSelected().normalize();
        const headerHeight = Config.Table.defaultRowHeight;
        const { defaultRowHeight, defaultColumnWidth } = Config.Table;
        const lineNoWidth = this.getLineNoWidth();
        const clipHeight = this.canvas.size.height - headerHeight;
        const clipWidth = this.canvas.size.width - lineNoWidth;

        this.canvas.clipRect(lineNoWidth, headerHeight, clipWidth, clipHeight);

        const [fRow, fColumn] = selectedRange.from;
        const [tRow, tColumn] = selectedRange.to;

        const from = {
            x: this.dataSet.cache.width[fColumn],
            y: this.dataSet.cache.height[fRow]
        };

        const to = {
            x: this.dataSet.cache.width[tColumn],
            y: this.dataSet.cache.height[tRow],
            width: this.dataSet.getHeader()[tColumn].width || defaultColumnWidth,
            height: this.dataSet.getData()[tRow].height || defaultRowHeight
        };

        const [firstRowIndex, firstColumnIndex] = this.dataSet.getFirstCellPositionOnViewport();
        const firstCellX = this.dataSet.cache.width[firstColumnIndex];
        const firstCellY = this.dataSet.cache.height[firstRowIndex];

        const rect = {
            x: from.x - firstCellX + lineNoWidth,
            y: from.y - firstCellY + headerHeight,
            width: to.x - from.x + to.width,
            height: to.y - from.y + to.height
        };

        this.canvas.attr({
            fillStyle: "rgb(75,137,255,0.1)"
        });
        this.canvas.fillRect(rect.x, rect.y, rect.width, rect.height);

        this.canvas.border("medium", "#4b89ff");
        const lines = [
            [rect.x, rect.y],
            [rect.x + rect.width, rect.y],
            [rect.x + rect.width, rect.y + rect.height],
            [rect.x, rect.y + rect.height],
            [rect.x, rect.y]
        ];
        this.canvas.line(...lines);
        this.canvas.restore();
    }

    getLineNoWidth() {
        const text = this.dataSet.getData().length;

        if (lineNoWidthCache[text] === undefined) {
            lineNoWidthCache[text] = this.canvas.measureText({
                text: this.dataSet.getData().length,
                textAlign: 'start',
                textBaseline: 'middle',
                fontSize: 13
            }).width + 16;
        }

        return lineNoWidthCache[text];
    }

    isOutOfBound(x, y) {
        const { width, height } = this.canvas.size;
        return x < 0 || y < 0 || x >= width || y >= height;
    }
}

const lineNoWidthCache = {};

export default Table;
