import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Categories } from "./consts";
import ObservedItemsGallery from "./ItemsGallery";
import "react-tabs/style/react-tabs.css";
import {
  keyboardsStore,
  laptopsStore,
  mousePadsStore,
  mousesStore,
} from "../components/context/CategoryStore";

interface CategoryTabsProps {}
export const CategoryTabs: React.FC<CategoryTabsProps> = ({}) => {
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
        <TabPanel>
          <h2>Join a {Categories[0]} purchasing group</h2>
          <ObservedItemsGallery
            category={Categories[0].toLowerCase()}
            store={laptopsStore}
          />
        </TabPanel>
        <TabPanel>
          <h2>Join a {Categories[1]} purchasing group</h2>
          <ObservedItemsGallery
            category={Categories[1].toLowerCase()}
            store={keyboardsStore}
          />
        </TabPanel>
        <TabPanel>
          <h2>Join a {Categories[2]} purchasing group</h2>
          <ObservedItemsGallery
            category={Categories[2].toLowerCase()}
            store={mousesStore}
          />
        </TabPanel>
        <TabPanel>
          <h2>Join a {Categories[3]} purchasing group</h2>
          <ObservedItemsGallery
            category={Categories[3].toLowerCase()}
            store={mousePadsStore}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};
