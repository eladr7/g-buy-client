import React from "react";
import { SecretjsContextProvider } from "./components/context/SecretjsContext";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { Login } from "./components/Login";

interface AppProps {}
const App: React.FC<AppProps> = ({}) => {
  return (
    <div className="App">
      <SecretjsContextProvider>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={Login} />
            <Route exact path="/main" component={MainPage} />
          </div>
        </BrowserRouter>
      </SecretjsContextProvider>
    </div>
  );
};

export default App;
