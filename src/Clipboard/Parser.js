function collectQuotesText(text) {
    let i = 1;
    let tempText = '';
    let isMultiLine = false;

    while (i < text.length) {
        if (text.substr(i, 2) === '""') {
            tempText += '"';
            i += 2;
            isMultiLine = true;
            continue;
        }

        if (text.charAt(i) === '\t') {
            tempText += '\t';
            i++;
            isMultiLine = true;
            continue;
        }

        if (text.substr(i, 2) === '\r\n') {
            tempText += '\r\n';
            i += 2;
            isMultiLine = true;
            continue;
        }

        if (text.charAt(i) === '"') {
            break;
        }

        tempText += text.charAt(i);
        i++;
    }

    return {
        text: isMultiLine ? tempText : `"${tempText}"`,
        step: i + 1
    };
}

export function parse(text) {
    const data = [];
    let row = 0;
    let field = '';

    let i = 0;
    let firstColumnIndex = Number.MAX_VALUE;
    let lastColumnIndex = 0;
    let firstRowIndex = Number.MAX_VALUE;
    let lastRowIndex = 0;

    function checkColumnBoundary() {
        const currentColumnIndex = data[row].length;
        const isEmpty = field === '';

        if (!isEmpty && currentColumnIndex < firstColumnIndex) {
            firstColumnIndex = currentColumnIndex;
        }

        if (!isEmpty && currentColumnIndex > lastColumnIndex) {
            lastColumnIndex = currentColumnIndex;
        }
    }

    function checkRowBoundary() {
        const isEmptyRow = data[row].filter(cell => cell !== '').length === 0;

        if (!isEmptyRow && lastRowIndex < row) {
            lastRowIndex = row;
        }

        if (!isEmptyRow && firstRowIndex > row) {
            firstRowIndex = row;
        }
    }

    while (i < text.length) {
        if (data[row] === undefined) {
            data[row] = [];
        }

        if (text.charAt(i) === '"') {
            const result = collectQuotesText(text.substr(i));
            field += result.text;
            i += result.step;
            continue;
        }

        if (text.charAt(i) === '\t') {
            checkColumnBoundary();
            data[row].push(field.trim());
            field = "";
            i++;
            continue;
        }

        if (text.slice(i, i + 2) === '\r\n') {
            checkColumnBoundary();
            data[row].push(field.trim());
            checkRowBoundary();

            field = "";
            i += 2;
            row++;
            continue;
        }

        field += text.charAt(i);
        i++;
    }

    if (firstColumnIndex === Number.MAX_VALUE) {
        return [];
    }

    // 바깥 공백열, 공백줄 제거
    return data.slice(firstRowIndex, lastRowIndex + 1).map(row => row.slice(firstColumnIndex, lastColumnIndex + 1));
}
