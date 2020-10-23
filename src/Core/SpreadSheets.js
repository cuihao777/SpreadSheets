import Table from "./Table";
import DataSet, { CellRange, ColumnRange, FullRange, RowRange } from "./DataSet";
import '../css/index.scss';

export {
    Table,
    DataSet
}

const SpreadSheets = {
    Table,
    DataSet,
    CellRange,
    RowRange,
    ColumnRange,
    FullRange
};

window.SpreadSheets = SpreadSheets;

export default SpreadSheets;
