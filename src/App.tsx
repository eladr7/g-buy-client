import React from "react";
import { CategoryTabs } from "./components/CategoryTabs";
import { SecretjsContextProvider } from "./components/context/SecretjsContext";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

interface AppProps {}
const App: React.FC<AppProps> = ({}) => {
  return (
    <div className="App">
      <SecretjsContextProvider>
        <Header />
        <CategoryTabs />
        <Footer />
      </SecretjsContextProvider>
    </div>
  );
};

export default App;
