import React, {useEffect, useState} from "react";
import { isGeneratorObject } from "util/types";
import {betting_backend} from "../../../declarations/betting_backend"
import {Principal} from "@dfinity/principal";

function Bet(props) {
    const [userBet, setUserBet] = useState({});
    const [bet, setBet] = useState({});
    const [tb, setTb] = useState();
    const [amountUserBet, setAmountBetted] = useState(0);
    const [optionPicked, setOptionPicked] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [principal, setPrincipal] = useState(Principal.fromText("2vxsx-fae"));
    const [betA, setBetA] = useState();
    const [betB, setBetB] = useState();
    const [disabled, setDisabled] = useState(false);
    const [winnerShow, setWinnerShow] = useState(true);
    const [winningsToCollect, setWinnings] = useState(0);
    const [withdrawFb, setWithdrawFb] = useState("");
    const [winner, setWinner] = useState("");
    const [collected, setCollected] = useState("");


    async function getUserBet() {
        var _ub = await betting_backend.viewUser(principal, props.id);
        var _bet = await betting_backend.viewBet(props.id);
        var _aub = _ub.amountBetted.toLocaleString();
        setAmountBetted(_aub);
        var _w = _bet.winner.toLocaleString();
        var _winnings;
        if(_bet.betsClosed) {
            if(_w == "0") {
                setWinner(_bet.optionA);
            }
            if(_w == "1") {
                setWinner(_bet.optionB);
            }
        }
        if(_ub.winningsCollected==true) {
            setCollected("Winnings have already been collected");
        }
        if (_ub.optionPicked.toLocaleString() == _w && _ub.winningsCollected == false) {
            setWinnerShow(false);
            _winnings = await betting_backend.calculateWinnings(principal, parseInt(props.id));
            _winnings = _winnings.toLocaleString();
            setWinnings(_winnings);
        }
        var _option;
        if(_ub.optionPicked.toLocaleString() == "0") {
            _option = _bet.optionA;
        }
        if(_ub.optionPicked.toLocaleString() == "1") {
            _option = _bet.optionB;
        }
        setOptionPicked(_option);
        setUserBet(_ub);
    }

    async function updateValues() {
        var _b = await betting_backend.viewBet(props.id);
        setBet(_b);
        var _tb = _b.totalBets.toLocaleString();
        setTb(_tb)
        getUserBet();
    }

    function changeBetA(event) {
        setBetA(event.target.value);
    }

    async function collectWinnings() {
        setDisabled(true);
        await betting_backend.collectWinnings(parseInt(props.id));
        setDisabled(false);
        refresh();
    }

    function changeBetB(event) {
        setBetB(event.target.value);
    }

    async function placeBet(amount, option) {
        setDisabled(true);
        await betting_backend.placeBet(parseInt(props.id), parseInt(option), parseInt(amount));
        setDisabled(false);  
        setBetA(0);
        setBetB(0);
        refresh();
    }

    async function withdrawBet() {
        setDisabled(true);
        setWithdrawFb(await betting_backend.withdrawBet(parseInt(props.id)));
        setDisabled(false);
        refresh();
    }

    function refresh() {
        updateValues();
        setLoaded(true);
    }

    useEffect(() => {updateValues()}, [])

    return (
        <div className="box" hidden={props.show}>
            <div className="modalbox">
                <p className="close" onClick={() => props.onHide(true)}>CLOSE</p>
                <div style={{padding: "2%"}}>
                    <h1 className="centertext">{loaded ? bet.name : props.name}</h1>
                    <div className="centerelement">
                        <button onClick={() => refresh()}>Refresh Bets</button>
                    </div>
                    <h2 className="centertext">Total Bets:<br />{loaded ? bet.totalBets.toLocaleString() : props.tb.toLocaleString()}</h2>
                    <div className="centerelement">
                        <div className="inline">
                            <h3 className="centertext">{props.opA}:<br />{loaded ? bet.betsOnA.toLocaleString() : props.bA.toLocaleString()}</h3>
                            <div className="centerelement">
                                <input type="number" step="100" value={betA} onChange={changeBetA} /><br />
                                <button disabled={disabled} onClick={() => placeBet(betA, 0)}>BET</button>
                            </div >
                        </div>
                    <div className="separation"></div>
                        <div className="inline">
                            <h3 className="centertext">{props.opB}:<br />{loaded ? bet.betsOnB.toLocaleString() : props.bB.toLocaleString()}</h3>
                            <div className="centerelement">
                                <input type="number" step="100" value={betB} onChange={changeBetB} /><br />
                                <button disabled={disabled} onClick={() => placeBet(betB, 1)}>BET</button>
                            </div>
                        </div>
                        <div hidden={amountUserBet ==  0 || bet.betsClosed == true ? true : false}>
                            <h3>Your Bet on:<br/> {optionPicked}</h3>
                            <p>{amountUserBet}</p>
                            <button disabled={disabled} onClick={() => withdrawBet()}>Withdraw Bet</button>
                            <p>{withdrawFb}</p>
                        </div>
                        <div hidden={!bet.betsClosed}>
                            <h3>Winner:</h3>
                            <p>{winner}</p>
                        </div>
                        <div hidden={bet.betsClosed == true && winnerShow == false ? false : true}>
                            <h3>Winnings to collect:</h3>
                            <p>{winningsToCollect}</p>
                            <button disabled={disabled} onClick={() => {collectWinnings()}}> COLLECT</button>
                        </div>
                        <p>{collected}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Bet;