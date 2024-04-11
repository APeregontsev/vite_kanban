import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/Router";
import { ToastContainer } from "react-toastify";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={<>loading...</>} persistor={persistor}>
          <AppRouter />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
