import { prependOnceListener } from "process";
import React, {useState, useEffect} from "react";
import {betting_backend} from "../../../declarations/betting_backend"
import Bet from "./Bet";


function TableRow(props) {
    const _tb = props.totalBets.toLocaleString();
    const _id = props.id.toLocaleString();
    const _ba = props.betsOnA.toLocaleString();
    const _bb = props.betsOnB.toLocaleString();

    const [show, setShow] = useState(true);

    function showBet(value) {
        setShow(value);
    }

    return ( 
        <tr>
            <td>{props.name}</td>
            <td>{_tb} ICB</td>
            <td>{props.optionA}: {_ba}</td>
            <td>{props.optionB}: {_bb}</td>
            <td></td>
            <td>{_id}</td>
            <td><button onClick={() => {showBet(false);}}>BET!</button></td>
            <Bet
            show={show}
            id={props.id}
            name={props.name}
            opA={props.optionA}
            opB={props.optionB}
            bA={props.betsOnA}
            bB={props.betsOnB}
            tb={props.totalBets}
            onHide={showBet} />
        </tr>
    )
}

export default TableRow;