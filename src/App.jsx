import React from "react";
import PageLayout from "./components/page-layout";
import CatalogList from "./containers/catalog-list";
import CatalogFilter from "./containers/catalog-filter";

function App() {
  return (
    <PageLayout>
      <CatalogFilter />
      <CatalogList />
    </PageLayout>
  )
}

export default App;