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

        this.setSelected(new CellRange([0, 0], [0, 0]));
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
     * Get cell information from index
     *
     * @param rowIndex {number}
     * @param columnIndex {number}
     * @returns {{x: number, width: number, y: number, height: number}}
     */
    getCellFromIndex(rowIndex, columnIndex) {
        const { defaultColumnWidth, defaultRowHeight } = Config.Table;

        const x = this.cache.width[columnIndex];
        const y = this.cache.height[rowIndex];
        const width = this.header[columnIndex].width || defaultColumnWidth;
        const height = this.data[rowIndex].height || defaultRowHeight;
        const content = this.data[rowIndex].cells[columnIndex];

        return { x, y, width, height, content };
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

    moveTo(position, isSelecting = false, moveToNonBlank = false) {
        position = position.toLowerCase();

        // [A, B, C, D]
        // A = 0, 1 (index position)
        // B = -1, +1 (offset)
        // C = min index, max index (boundary point)
        // D = >, < （compare operator）
        const parameterTable = {
            "left": [1, -1, 0, "<"],
            "right": [1, 1, this.header.length - 1, ">"],
            "up": [0, -1, 0, "<"],
            "down": [0, 1, this.data.length - 1, ">"]
        };

        const parameter = parameterTable[position];

        if (parameter === undefined) {
            return;
        }

        if (this.selected instanceof ColumnRange) {
            const minColumnIndex = 0;
            const maxColumnIndex = this.header.length - 1;

            let nextColumnIndex = isSelecting ? this.selected.to : this.selected.from;

            if (position === "left") {
                if (moveToNonBlank) {
                    nextColumnIndex = 0;
                } else {
                    nextColumnIndex = nextColumnIndex - 1 < minColumnIndex ? minColumnIndex : nextColumnIndex - 1;
                }
            } else if (position === "right") {
                if (moveToNonBlank) {
                    nextColumnIndex = maxColumnIndex;
                } else {
                    nextColumnIndex = nextColumnIndex + 1 > maxColumnIndex ? maxColumnIndex : nextColumnIndex + 1;
                }
            }

            if (isSelecting) {
                this.selected.to = nextColumnIndex;
            } else {
                this.selected = new CellRange([0, nextColumnIndex], [0, nextColumnIndex]);
            }
        } else if (this.selected instanceof RowRange) {
            const minRowIndex = 0;
            const maxRowIndex = this.data.length - 1;

            let nextRowIndex = isSelecting ? this.selected.to : this.selected.from;

            if (position === "up") {
                if (moveToNonBlank) {
                    nextRowIndex = 0;
                } else {
                    nextRowIndex = nextRowIndex - 1 < minRowIndex ? minRowIndex : nextRowIndex - 1;
                }
            } else if (position === "down") {
                if (moveToNonBlank) {
                    nextRowIndex = maxRowIndex;
                } else {
                    nextRowIndex = nextRowIndex + 1 > maxRowIndex ? maxRowIndex : nextRowIndex + 1;
                }
            }

            if (isSelecting) {
                this.selected.to = nextRowIndex;
            } else {
                this.selected = new CellRange([nextRowIndex, 0], [nextRowIndex, 0]);
            }
        } else if (this.selected instanceof CellRange) {
            const [indexPosition, offset, boundaryPoint, compareOperator] = parameter;
            let nextCell = isSelecting ? [...this.selected.to] : [...this.selected.from];
            let nextIndex = nextCell[indexPosition];

            if (moveToNonBlank) {
                const next = () => {
                    nextIndex += offset;
                    nextCell[indexPosition] = nextIndex;
                };

                const prev = () => {
                    nextIndex -= offset;
                    nextCell[indexPosition] = nextIndex;
                };

                const isIndexOverflow = () => {
                    const [rowIndex, columnIndex] = nextCell;

                    if (rowIndex < 0 || rowIndex >= this.data.length) {
                        return true;
                    }

                    return columnIndex < 0 || columnIndex >= this.header.length;
                };

                const isCurrentCellEmpty = () => {
                    const [rowIndex, columnIndex] = nextCell;
                    const text = this.data[rowIndex].cells[columnIndex];
                    return text === undefined || text === null || text === '';
                };

                const isFirstCellEmpty = isCurrentCellEmpty();
                next();
                if (isIndexOverflow()) {
                    prev();
                } else {
                    const isSecondCellEmpty = isCurrentCellEmpty();
                    next();
                    if (isIndexOverflow()) {
                        prev();
                    } else {
                        while (compareOperator === ">" ? (nextIndex <= boundaryPoint) : (nextIndex >= boundaryPoint)) {
                            if (isFirstCellEmpty && !isSecondCellEmpty) {
                                prev();
                                break;
                            } else if (!isFirstCellEmpty && !isSecondCellEmpty) {
                                if (isCurrentCellEmpty()) {
                                    prev();
                                    break;
                                }
                            } else {
                                if (!isCurrentCellEmpty()) {
                                    break;
                                }
                            }

                            next();
                        }

                        if (isIndexOverflow()) {
                            prev();
                        }
                    }
                }
            } else {
                if (compareOperator === ">") {
                    nextIndex = nextIndex + offset > boundaryPoint ? boundaryPoint : nextIndex + offset;
                } else {
                    nextIndex = nextIndex + offset < boundaryPoint ? boundaryPoint : nextIndex + offset;
                }
            }

            nextCell[indexPosition] = nextIndex;

            if (isSelecting) {
                this.selected.to = nextCell;
            } else {
                this.selected = new CellRange(nextCell, nextCell);
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
