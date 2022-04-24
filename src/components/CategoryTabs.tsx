import React, { useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Categories } from "./consts";
import { ItemsGallery } from "./ItemsGallery";
import "react-tabs/style/react-tabs.css";
import { StoreContextProvider } from "./context/StoreContextProvider";
import { SecretjsContext } from "./context/SecretjsContext";

interface CategoryTabsProps {}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({}) => {
  const { keplrReady } = useContext(SecretjsContext);
  if (!keplrReady) {
    return (
      <>
        <h1>Waiting for Keplr wallet integration...</h1>
      </>
    );
  }

  // Elad: Separate for 4 different stores - to prevent re-rendering
  // the entire array on a store update
  return (
    <div style={{ width: "100%" }}>
      <Tabs>
        <TabList
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {Categories.map((category: string) => (
            <Tab>{category}</Tab>
          ))}
        </TabList>
        {Categories.map((category: string) => (
          <TabPanel>
            <h2>Join a {category.toLowerCase()} purchasing group</h2>
            <StoreContextProvider>
              <ItemsGallery category={category} />
            </StoreContextProvider>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};
