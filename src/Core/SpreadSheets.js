import Table from "./Table";
import DataSet from "./DataSet";
import { watcher } from '@/Clipboard/Watcher';

class SpreadSheets {
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
            { title: "I", width: 100 },
            { title: "J", width: 200, align: 'right' }
        ];

        this.data = [];

        for (let i = 1; i <= 100000; i++) {
            const row = { height: 24, cells: [] };
            for (let j = 1; j <= 10; j++) {
                row.cells.push(`${i}-${j}`);
            }
            this.data.push(row);
        }

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

        watcher(() => null, document.body);
    }
}

export default SpreadSheets;
