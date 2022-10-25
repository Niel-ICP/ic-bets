import React, {useState, useEffect} from "react";
import {betting_backend} from "../../../declarations/betting_backend"
import {Principal} from "@dfinity/principal";
import TableRow from "./TableRow.jsx";


function Table() {
    const [bets, setBets] = useState([]);
    const [totalBets, setTB] = useState();
    const [principal, setPrincipal] = useState(Principal.fromText("2vxsx-fae"));
    const [balance, setBalance] = useState();
    const [feedback, setFeedback] = useState("");
    const [disabled, setDisabled] = useState(false);
    
    async function getBets() {
        setBets([]);
        const tb = await betting_backend.getBetsSize();
        var i = 0;
        for(i;i < tb;i++) {
            var _bet = await betting_backend.viewBet(i);
            setBets(prevBets => {
                return [_bet, ...prevBets];
            });
            // addBet(_bet);
        }
        var _b = await betting_backend.viewBalance(principal);
        setBalance(_b.toLocaleString());
    }

    async function mintICB() {
        setDisabled(true);
        const _fb = await betting_backend.mintICB();
        setFeedback(_fb);
        setDisabled(false);
        getBets();
    }

    useEffect(() => {getBets()}, [])
    
    return (
        <div>
            <h2 style={{display:"inline-block"}}>ICB Balance: {balance}</h2>
            <button disabled={disabled} style={{display:"inline-block"}} onClick={() => mintICB()}>Click for free 10.000 ICB</button>
            <p>{feedback}</p>
        <button onClick={getBets}>Refresh Bets</button>
        <p>{totalBets}</p>

        
        <table>
            <tbody>
            <tr>
                <th>
                    Name
                </th>
                <th>
                    Total Bets
                </th>
                <th>
                    Option A
                </th>
                <th>
                    Option B
                </th>
                <th>
                    Odds
                </th>
                <th>
                    ID
                </th>
            </tr>
            {bets.map((betContent, index) => {
                return (
                    <TableRow
                    key={index}
                    id={betContent.id}
                    name={betContent.name}
                    totalBets={betContent.totalBets}
                    optionA={betContent.optionA}
                    optionB={betContent.optionB}
                    betsOnA={betContent.betsOnA}
                    betsOnB={betContent.betsOnB}
                    principal={principal} />
                )
            })}
            </tbody>
        </table>
        </div>
    )
}

export default Table;