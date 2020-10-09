import { Config } from '@/Config'

class DataSet {
    /**
     * Header
     *
     * @type {array}
     */
    header = [];

    /**
     * Data
     *
     * @type {array}
     */
    data = [];

    /**
     * Total Width
     *
     * @type {number}
     */
    width = 0;

    /**
     * Total Height
     *
     * @type {number}
     */
    height = 0;

    /**
     * First cell position on viewport
     *
     * @type {number[]}
     */
    firstCellPositionOnViewport = [0, 0];

    /**
     * Selected Index Range
     *
     * @type {SelectedRange}
     */
    selected = null;

    /**
     * Cache of Width & Height
     *
     * @type {{width: number[], height: number[]}}
     */
    cache = {
        width: [],
        height: [],
    };

    constructor(options = {}) {
        this.setHeader(options.header || []);
        this.setData(options.data || []);
    }

    getHeader() {
        return this.header;
    }

    setHeader(header) {
        this.header = header;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;

        const { defaultColumnWidth, defaultRowHeight } = Config.Table;
        const { blankWidth, blankHeight } = Config.Table;

        this.width = 0;
        this.height = 0;
        this.cache.width = [];
        this.cache.height = [];

        for (let i = 0; i < this.header.length; i++) {
            this.cache.width[i] = this.width;
            this.width += (this.header[i].width || defaultColumnWidth);
        }

        for (let i = 0; i < this.data.length; i++) {
            this.cache.height[i] = this.height;
            this.height += (this.data[i].height || defaultRowHeight);
        }

        this.width += blankWidth;
        this.height += blankHeight;

        this.setSelected(new CellRange(0, 0));
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getFirstCellPositionOnViewport() {
        return this.firstCellPositionOnViewport;
    }

    setFirstCellPositionOnViewport(rowIndex, columnIndex) {
        this.firstCellPositionOnViewport = [rowIndex, columnIndex];
    }

    /**
     * Get Selected Range
     *
     * @returns {SelectedRange}
     */
    getSelected() {
        return this.selected;
    }

    /**
     * Set Selected Range
     *
     * @param selected {SelectedRange | {from:any, to:any}}
     */
    setSelected(selected) {
        if (selected instanceof SelectedRange) {
            const lastRowIndex = this.data.length - 1;
            const lastColumnIndex = this.header.length - 1;

            if (selected instanceof ColumnRange) {
                selected.setLastRowIndex(lastRowIndex);
            } else if (selected instanceof RowRange) {
                selected.setLastColumnIndex(lastColumnIndex);
            } else if (selected instanceof FullRange) {
                selected.setIndex(lastRowIndex, lastColumnIndex);
            }

            this.selected = selected;
        } else {
            if (selected.from !== undefined) {
                this.selected.from = selected.from;
            }
            if (selected.to !== undefined) {
                this.selected.to = selected.to;
            }
        }
    }
}

export class SelectedRange {
    from = null;
    to = null;

    normalize() {
        return { from: null, to: null };
    }
}

export class CellRange extends SelectedRange {
    from = [-1, -1]
    to = [-1, -1]

    constructor(from = [-1, -1], to = [-1, -1]) {
        super();

        this.from = from;
        this.to = to;
    }

    normalize() {
        const [fx, fy] = this.from;
        const [tx, ty] = this.to;

        return {
            from: [(fx < tx ? fx : tx), (fy < ty ? fy : ty)],
            to: [(fx > tx ? fx : tx), (fy > ty ? fy : ty)]
        };
    }
}

export class ColumnRange extends SelectedRange {
    from = -1;
    to = -1;
    lastRowIndex = -1;

    constructor(from = -1, to = -1) {
        super();

        this.from = from;
        this.to = to;
    }

    setLastRowIndex(lastRowIndex) {
        this.lastRowIndex = lastRowIndex;
    }

    normalize() {
        const { from, to } = this;

        return {
            from: [0, from < to ? from : to],
            to: [this.lastRowIndex, from > to ? from : to]
        };
    }
}

export class RowRange extends SelectedRange {
    from = -1;
    to = -1;
    lastColumnIndex = -1;

    constructor(from = -1, to = -1) {
        super();

        this.from = from;
        this.to = to;
    }

    setLastColumnIndex(lastColumnIndex) {
        this.lastColumnIndex = lastColumnIndex;
    }

    normalize() {
        const { from, to } = this;

        return {
            from: [from < to ? from : to, 0],
            to: [from > to ? from : to, this.lastColumnIndex]
        };
    }
}

export class FullRange extends SelectedRange {
    lastRowIndex = -1;
    lastColumnIndex = -1;

    setIndex(lastRowIndex, lastColumnIndex) {
        this.lastRowIndex = lastRowIndex;
        this.lastColumnIndex = lastColumnIndex;
    }

    normalize() {
        return {
            from: [0, 0],
            to: [this.lastRowIndex, this.lastColumnIndex]
        };
    }
}

export default DataSet;
