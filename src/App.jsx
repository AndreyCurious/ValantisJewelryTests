import React from "react";
import md5 from "md5";

function App() {
  const getData = async () => {
    const response = await fetch('https://api.valantis.store:41000/', {
      method: "POST",
      headers: {
        "X-Auth": "70e9e15f52c7209ab6b6f80b795aa4f2",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "action": "get_ids",
        "params": { "offset": 10, "limit": 3 }
      })

    })
    console.log(await response.json())
    return response;
  }
  getData()
  return (
    <div> </div>
  )
}

export default App;