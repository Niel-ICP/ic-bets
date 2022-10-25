import { ActorSubclass, HttpAgentOptions, ActorConfig } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import { _SERVICE } from './betting_frontend.did';

export declare interface CreateActorOptions {
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
}

export declare const createActor: (
  canisterId: string | Principal,
  options: CreateActorOptions
) => ActorSubclass<_SERVICE>;

export declare const betting_frontend: ActorSubclass<_SERVICE>;
