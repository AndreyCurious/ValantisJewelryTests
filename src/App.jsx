import React from "react";

function App() {
  const getData = async () => {
    const response = await fetch('/', {
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
    <div>{ }</div>
  )
}

export default App;