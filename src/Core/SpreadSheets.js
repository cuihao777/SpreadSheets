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
            { title: "F", width: 100 }
        ];

        this.data = [
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { height: 50, cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { height: 100, cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { height: 100, cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { height: 80, cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] },
            { cells: [1, 2, 3, 4, 5, 6, 7, 8] }
        ];

        if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el);
        }

        this.table = new Table(el, {});

        const dataSet = new DataSet({
            header: this.options.header,
            data: this.data
        });

        dataSet.setFirstCellPositionOnViewport(5, 3);

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
