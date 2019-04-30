import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { transformColumn } from './helpers.jsx';
import { formatDate } from '/imports/both/helpers';
// import _ from 'lodash';

class ControlledTable extends Component {
  constructor(props) {
    super(props);
    const {
      page,
      onPageChange,
      onPageSizeChange,
    } = props;
    const defaultPageSizeChange = (pageSize, pageIndex) => this.setState({ pageIndex, pageSize });
    const defaultPageChange = (pageIndex) => this.setState({ pageIndex });
    this.onPageChange = onPageChange || defaultPageChange;
    this.onPageSizeChange = onPageSizeChange || defaultPageSizeChange;
    this.page = page;

    const columns = (props || {}).options.columns.map(transformColumn);
    this.state = {
      filter: '',
      columns,
      data: ((props || {}).data) || [],
      pages: null,
      loading: true,
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterColumns = this.filterColumns.bind(this);
  }

  fetchData(state /* , instance*/) {
    this.setState({ loading: true });
    // const columnsMap =
    //   this.state.columns.reduce((acc, value) => ({ ...acc, [value.id]: value }), {});

    if (this.props.loadData) {
      this.props.loadData(
        state.page,
        state.pageSize,
        state.sorted,
        state.filtered,
        (res) => {
          this.setState({
            data: res.data,
            pages: res.pages,
            loading: false,
          });
          /*
          let filteredData = res.data;
          const { pageSize, page, sorted, filtered } = state;
          if (filtered.length) {
            const reducer = (filteredSoFar, nextFilter) =>
              filteredSoFar.filter((row) => {
                const column = columnsMap[nextFilter.id];
                if (column.filterMethod) {
                  return columnsMap[nextFilter.id].filterMethod(nextFilter, row, column);
                }
                if (row[nextFilter.id] instanceof Date) {
                  return formatDate(row[nextFilter.id]).includes(nextFilter.value.toLowerCase());
                }
                return (`${row[nextFilter.id]}`)
                  .toLowerCase().includes(nextFilter.value.toLowerCase());
              });
            filteredData = filtered.reduce(reducer, filteredData);
          }
          // console.log('res, sorted', res, sorted);
          const sortedData = _.orderBy(
            filteredData,
            sorted.map(({ id }) => (row) => {
              const selected = row[id];
              if (selected === null) return -Infinity;
              if (selected === undefined) return -Infinity;
              if (typeof selected === 'string') return selected.toLowerCase();
              return selected;
            }),
            sorted.map(d => (d.desc ? 'desc' : 'asc'))
          );

          return this.setState({
            data: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            // pages: Math.ceil(filteredData.length / pageSize),
            pages: res.pages,
            loading: false,
          });
          */
        });
    }
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

  handleChange(event) {
    const { target } = event;
    const { value: inputValue = '' } = target;
    this.setState({
      filter: inputValue,
    });
  }

  render() {
    const { data, pages, loading, columns } = this.state;
    const minSize = Math.min(50, data.length);
    const defaultPageSize = [5, 10, 20, 25, 50, 100]
      .find((curr) => (curr - minSize) < 0);
    const { globalFilter } = this.props;
    const { filter } = this.state;
    const filteredData = this.filterColumns(data, columns, filter);
    return (
      <div style={{ padding: '0', margin: '0' }}>
        {globalFilter && <div
          id="DataTables_Table_0_filter" className="dataTables_filter"
          style={{ display: 'inline-block', padding: '10px' }}
        >
          <label>Search:<input
            type="search" className="form-control input-sm"
            value={filter}
            onChange={this.handleChange}
            placeholder="" aria-controls="DataTables_Table_0"
          />
          </label>
        </div>}
        <ReactTable
          columns={columns}
          // Forces table not to paginate or sort automatically, so we can handle it server-side:
          manual
          resizable={false}
          data={filteredData}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          filterable={!globalFilter}
          defaultPageSize={defaultPageSize}
          className="-highlight"
        />
      </div>
    );
  }
}

export default ControlledTable;
