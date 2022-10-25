export const idlFactory = ({ IDL }) => {
  const Bet = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'winner' : IDL.Nat,
    'totalBets' : IDL.Nat,
    'betsOnA' : IDL.Nat,
    'betsOnB' : IDL.Nat,
    'betsClosed' : IDL.Bool,
    'optionA' : IDL.Text,
    'optionB' : IDL.Text,
  });
  const UserBet = IDL.Record({
    'winningsCollected' : IDL.Bool,
    'amountBetted' : IDL.Nat,
    'optionPicked' : IDL.Nat,
  });
  return IDL.Service({
    'calculateWinnings' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Nat],
        ['query'],
      ),
    'closeBets' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'collectWinnings' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'createBet' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'decideWinner' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Text], []),
    'getBetsSize' : IDL.Func([], [IDL.Text], ['query']),
    'mintICB' : IDL.Func([], [IDL.Text], []),
    'placeBet' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat], [IDL.Text], []),
    'setReferee' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Text], []),
    'viewBalance' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'viewBet' : IDL.Func([IDL.Nat], [Bet], ['query']),
    'viewMyBalance' : IDL.Func([], [IDL.Nat], []),
    'viewMyBet' : IDL.Func([], [UserBet], []),
    'viewUser' : IDL.Func([IDL.Principal, IDL.Nat], [UserBet], ['query']),
    'withdrawBet' : IDL.Func([IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
