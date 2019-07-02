import React from 'react';
import { Provider } from 'react-redux';
import store from '/imports/ui/models/store';


const StoreProvider = ({ container }, ...props) => {
  return (
    <Provider store={store}>
      {container(props)}
    </Provider>
  );
};

export default StoreProvider;
