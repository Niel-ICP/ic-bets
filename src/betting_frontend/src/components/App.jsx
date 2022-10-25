import React, { useEffect, useState } from "react";
import BetTable from "./BetTable";
import {AuthClient } from "@dfinity/auth-client";
import { betting_backend, canisterId, createActor } from "../../../declarations/betting_backend/index";

function App() {
  const [betIndex, setBetIndex]= useState();
  // const [idnt, setIdnt] = useState();
  

  function handleChange(event) {
    const i = parseInt(event.target.value);
    setBetIndex(i);
  }

  // async function getIdentity() {
  //   const authClient = await AuthClient.create();
  //   const identity = await AuthClient.getIdentity();
  //   setIdnt(identity);

  //   const authenticatedCanister = createActor(canisterId, {
  //     agentOptions: {
  //       identity,
  //     },  
  //   });
  // }
  // useEffect(() => getIdentity(), [])

  return (
    <div>
      <div>
        <input type="number" value={betIndex} onChange={handleChange}/>
        <button>Find Bet by id</button>
        <br />
        <input type="text" /><button>Find Bet by tags</button>
      </div>
      <div>
        <BetTable />
      </div>
    </div>
  );
}

export default App;
