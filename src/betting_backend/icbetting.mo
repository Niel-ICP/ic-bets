//The contract is still in test phase

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Buffer "./buffer";
import Iter "mo:base/Iter";
import Map "./map";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Blob "mo:base/Blob";
import Hash "mo:base/Hash";

actor ICBetting {
  let { ihash; nhash; thash; phash; calcHash } = Map; 

  public type Bet = {
    name: Text;
    totalBets: Nat;
    optionA: Text;
    optionB: Text;
    betsOnA: Nat;
    betsOnB: Nat;
    betsClosed: Bool;
    winner: Nat;
  };
  
  public type UserBet = {
    amountBetted: Nat;
    optionPicked: Nat;
    winningsCollected: Bool;
  };

  let defaultBet = {
    amountBetted = 0;
    optionPicked = 0;
    winningsCollected = false;
  };

  let owner = Principal.fromText("wgzi3-takje-gi5pc-3b6wr-3aynj-zto7v-l5feg-3536u-ejztu-qm4d5-jae");

  var bets: Buffer.Buffer<Bet> = Buffer.fromArray([]);
  var currentBet: Nat = 0;

  // var userBets = HashMap.HashMap<Principal, UserBet>(1, Principal.equal, Principal.hash);

  type User = Map.Map<Nat, UserBet>;

  stable var referees = Map.new<Principal, Bool>(phash);
  Map.set(referees, phash, owner, true);

  stable var userBets: User = Map.new<Nat, UserBet>(nhash);

  stable var map1 = Map.new<Principal, User>(phash);

  stable var balances = Map.new<Principal, Nat>(phash);

  public shared(msg) func mintICB(): async Text {
    let b: Nat = await viewBalance(msg.caller);
    if(b > 0) {
      return "You already have ICB";
    };
    Map.set(balances, phash, msg.caller, 10000);
    return "10.000 ICB minted successfully";
  };
  
  public shared(msg) func createBet(name: Text, a: Text, b: Text): async Text {
    let newBet: Bet = {
    name = name;
    totalBets = 0;
    optionA = a;
    optionB = b;
    betsOnA = 0;
    betsOnB = 0;
    betsClosed = false;
    winner = 9
    };
    if(currentBet == 0) {
    } else {currentBet += 1};
    bets.add(newBet);
    return "Bet successfully created";
  };

  public shared(msg) func placeBet(bet: Nat, option: Nat, amount: Nat): async Text {
    var _bet: Bet = bets.get(bet);
    var _uB: UserBet = await viewUser(msg.caller, bet);
    var _balance: Nat = await viewBalance(msg.caller);
    if(_uB.amountBetted > 0 and _uB.optionPicked != option) {
      return "You cannot bet on both teams";
    };
    if(option >= 2 or bet > currentBet) {
      return "Invalid parameters selected";
    };
    if(bets.get(bet).betsClosed) {
      return "Bets are closed";
    };
    if(bet + 1 > bets.size()) {
      return "Invalid bet selected";
    };
    if(amount > _balance) {
      return "You do not have enough ICB to bet";
    };
    var _betsOnA = _bet.betsOnA;
    var _betsOnB = _bet.betsOnB;
    if(option == 0) {
      _betsOnA += amount;
    }
    else {
      _betsOnB += amount;
    };
    _bet := {
      name = _bet.name;
      totalBets = _bet.totalBets;
      optionA = _bet.optionA;
      optionB = _bet.optionB;
      betsOnA = _betsOnA;
      betsOnB = _betsOnB;
      betsClosed = false;
      winner = 9;
    };
    _balance -= amount;
    Map.set(balances, phash, msg.caller, _balance);
    _uB := {
      amountBetted = _uB.amountBetted + amount;
      optionPicked = option;
      winningsCollected = false;
    };
    Map.set(userBets, nhash, bet, _uB);
    Map.set(map1, phash, msg.caller, userBets);
    // userBets.put(msg.caller, _uB);
    bets.put(bet, _bet);
    return ("Bet successfully placed!");
  };

  public shared(msg) func withdrawBet(bet: Nat): async Text {
    var _ub = await viewUser(msg.caller, bet);
    var _bet: Bet = bets.get(bet);
    if(bet + 1 > bets.size()) {
      return "Invalid bet selected";
    };
    if (_bet.betsClosed) {
      return "Bets are already closed";
    };
    if (_ub.amountBetted == 0) {
      return "You have not placed a bet on this bet";
    };
    var _balance = await viewBalance(msg.caller);
    _balance += _ub.amountBetted;
    Map.set(balances, phash, msg.caller, _balance);
    //
    _ub := {
      amountBetted = 0;
      optionPicked = _ub.optionPicked;
      winningsCollected = false;
    };
    //
    var _betsOnA = _bet.betsOnA;
    var _betsOnB = _bet.betsOnB;
    if(_ub.optionPicked == 0) {
      _betsOnA -= _ub.amountBetted;
    }
    else {
      _betsOnB -= _ub.amountBetted;
    };
    _bet := {
      name = _bet.name;
      totalBets = _bet.totalBets - _ub.amountBetted;
      optionA = _bet.optionA;
      optionB = _bet.optionB;
      betsOnA = _betsOnA;
      betsOnB = _betsOnB;
      betsClosed = false;
      winner = 9;
    };
    Map.set(userBets, nhash, bet, _ub);
    Map.set(map1, phash, msg.caller, userBets);
    bets.put(bet, _bet);
    return "bet withdrawn";
  };

  public query func calculateWinnings(user: Principal, bet: Nat): async Nat {
    var _uB: UserBet = switch(Map.get(map1, phash, user)) {
      case(?resultP) {
        switch(Map.get(resultP, nhash, bet)) {
          case(?resultU) {
            resultU
          };
          case null {
            defaultBet
          };
        };
      };
      case null {
        defaultBet
      };
    };
    let _bet: Bet = bets.get(bet);
    if(_bet.winner != _uB.optionPicked) {
      return 0;
    };
    let amountBetted = _uB.amountBetted;
    let total = _bet.totalBets;
    let winnings = _uB.amountBetted * _bet.totalBets / _bet.betsOnA;
  };

  public shared(msg) func collectWinnings(bet: Nat): async Text {
    var _ub = await viewUser(msg.caller, bet);
    var _balance = await viewBalance(msg.caller);
    let amount = await calculateWinnings(msg.caller, bet);
    if(_ub.amountBetted == 0) {
      return "You did not bet in this bet.";
    };
    if(amount == 0) {
      return "You did not win this bet.";
    };
    if(_ub.winningsCollected == true) {
      return "Error: Winnings already collected.";
    };
    //transfer winnings to account
    _balance += amount;
    Map.set(balances, phash, msg.caller, _balance);
    _ub := {
      amountBetted = _ub.amountBetted;
      optionPicked = _ub.optionPicked;
      winningsCollected = true;
    };
    Map.set(userBets, nhash, bet, _ub);
    Map.set(map1, phash, msg.caller, userBets);    return "Winnings successfully collected!";

  };
  public query func viewBalance(user: Principal): async Nat {
    let b: Nat = switch(Map.get(balances, phash, user)) {
      case (?result) { result };
      case null { 0 }
    };
    return b;
  };

  public shared(msg) func viewMyBalance():async Nat {
    let b = await viewBalance(msg.caller);
    return b;
  };
  public query func viewBet(bet: Nat): async Bet {
    return bets.get(bet);
  };

  public shared(msg) func viewMyBet(): async UserBet {
    var _uB: UserBet = switch(Map.get(map1, phash, msg.caller)) {
      case(?resultP) {
        switch(Map.get(resultP, nhash, currentBet)) {
          case(?resultU) {
            resultU
          };
          case null {
            defaultBet
          };
        };
      };
      case null {
        defaultBet
      };
    };
    return _uB;
  };

  public query func viewUser (user: Principal, bet: Nat): async UserBet {
    var _uB: UserBet = switch(Map.get(map1, phash, user)) {
      case(?resultP) {
        switch(Map.get(resultP, nhash, bet)) {
          case(?resultU) {
            resultU
          };
          case null {
            defaultBet
          };
        };
      };
      case null {
        defaultBet
      };
    };
    return _uB;
  };

  public shared(msg) func setReferee (p: Principal, status: Bool):async Text {
    if (msg.caller != owner) {
      return "Only the owner of the contract can make someone a referee";
    };
    Map.set(referees, phash, p, status);
    return "Referee status granted / revoked";
  };

  public shared(msg) func closeBets(bet:Nat): async Text {
    let _isReferee: Bool = switch (Map.get(referees, phash, msg.caller)) {
      case (?bool) { true };
      case null { false }
    };
    if(_isReferee != true) {
      return "Only can close the bets";
    };
    var _bet: Bet = bets.get(bet);
    if(_bet.betsClosed) {
      return "Bets are already closed";
    };
    _bet := {
      name = _bet.name;
      totalBets = _bet.totalBets;
      optionA = _bet.optionA;
      optionB = _bet.optionB;
      betsOnA = _bet.betsOnA;
      betsOnB = _bet.betsOnB;
      betsClosed = true;
      winner = _bet.winner;
    };
    bets.put(bet, _bet);
    return "Bets successfully closed";
  };

  public shared(msg) func decideWinner(bet: Nat, _winner: Nat): async Text {
    let _isReferee: Bool = switch (Map.get(referees, phash, msg.caller)) {
      case (?bool) { true };
      case null { false }
    };
    if(_isReferee != true) {
      return "Only a referee can decide the winner of a bet";
    };
    var _bet: Bet = bets.get(bet);
    if(_bet.winner != 9) {
      return "Winner for this bet has already been decided";
    };
    if(_bet.betsClosed == false) {
      return "Bets are still open!";
    };
    _bet := {
      name = _bet.name;
      totalBets = _bet.totalBets;
      optionA = _bet.optionA;
      optionB = _bet.optionB;
      betsOnA = _bet.betsOnA;
      betsOnB = _bet.betsOnB;
      betsClosed = true;
      winner = _winner;
      };
    bets.put(bet, _bet);
    return "Winner successfully decided!";
  };
};
