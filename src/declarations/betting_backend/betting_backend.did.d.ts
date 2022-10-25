import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Bet {
  'id' : bigint,
  'name' : string,
  'winner' : bigint,
  'totalBets' : bigint,
  'betsOnA' : bigint,
  'betsOnB' : bigint,
  'betsClosed' : boolean,
  'optionA' : string,
  'optionB' : string,
}
export interface UserBet {
  'winningsCollected' : boolean,
  'amountBetted' : bigint,
  'optionPicked' : bigint,
}
export interface _SERVICE {
  'calculateWinnings' : ActorMethod<[Principal, bigint], bigint>,
  'closeBets' : ActorMethod<[bigint], string>,
  'collectWinnings' : ActorMethod<[bigint], string>,
  'createBet' : ActorMethod<[string, string, string], string>,
  'decideWinner' : ActorMethod<[bigint, bigint], string>,
  'getBetsSize' : ActorMethod<[], string>,
  'mintICB' : ActorMethod<[], string>,
  'placeBet' : ActorMethod<[bigint, bigint, bigint], string>,
  'setReferee' : ActorMethod<[Principal, boolean], string>,
  'viewBalance' : ActorMethod<[Principal], bigint>,
  'viewBet' : ActorMethod<[bigint], Bet>,
  'viewMyBalance' : ActorMethod<[], bigint>,
  'viewMyBet' : ActorMethod<[], UserBet>,
  'viewUser' : ActorMethod<[Principal, bigint], UserBet>,
  'withdrawBet' : ActorMethod<[bigint], string>,
}
