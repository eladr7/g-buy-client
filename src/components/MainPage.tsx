import React from "react";
import { CategoryTabs } from "./CategoryTabs";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  return (
    <div>
      <Header />
      <CategoryTabs />
      <Footer />
    </div>
  );
};
