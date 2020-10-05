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

        this.width = 100;
        this.height = 100;

        for (let i = 0; i < this.header.length; i++) {
            this.width += (this.header[i].width || defaultColumnWidth);
        }

        for (let i = 0; i < this.data.length; i++) {
            this.height += (this.data[i].height || defaultRowHeight);
        }
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}


export default DataSet;
