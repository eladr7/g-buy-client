import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { Login } from "./components/Login";

interface AppProps {}
const App: React.FC<AppProps> = ({}) => {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Login} />
          <Route exact path="/main" component={MainPage} />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
