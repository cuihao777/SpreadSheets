function escape(text) {
    if (/([\t\n])/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    } else {
        return text;
    }
}

export function stringify(data) {
    let result = [];

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const newRow = [];

        for (let j = 0; j < row.length; j++) {
            const cell = escape(row[j]);
            newRow.push(cell);
        }

        result.push(newRow.join("\t"));
    }

    return result.join("\r\n");
}
