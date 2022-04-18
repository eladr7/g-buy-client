import React from "react";
import { SecretjsContextProvider } from "./components/context/CalculationsContext";

interface AppProps {}
const App: React.FC<AppProps> = ({}) => {
  return (
    <div className="App">
      <header className="App-header">
        <SecretjsContextProvider>BLAST!</SecretjsContextProvider>
      </header>
    </div>
  );
};

export default App;
