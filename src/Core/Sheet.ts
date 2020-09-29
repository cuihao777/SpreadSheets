import { Header, Row } from "./SpreadSheets";

let sheetId = 1;

interface SheetOptions {
    name?: string;
    header: Header[];
}

class Sheet {
    name: string;
    header: Header[];
    data: Row[];

    constructor(options: SheetOptions) {
        this.name = options.name || 'Sheet ' + sheetId;
        this.header = options.header || [];
        this.data = [];

        sheetId++;
    }

    getData(): Row[] {
        return this.data;
    }

    setData(data: Row[]): void {
        this.data = data;
    }
}

export default Sheet;
