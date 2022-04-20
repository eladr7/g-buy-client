import React, { useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Categories } from "./consts";
import { ItemsGallery } from "./ItemsGallery";
import "react-tabs/style/react-tabs.css";
import { StoresContextProvider } from "./context/StoresContextProvider";
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

  return (
    <div style={{ width: "100%" }}>
      <StoresContextProvider>
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
              <ItemsGallery category={category} />
            </TabPanel>
          ))}
        </Tabs>
      </StoresContextProvider>
    </div>
  );
};