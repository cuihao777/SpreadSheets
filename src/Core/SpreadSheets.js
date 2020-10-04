import Container from "./Container";
// import Canvas from './Canvas';
import VerticalScrollBar from './VerticalScrollBar';
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
            { title: "A", width: 100 },
            { title: "B", width: 100 },
            { title: "C", width: 100 },
            { title: "D", width: 100 },
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

        this.container = new Container(el, {});
        this.container.setData(this.options.header, this.data);
        this.container.drawGrid();
        this.vScrollBar = new VerticalScrollBar(this.container);

        this.container.event.on("resize", () => {
            // this.canvas.renderText("hello", 100, 100);
            // this.canvas.drawGrid(this.options.header, this.data, this.options);
        });

        watcher(() => null, document.body);
    }
}

export default SpreadSheets;
