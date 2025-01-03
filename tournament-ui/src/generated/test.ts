import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import {
  CairoCustomEnum,
  CairoOption,
  CairoOptionVariant,
  BigNumberish,
} from "starknet";

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `tournament::ls15_components::models::tournament::ERC20Data` struct
export interface ERC20Data {
  token_amount: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::ERC721Data` struct
export interface ERC721Data {
  token_id: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::EntryCriteria` struct
export interface EntryCriteria {
  token_id: BigNumberish;
  entry_count: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::GatedToken` struct
export interface GatedToken {
  token: string;
  entry_type: CairoCustomEnum;
}

// Type definition for `tournament::ls15_components::models::tournament::Premium` struct
export interface Premium {
  token: string;
  token_amount: BigNumberish;
  token_distribution: Array<BigNumberish>;
  creator_fee: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::PrizesModel` struct
export interface PrizesModel {
  prize_key: BigNumberish;
  token: string;
  token_data_type: CairoCustomEnum;
  payout_position: BigNumberish;
  claimed: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::PrizesModelValue` struct
export interface PrizesModelValue {
  token: string;
  token_data_type: CairoCustomEnum;
  payout_position: BigNumberish;
  claimed: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::TokenModel` struct
export interface TokenModel {
  token: string;
  name: string;
  symbol: string;
  token_data_type: CairoCustomEnum;
  is_registered: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::TokenModelValue` struct
export interface TokenModelValue {
  name: string;
  symbol: string;
  token_data_type: CairoCustomEnum;
  is_registered: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentConfig` struct
export interface TournamentConfig {
  contract: string;
  eth: string;
  lords: string;
  loot_survivor: string;
  oracle: string;
  safe_mode: boolean;
  test_mode: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentConfigValue` struct
export interface TournamentConfigValue {
  eth: string;
  lords: string;
  loot_survivor: string;
  oracle: string;
  safe_mode: boolean;
  test_mode: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesAddressModel` struct
export interface TournamentEntriesAddressModel {
  tournament_id: BigNumberish;
  address: string;
  entry_count: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesAddressModelValue` struct
export interface TournamentEntriesAddressModelValue {
  entry_count: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesModel` struct
export interface TournamentEntriesModel {
  tournament_id: BigNumberish;
  entry_count: BigNumberish;
  premiums_formatted: boolean;
  distribute_called: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesModelValue` struct
export interface TournamentEntriesModelValue {
  entry_count: BigNumberish;
  premiums_formatted: boolean;
  distribute_called: boolean;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntryAddressesModel` struct
export interface TournamentEntryAddressesModel {
  tournament_id: BigNumberish;
  addresses: Array<string>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntryAddressesModelValue` struct
export interface TournamentEntryAddressesModelValue {
  addresses: Array<string>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentGameModel` struct
export interface TournamentGameModel {
  tournament_id: BigNumberish;
  game_id: BigNumberish;
  address: string;
  status: EntryStatus;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentGameModelValue` struct
export interface TournamentGameModelValue {
  address: string;
  status: EntryStatus;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentModel` struct
export interface TournamentModel {
  tournament_id: BigNumberish;
  name: BigNumberish;
  description: string;
  creator: string;
  start_time: BigNumberish;
  end_time: BigNumberish;
  submission_period: BigNumberish;
  winners_count: BigNumberish;
  gated_type: CairoOption<CairoCustomEnum>;
  entry_premium: CairoOption<Premium>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentModelValue` struct
export interface TournamentModelValue {
  name: BigNumberish;
  description: string;
  creator: string;
  start_time: BigNumberish;
  end_time: BigNumberish;
  submission_period: BigNumberish;
  winners_count: BigNumberish;
  gated_type: CairoOption<CairoCustomEnum>;
  entry_premium: CairoOption<Premium>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentPrizeKeysModel` struct
export interface TournamentPrizeKeysModel {
  tournament_id: BigNumberish;
  prize_keys: Array<BigNumberish>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentPrizeKeysModelValue` struct
export interface TournamentPrizeKeysModelValue {
  prize_keys: Array<BigNumberish>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentScoresModel` struct
export interface TournamentScoresModel {
  tournament_id: BigNumberish;
  top_score_ids: Array<BigNumberish>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentScoresModelValue` struct
export interface TournamentScoresModelValue {
  top_score_ids: Array<BigNumberish>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartIdsModel` struct
export interface TournamentStartIdsModel {
  tournament_id: BigNumberish;
  address: string;
  game_ids: Array<BigNumberish>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartIdsModelValue` struct
export interface TournamentStartIdsModelValue {
  game_ids: Array<BigNumberish>;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartsAddressModel` struct
export interface TournamentStartsAddressModel {
  tournament_id: BigNumberish;
  address: string;
  start_count: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartsAddressModelValue` struct
export interface TournamentStartsAddressModelValue {
  start_count: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentTotalsModel` struct
export interface TournamentTotalsModel {
  contract: string;
  total_tournaments: BigNumberish;
  total_prizes: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::TournamentTotalsModelValue` struct
export interface TournamentTotalsModelValue {
  total_tournaments: BigNumberish;
  total_prizes: BigNumberish;
}

// Type definition for `tournament::ls15_components::models::tournament::EntryStatus` enum
export enum EntryStatus {
  Started,
  Submitted,
}

// Type definition for `tournament::ls15_components::models::tournament::GatedEntryType` enum
export type GatedEntryType = {
  criteria: Array<EntryCriteria>;
  uniform: BigNumberish;
};

// Type definition for `tournament::ls15_components::models::tournament::GatedType` enum
export type GatedType = {
  token: GatedToken;
  tournament: Array<BigNumberish>;
  address: Array<string>;
};

// Type definition for `tournament::ls15_components::models::tournament::TokenDataType` enum
export type TokenDataType = {
  erc20: ERC20Data;
  erc721: ERC721Data;
};

export interface SchemaType extends ISchemaType {
  tournament: {
    ERC20Data: WithFieldOrder<ERC20Data>;
    ERC721Data: WithFieldOrder<ERC721Data>;
    EntryCriteria: WithFieldOrder<EntryCriteria>;
    GatedToken: WithFieldOrder<GatedToken>;
    Premium: WithFieldOrder<Premium>;
    PrizesModel: WithFieldOrder<PrizesModel>;
    PrizesModelValue: WithFieldOrder<PrizesModelValue>;
    TokenModel: WithFieldOrder<TokenModel>;
    TokenModelValue: WithFieldOrder<TokenModelValue>;
    TournamentConfig: WithFieldOrder<TournamentConfig>;
    TournamentConfigValue: WithFieldOrder<TournamentConfigValue>;
    TournamentEntriesAddressModel: WithFieldOrder<TournamentEntriesAddressModel>;
    TournamentEntriesAddressModelValue: WithFieldOrder<TournamentEntriesAddressModelValue>;
    TournamentEntriesModel: WithFieldOrder<TournamentEntriesModel>;
    TournamentEntriesModelValue: WithFieldOrder<TournamentEntriesModelValue>;
    TournamentEntryAddressesModel: WithFieldOrder<TournamentEntryAddressesModel>;
    TournamentEntryAddressesModelValue: WithFieldOrder<TournamentEntryAddressesModelValue>;
    TournamentGameModel: WithFieldOrder<TournamentGameModel>;
    TournamentGameModelValue: WithFieldOrder<TournamentGameModelValue>;
    TournamentModel: WithFieldOrder<TournamentModel>;
    TournamentModelValue: WithFieldOrder<TournamentModelValue>;
    TournamentPrizeKeysModel: WithFieldOrder<TournamentPrizeKeysModel>;
    TournamentPrizeKeysModelValue: WithFieldOrder<TournamentPrizeKeysModelValue>;
    TournamentScoresModel: WithFieldOrder<TournamentScoresModel>;
    TournamentScoresModelValue: WithFieldOrder<TournamentScoresModelValue>;
    TournamentStartIdsModel: WithFieldOrder<TournamentStartIdsModel>;
    TournamentStartIdsModelValue: WithFieldOrder<TournamentStartIdsModelValue>;
    TournamentStartsAddressModel: WithFieldOrder<TournamentStartsAddressModel>;
    TournamentStartsAddressModelValue: WithFieldOrder<TournamentStartsAddressModelValue>;
    TournamentTotalsModel: WithFieldOrder<TournamentTotalsModel>;
    TournamentTotalsModelValue: WithFieldOrder<TournamentTotalsModelValue>;
  };
}
export const schema: SchemaType = {
  tournament: {
    ERC20Data: {
      fieldOrder: ["token_amount"],
      token_amount: 0,
    },
    ERC721Data: {
      fieldOrder: ["token_id"],
      token_id: 0,
    },
    EntryCriteria: {
      fieldOrder: ["token_id", "entry_count"],
      token_id: 0,
      entry_count: 0,
    },
    GatedToken: {
      fieldOrder: ["token", "entry_type"],
      token: "",
      entry_type: new CairoCustomEnum({
        uniform: 0,
        criteria: undefined,
      }),
    },
    Premium: {
      fieldOrder: [
        "token",
        "token_amount",
        "token_distribution",
        "creator_fee",
      ],
      token: "",
      token_amount: 0,
      token_distribution: [0],
      creator_fee: 0,
    },
    PrizesModel: {
      fieldOrder: [
        "prize_key",
        "token",
        "token_data_type",
        "payout_position",
        "claimed",
      ],
      prize_key: 0,
      token: "",
      token_data_type: new CairoCustomEnum({
        erc20: {
          fieldOrder: ["token_amount"],
          token_amount: 0,
        },
        erc721: undefined,
      }),
      payout_position: 0,
      claimed: false,
    },
    PrizesModelValue: {
      fieldOrder: ["token", "token_data_type", "payout_position", "claimed"],
      token: "",
      token_data_type: new CairoCustomEnum({
        erc20: {
          fieldOrder: ["token_amount"],
          token_amount: 0,
        },
        erc721: undefined,
      }),
      payout_position: 0,
      claimed: false,
    },
    TokenModel: {
      fieldOrder: [
        "token",
        "name",
        "symbol",
        "token_data_type",
        "is_registered",
      ],
      token: "",
      name: "",
      symbol: "",
      token_data_type: new CairoCustomEnum({
        erc20: {
          fieldOrder: ["token_amount"],
          token_amount: 0,
        },
        erc721: undefined,
      }),
      is_registered: false,
    },
    TokenModelValue: {
      fieldOrder: ["name", "symbol", "token_data_type", "is_registered"],
      name: "",
      symbol: "",
      token_data_type: new CairoCustomEnum({
        erc20: {
          fieldOrder: ["token_amount"],
          token_amount: 0,
        },
        erc721: undefined,
      }),
      is_registered: false,
    },
    TournamentConfig: {
      fieldOrder: [
        "contract",
        "eth",
        "lords",
        "loot_survivor",
        "oracle",
        "safe_mode",
        "test_mode",
      ],
      contract: "",
      eth: "",
      lords: "",
      loot_survivor: "",
      oracle: "",
      safe_mode: false,
      test_mode: false,
    },
    TournamentConfigValue: {
      fieldOrder: [
        "eth",
        "lords",
        "loot_survivor",
        "oracle",
        "safe_mode",
        "test_mode",
      ],
      eth: "",
      lords: "",
      loot_survivor: "",
      oracle: "",
      safe_mode: false,
      test_mode: false,
    },
    TournamentEntriesAddressModel: {
      fieldOrder: ["tournament_id", "address", "entry_count"],
      tournament_id: 0,
      address: "",
      entry_count: 0,
    },
    TournamentEntriesAddressModelValue: {
      fieldOrder: ["entry_count"],
      entry_count: 0,
    },
    TournamentEntriesModel: {
      fieldOrder: [
        "tournament_id",
        "entry_count",
        "premiums_formatted",
        "distribute_called",
      ],
      tournament_id: 0,
      entry_count: 0,
      premiums_formatted: false,
      distribute_called: false,
    },
    TournamentEntriesModelValue: {
      fieldOrder: ["entry_count", "premiums_formatted", "distribute_called"],
      entry_count: 0,
      premiums_formatted: false,
      distribute_called: false,
    },
    TournamentEntryAddressesModel: {
      fieldOrder: ["tournament_id", "addresses"],
      tournament_id: 0,
      addresses: [""],
    },
    TournamentEntryAddressesModelValue: {
      fieldOrder: ["addresses"],
      addresses: [""],
    },
    TournamentGameModel: {
      fieldOrder: ["tournament_id", "game_id", "address", "status"],
      tournament_id: 0,
      game_id: 0,
      address: "",
      status: EntryStatus.Started,
    },
    TournamentGameModelValue: {
      fieldOrder: ["address", "status"],
      address: "",
      status: EntryStatus.Started,
    },
    TournamentModel: {
      fieldOrder: [
        "tournament_id",
        "name",
        "description",
        "creator",
        "start_time",
        "end_time",
        "submission_period",
        "winners_count",
        "gated_type",
        "entry_premium",
      ],
      tournament_id: 0,
      name: 0,
      description: "",
      creator: "",
      start_time: 0,
      end_time: 0,
      submission_period: 0,
      winners_count: 0,
      gated_type: new CairoOption(CairoOptionVariant.None),
      entry_premium: new CairoOption(CairoOptionVariant.None),
    },
    TournamentModelValue: {
      fieldOrder: [
        "name",
        "description",
        "creator",
        "start_time",
        "end_time",
        "submission_period",
        "winners_count",
        "gated_type",
        "entry_premium",
      ],
      name: 0,
      description: "",
      creator: "",
      start_time: 0,
      end_time: 0,
      submission_period: 0,
      winners_count: 0,
      gated_type: new CairoOption(CairoOptionVariant.None),
      entry_premium: new CairoOption(CairoOptionVariant.None),
    },
    TournamentPrizeKeysModel: {
      fieldOrder: ["tournament_id", "prize_keys"],
      tournament_id: 0,
      prize_keys: [0],
    },
    TournamentPrizeKeysModelValue: {
      fieldOrder: ["prize_keys"],
      prize_keys: [0],
    },
    TournamentScoresModel: {
      fieldOrder: ["tournament_id", "top_score_ids"],
      tournament_id: 0,
      top_score_ids: [0],
    },
    TournamentScoresModelValue: {
      fieldOrder: ["top_score_ids"],
      top_score_ids: [0],
    },
    TournamentStartIdsModel: {
      fieldOrder: ["tournament_id", "address", "game_ids"],
      tournament_id: 0,
      address: "",
      game_ids: [0],
    },
    TournamentStartIdsModelValue: {
      fieldOrder: ["game_ids"],
      game_ids: [0],
    },
    TournamentStartsAddressModel: {
      fieldOrder: ["tournament_id", "address", "start_count"],
      tournament_id: 0,
      address: "",
      start_count: 0,
    },
    TournamentStartsAddressModelValue: {
      fieldOrder: ["start_count"],
      start_count: 0,
    },
    TournamentTotalsModel: {
      fieldOrder: ["contract", "total_tournaments", "total_prizes"],
      contract: "",
      total_tournaments: 0,
      total_prizes: 0,
    },
    TournamentTotalsModelValue: {
      fieldOrder: ["total_tournaments", "total_prizes"],
      total_tournaments: 0,
      total_prizes: 0,
    },
  },
};
export enum ModelsMapping {
  ERC20Data = "tournament-ERC20Data",
  ERC721Data = "tournament-ERC721Data",
  EntryCriteria = "tournament-EntryCriteria",
  EntryStatus = "tournament-EntryStatus",
  GatedEntryType = "tournament-GatedEntryType",
  GatedToken = "tournament-GatedToken",
  GatedType = "tournament-GatedType",
  Premium = "tournament-Premium",
  PrizesModel = "tournament-PrizesModel",
  PrizesModelValue = "tournament-PrizesModelValue",
  TokenDataType = "tournament-TokenDataType",
  TokenModel = "tournament-TokenModel",
  TokenModelValue = "tournament-TokenModelValue",
  TournamentConfig = "tournament-TournamentConfig",
  TournamentConfigValue = "tournament-TournamentConfigValue",
  TournamentEntriesAddressModel = "tournament-TournamentEntriesAddressModel",
  TournamentEntriesAddressModelValue = "tournament-TournamentEntriesAddressModelValue",
  TournamentEntriesModel = "tournament-TournamentEntriesModel",
  TournamentEntriesModelValue = "tournament-TournamentEntriesModelValue",
  TournamentEntryAddressesModel = "tournament-TournamentEntryAddressesModel",
  TournamentEntryAddressesModelValue = "tournament-TournamentEntryAddressesModelValue",
  TournamentGameModel = "tournament-TournamentGameModel",
  TournamentGameModelValue = "tournament-TournamentGameModelValue",
  TournamentModel = "tournament-TournamentModel",
  TournamentModelValue = "tournament-TournamentModelValue",
  TournamentPrizeKeysModel = "tournament-TournamentPrizeKeysModel",
  TournamentPrizeKeysModelValue = "tournament-TournamentPrizeKeysModelValue",
  TournamentScoresModel = "tournament-TournamentScoresModel",
  TournamentScoresModelValue = "tournament-TournamentScoresModelValue",
  TournamentStartIdsModel = "tournament-TournamentStartIdsModel",
  TournamentStartIdsModelValue = "tournament-TournamentStartIdsModelValue",
  TournamentStartsAddressModel = "tournament-TournamentStartsAddressModel",
  TournamentStartsAddressModelValue = "tournament-TournamentStartsAddressModelValue",
  TournamentTotalsModel = "tournament-TournamentTotalsModel",
  TournamentTotalsModelValue = "tournament-TournamentTotalsModelValue",
}
