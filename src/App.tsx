import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { Login } from "./components/Login";

interface AppProps {}
const App: React.FC<AppProps> = ({}) => {
  const [viewingKey, setViewingKey] = useState<string | undefined>();

  useEffect(() => {
    let viewingKeyFromStorage = localStorage.getItem("viewing-key");
    if (viewingKeyFromStorage) {
      setViewingKey(viewingKeyFromStorage);
    }
  }, []);
  return (
    <div className="App">
      {viewingKey ? <MainPage /> : <Login setViewingKey={setViewingKey} />}
      {/* <BrowserRouter>
        <div>
          <Route exact path="/" component={Login} />
          <Route exact path="/main" component={MainPage} />
        </div>
      </BrowserRouter> */}
    </div>
  );
};

export default App;
