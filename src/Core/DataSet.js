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
}


export default DataSet;
