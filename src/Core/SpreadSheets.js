import Table from "./Table";
import DataSet from "./DataSet";
// import Canvas from './Canvas';
// import VerticalScrollBar from './VerticalScrollBar';
import { watcher } from '@/Clipboard/Watcher';

class SpreadSheets {
    sheets = [];

    constructor(el, options = {}) {
        this.defaultOptions = {
            defaultColumnWidth: 100,
            defaultRowHeight: 28,
            header: []
        };

        this.options = { ...this.defaultOptions, ...options };

        this.options.header = [
            { title: "Hello World", width: 100 },
            { title: "Name", width: 100, align: 'left' },
            { title: "Password", width: 100, align: 'right' },
            { title: "D", width: 133 },
            { title: "E", width: 100 },
            { title: "F", width: 100 },
            { title: "G", width: 100 },
            { title: "H", width: 100 },
            { title: "I", width: 100 }
        ];

        this.data = [
            { cells: ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8"] },
            { cells: ["2-1", "2-2", "2-3", "2-4", "2-5", "2-6", "2-7", "2-8"] },
            { height: 50, cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { height: 100, cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { height: 100, cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { height: 80, cells: ["12-1", "12-2", "12-3", "12-4", "12-5", "12-6", "12-7", "12-8"] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: ["15-1", "15-2", "15-3", "15-4", "15-5", "15-6", "15-7", "15-8"] }
        ];

        if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el);
        }

        this.table = new Table(el, {});

        const dataSet = new DataSet({
            header: this.options.header,
            data: this.data
        });

        dataSet.setFirstCellPositionOnViewport(0, 0);

        this.table.setDataSet(dataSet);
        this.table.render();
        // this.vScrollBar = new VerticalScrollBar(this.container);

        // this.container.event.on("resize", () => {
        //     // this.canvas.renderText("hello", 100, 100);
        //     // this.canvas.drawGrid(this.options.header, this.data, this.options);
        // });

        watcher(() => null, document.body);
    }
}

export default SpreadSheets;
