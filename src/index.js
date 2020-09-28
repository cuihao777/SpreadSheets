import './css/index.scss'
import Container from "./Core/Container";
import Canvas from './Core/Canvas'
import VerticalScrollBar from './Core/VerticalScrollBar'
import { watcher } from './Clipboard/Watcher'

class HelloWorld {
    constructor() {
        this.data = {
            rowInfo: [
                { column: 30 },
                { column: 60 },
                { column: 50 },
                { column: 50 },
                { column: 30 },
                { column: 30 },
                { column: 30 },
                { column: 30 },
                { column: 30 },
                { column: 30 }
            ],
            columnInfo: [
                { width: 150 },
                { width: 100 },
                { width: 200 },
                { width: 100 },
                { width: 200 },
                { width: 200 },
                { width: 200 },
                { width: 200 },
                { width: 200 },
                { width: 200 }
            ]
        };

        this.container = new Container(document.getElementById("app"), {});
        this.canvas = new Canvas(this.container, {});
        this.vScrollBar = new VerticalScrollBar(this.container);
        this.vScrollBar.height = 1000;
        this.vScrollBar.top = 200;

        this.container.event.on("resize", () => {
            this.canvas.renderText("hello", 100, 100);
            this.drawGrid();
        });

        watcher(() => null, document.body);
    }

    drawGrid() {
        const maxWidth = this.canvas.size.width;
        const maxHeight = this.canvas.size.height;

        let rowEndpoint = 0;
        let columnEndpoint = 0;

        for (let i = 0; i < this.data.columnInfo.length; i++) {
            rowEndpoint += this.data.columnInfo[i].width;

            if (rowEndpoint > maxWidth) {
                rowEndpoint = maxWidth;
                break;
            }
        }

        for (let i = 0; i < this.data.rowInfo.length; i++) {
            columnEndpoint += this.data.rowInfo[i].column;

            if (columnEndpoint > maxHeight) {
                columnEndpoint = maxHeight;
                break;
            }
        }

        for (let i = 0, s = 0; i < this.data.rowInfo.length; i++) {
            let row = this.data.rowInfo[i];
            s += row.column;

            this.canvas.context.save();
            this.canvas.context.translate(-0.5, -0.5);
            this.canvas.context.moveTo(0, s);
            this.canvas.context.lineTo(rowEndpoint, s);
            this.canvas.context.strokeStyle = "#d4d4d4";
            this.canvas.context.stroke();
            this.canvas.context.restore();
        }

        for (let i = 0, s = 0; i < this.data.columnInfo.length; i++) {
            let column = this.data.columnInfo[i];
            s += column.width;

            this.canvas.context.save();
            this.canvas.context.translate(-0.5, -0.5);
            this.canvas.context.moveTo(s, 0);
            this.canvas.context.lineTo(s, columnEndpoint);
            this.canvas.context.strokeStyle = "#d4d4d4";
            this.canvas.context.stroke();
            this.canvas.context.restore();
        }
    }


    // onPaste = (data) => {
    //     this.container.innerHTML = "";
    //     const table = document.createElement("table");
    //     const tbody = document.createElement("tbody");
    //     table.appendChild(tbody);
    //
    //     data.forEach(record => {
    //         const tr = document.createElement("tr");
    //         tbody.appendChild(tr);
    //
    //         record.forEach(value => {
    //             const td = document.createElement("td");
    //             td.innerText = value;
    //             tr.appendChild(td);
    //         });
    //     });
    //
    //     table.className = "test";
    //     this.container.appendChild(table);
    // }
}

new HelloWorld();
