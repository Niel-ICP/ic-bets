//package Zhenya "ZhenyaUsenko/motoko-hash-map/master/src"
import Principal "mo:base/Principal";

import Map "./map";

let { ihash; nhash; thash; phash; calcHash } = Map; 


type Account = {
    name : Text;
    cars : Map.Map<Text, Car>;
};

type Car = {
    model: Text
};

// Let's have nested HashMaps. Variable 'store' can be stable - no need to serialize/deserialize when upgrading
let store = Map.new<Principal, Account>(phash); 

let p1 = Principal.fromText("aaaaa-aa");

let myAccount : Account = { 
    name = "Peter"; 
    cars = Map.new<Text, Car>(thash);
};

// Adding cars to account
Map.set(myAccount.cars, thash, "kia-123", { model = "Kia Rio"}); 
Map.set(myAccount.cars, thash, "dmc-12", { model = "De Lorean"}); 

// Storing an account
Map.set(store, phash, p1, myAccount);

// Let's get it
switch(Map.get(store, phash, p1)) { 
    case (?acc) {
        // found account
        switch(Map.get(acc.cars, thash, "dmc-12")) {
            case (?car) {
                //found car
            };
            case (null) {
                // not found
            };
        };
    };
    case (null) {
        // not found
    };
};