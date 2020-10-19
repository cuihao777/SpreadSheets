import Table from "./Table";
import DataSet from "./DataSet";
import '../css/index.scss';

export {
    Table,
    DataSet
}

const SpreadSheets = { Table, DataSet };

window.SpreadSheets = SpreadSheets;

export default SpreadSheets;
