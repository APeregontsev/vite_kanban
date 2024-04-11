import React from "react";
import { render } from "@testing-library/react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { issuesReducer } from "src/store/slices/issues";
import { boardsReducer } from "src/store/slices/board";

export const rootReducer = combineReducers({
  issues: issuesReducer,
  boards: boardsReducer,
});

export function renderWithRedux(Component: React.ReactElement, state = {}) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: state,
  });

  return render(
    <BrowserRouter>
      <Provider store={store}>{Component}</Provider>
    </BrowserRouter>
  );
}
