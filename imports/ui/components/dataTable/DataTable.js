import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const transformColumn = (column) => {
  let accessor;
  if (column.render) {
    if (column.data) {
      accessor = (value) => column.render(value[column.data], 'type', value);
    } else {
      accessor = column.render;
    }
  } else {
    accessor = column.data;
  }
  const transformed = {
    id: column._id,
    accessor,
    Header: column.title,
  };
  return transformed;
  // ...column,
  // id: column.
};

// const range = len => {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(i);
//   }
//   return arr;
// };

// const newPerson = () => {
//   const statusChance = Math.random();
//   return {
//     firstName: `first${statusChance}`,
//     lastName: `Last${statusChance}`,
//     age: Math.floor(Math.random() * 30),
//     visits: Math.floor(Math.random() * 100),
//     progress: Math.floor(Math.random() * 100),
//     status:
//       statusChance > 0.66 //eslint-disable-line
//         ? 'relationship'
//         : statusChance > 0.33 ? 'complicated' : 'single',
//   };
// };

// function makeData(len = 5553) {
//   return range(len).map(() => (
//     {
//       ...newPerson(),
//       children: range(10).map(newPerson),
//     }
//   ));
// }


class DataTable extends Component {
  constructor(props) {
    super(props);
    const columns = props.tableOptions.columns.map(transformColumn);
    this.state = {
      data: props.tableData,
      columns,
    };
  }
  render() {
    const { data, options } = this.state;
    const columns = options.columns;
    // columns = [
    //   {
    //     // Header: 'Name',
    //     // columns: [
    //     //   {
    //     Header: 'First Name',
    //     accessor: 'firstName',
    //   },
    //   {
    //     Header: 'Last Name',
    //     id: 'lastName',
    //     accessor: d => d.lastName,
    //   },
    //     // ],
    //   // },
    //   {
    //     // Header: 'Info',
    //     // columns: [
    //     //   {
    //     Header: 'Age',
    //     accessor: 'age',
    //   },
    //   {
    //     Header: 'Status',
    //     accessor: 'status',
    //   },
    //     // ],
    //   // },
    //   {
    //     // Header: 'Stats',
    //     // columns: [
    //     //   {
    //     Header: 'Visits',
    //     accessor: 'visits',
    //     //   },
    //     // ],
    //   },
    // ]
    return (
      <div>
        <ReactTable
          filterable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
//   constructor(props) {
//     super(props);

//     // this.state = {
//     //   value: 0,
//     //   maskedValue: '0,00',
//     // };
//     // this.initialState = {
//     //   value: 0,
//     //   maskedValue: '0,00',
//     // };
//     // this.handleChange = this.handleChange.bind(this);
//     // this.setInitialValues = this.setInitialValues.bind(this);
//   }

// //   componentDidMount() {
// //     this.setInitialValues();
// //   }

// //   componentDidUpdate(prevProps) {
// //     const { defaultValue: prevGivenDefaultValue } = prevProps;
// //     const { defaultValue: givenDefaultValue } = this.props;

// //     if (givenDefaultValue !== prevGivenDefaultValue) {
// //       this.setInitialValues();
// //     }

// //     const valueFromProps = parseFloat(this.props.value) || 0;
// //     const valueFromState = parseFloat(this.state.value);

// //     if (valueFromProps !== valueFromState) {
// //     this.setState({ // eslint-disable-line
// //       value: valueFromProps,
// //       maskedValue: this.maskValue(valueFromProps),
// //     });
// //     }
// //   }

// //   setInitialValues() {
// //     const { value: givenValue, defaultValue: givenDefaultValue } = this.props;

// //     const value = givenValue || givenDefaultValue;
// //     const maskedValue = this.maskValue(value);

// //     this.setState({
// //       value,
// //       maskedValue,
// //     });
// //   }

//   handleChange(event) {
//     const { target } = event;
//     const { value: inputValue = 0 } = target;
//     const { onChange } = this.props;

//     const value = this.unmaskValue(inputValue);
//     // const maskedValue = this.maskValue(value);

//     this.setState({
//       value,
//     //   maskedValue,
//     });

//     if (!onChange || typeof onChange !== 'function') {
//       return false;
//     }

//     return onChange(event, value /* , maskedValue*/);
//   }

//   unmaskValue(maskedValue = '') {
//     return parseInt(maskedValue.replace(/\D/g, '') || 0, 10) / 100;
//   }

//   render() {
//     // const { name: inputName, className, style, disabled } = this.props;
//     // const { maskedValue } = this.state;

//     return (

//     );
//   }
}

export default DataTable;
