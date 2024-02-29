import React from "react";
import PageLayout from "./components/page-layout";
import CatalogList from "./containers/catalog-list";

function App() {

  // почему то на vercel не перезаписывает запрос на прокси, хотя конфиг я написал - vercel.json (выдает 405 ошибку), 
  // так бы можно было использовать сокращенный url для запроса - "/"
  // в вебпаке прокси работает нормально

  return (
    <PageLayout>
      <CatalogList />
    </PageLayout>
  )
}

export default App;