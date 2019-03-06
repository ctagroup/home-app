import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { transformColumn, formatDate } from './helpers.jsx';

class DataTable extends Component {
  // Universal search/filter
  constructor(props) {
    super(props);
    const columns = (props || {}).options.columns.map(transformColumn);
    this.state = {
      filter: '',
      data: (props || {}).data,
      columns,
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterColumns = this.filterColumns.bind(this);
    this.columnsMap =
      this.state.columns.reduce((acc, value) => ({ ...acc, [value.id]: value }), {});
  }

  handleChange(event) {
    const { target } = event;
    const { value: inputValue = '' } = target;
    this.setState({
      filter: inputValue,
    });
  }

  filterColumns(input, columns, filter) {
    if (!filter || filter === '') return input;

    const matchColumns = columns.filter(({ data }) => data !== '_id');
    const lowerCaseFilter = filter.toLowerCase();
    return input.filter(item => {
      const out = matchColumns.map((column) =>
          ({ filterMethod: column.filterMethod, column }))
        .find(({ filterMethod, column }) => {
          let data = item[column.data];
          if (filterMethod) {
            if (column.dataAccessor) data = column.dataAccessor(item);
            return data !== undefined && filterMethod({ value: lowerCaseFilter }, item, column);
          }
          if (data instanceof Date) {
            return formatDate(data).includes(lowerCaseFilter);
          }
          return data !== undefined && data.toString().toLowerCase().includes(lowerCaseFilter);
        });
      return out !== false && out !== undefined;
    });
  }

  render() {
    const { data, columns, filter } = this.state;
    const filteredData = this.filterColumns(data, columns, filter);

    const minSize = Math.min(50, data.length);
    const defaultPageSize = [5, 10, 20, 25, 50, 100]
      .find((curr) => (curr - minSize) > 0);
    return (
      <div style={{ padding: '10px' }}>
        <div
          id="DataTables_Table_0_filter" className="dataTables_filter"
          style={{ display: 'inline-block' }}
        >
          <label>Search:<input
            type="search" className="form-control input-sm"
            value={filter}
            onChange={this.handleChange}
            placeholder="" aria-controls="DataTables_Table_0"
          />
          </label>
        </div>
        <ReactTable
          resizable={false}
          data={filteredData}
          columns={columns}
          defaultPageSize={defaultPageSize}
          className="-highlight"
        />
      </div>
    );
  }
}

export default DataTable;
