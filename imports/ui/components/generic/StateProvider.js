import React, { createContext, useContext, useReducer } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children, actions }) => (
  <StateContext.Provider value={[...useReducer(reducer, initialState), actions]}>
    {children}
  </StateContext.Provider>
);

export const useStateReducerActions = () => useContext(StateContext);
