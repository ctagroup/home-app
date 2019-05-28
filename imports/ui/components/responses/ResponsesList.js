import React from 'react';
import ResponsesTable from './ResponsesTable';


// Responses Container/Page - holds all the data...

// const Context = React.createContext(null);

// const initialState = {
//   loading: false,
//   responses: [],
// };

// export function reducer(state, action) {
//   switch (action.type) {
//     case 'LOADIND':
//       return {
//         ...state,
//         loading: true,
//       }
//     case 'SET_RESPONSES':
//       return {
//         ...state,
//         responses: action.responses,
//         loading: false,
//       }
//     default:
//       return state;
//   }
// }

const ResponsesList = () => <ResponsesTable />;

export default ResponsesList;
