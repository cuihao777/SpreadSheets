function escape(text) {
    if (/([\t\n])/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    } else {
        return text;
    }
}

export function stringify(data) {
    let result = '';

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            result += escape(cell) + "\t";
        }
        result += "\r\n";
    }

    return result;
}
