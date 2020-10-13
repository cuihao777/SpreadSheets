import Table from "./Table";
import DataSet from "./DataSet";

class SpreadSheets {
    constructor(el, options = {}) {
        this.defaultOptions = {
            defaultColumnWidth: 100,
            defaultRowHeight: 28,
            header: []
        };

        this.options = { ...this.defaultOptions, ...options };

        this.options.header = [
            { title: "Code", width: 100 },
            { title: "Depth 1", width: 80 },
            { title: "Depth 2", width: 80 },
            { title: "Depth 3", width: 100 },
            { title: "Depth 4", width: 130 },
            { title: "Depth 5", width: 60 },
            { title: "Depth 6", width: 60 },
            { title: "TestCase 명", width: 200 },
            { title: "구분0", width: 40 },
            { title: "구분1", width: 40 },
            { title: "구분2", width: 40 },
            { title: "구분3", width: 40 },
            { title: "M/A", width: 40 },
            { title: "통합 테스트 TC", width: 40 },
            { title: "배포체크리스트", width: 40 },
            { title: "배포 필수 체크 리스트", width: 40 },
            { title: "STEP", width: 200, align: 'left' },
            { title: "기대결과", width: 200, align: 'left' },
            { title: "라벨", width: 100 },
            { title: "작성자", width: 100 }
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
    }
}

export default SpreadSheets;
