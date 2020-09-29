let sheetId = 1;

class Sheet {
    constructor(options = {}) {
        this.name = options.name || 'Sheet ' + sheetId;
        this.header = options.header || [];
        this.data = [];

        sheetId++;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }
}

export default Sheet;
