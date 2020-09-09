import './css/index.scss'
import { watcher } from './Clipboard/Watcher'

class HelloWorld {
    constructor() {
        this.container = document.createElement("div");
        this.container.className = "container";
        document.body.appendChild(this.container);

        watcher(this.onPaste, this.container);
    }

    onPaste = (data) => {
        this.container.innerHTML = "";
        const table = document.createElement("table");
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        data.forEach(record => {
            const tr = document.createElement("tr");
            tbody.appendChild(tr);

            record.forEach(value => {
                const td = document.createElement("td");
                td.innerText = value;
                tr.appendChild(td);
            });
        });

        table.className = "test";
        this.container.appendChild(table);
    }
}

new HelloWorld();