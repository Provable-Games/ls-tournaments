import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import {
  CairoCustomEnum,
  CairoOption,
  BigNumberish,
  CairoOptionVariant,
} from "starknet";

export type TypedCairoEnum<T> = CairoCustomEnum & {
  variant: { [K in keyof T]: T[K] | undefined };
  unwrap(): T[keyof T];
};

type RemoveFieldOrder<T> = T extends object
  ? T extends CairoOption<infer U>
    ? CairoOption<RemoveFieldOrder<U>>
    : T extends CairoCustomEnum
    ? T
    : Omit<
        {
          [K in keyof T]: T[K] extends object ? RemoveFieldOrder<T[K]> : T[K];
        },
        "fieldOrder"
      >
  : T;
// Type definition for `tournament::ls15_components::models::loot_survivor::AdventurerMetadata` struct
export interface AdventurerMetadata {
  fieldOrder: string[];
  birth_date: BigNumberish;
  death_date: BigNumberish;
  level_seed: BigNumberish;
  item_specials_seed: BigNumberish;
  rank_at_death: BigNumberish;
  delay_stat_reveal: boolean;
  golden_token_id: BigNumberish;
}
export type InputAdventurerMetadata = RemoveFieldOrder<AdventurerMetadata>;

// Type definition for `tournament::ls15_components::models::loot_survivor::AdventurerMetaModel` struct
export interface AdventurerMetaModel {
  fieldOrder: string[];
  adventurer_id: BigNumberish;
  adventurer_meta: AdventurerMetadata;
}
export type InputAdventurerMetaModel = RemoveFieldOrder<AdventurerMetaModel>;

// Type definition for `tournament::ls15_components::models::loot_survivor::AdventurerMetaModelValue` struct
export interface AdventurerMetaModelValue {
  fieldOrder: string[];
  adventurer_meta: AdventurerMetadata;
}
export type InputAdventurerMetaModelValue =
  RemoveFieldOrder<AdventurerMetaModelValue>;

// Type definition for `tournament::ls15_components::models::loot_survivor::AdventurerModelValue` struct
export interface AdventurerModelValue {
  fieldOrder: string[];
  adventurer: Adventurer;
}
export type InputAdventurerModelValue = RemoveFieldOrder<AdventurerModelValue>;

// Type definition for `tournament::ls15_components::models::loot_survivor::Stats` struct
export interface Stats {
  fieldOrder: string[];
  strength: BigNumberish;
  dexterity: BigNumberish;
  vitality: BigNumberish;
  intelligence: BigNumberish;
  wisdom: BigNumberish;
  charisma: BigNumberish;
  luck: BigNumberish;
}
export type InputStats = RemoveFieldOrder<Stats>;

// Type definition for `tournament::ls15_components::models::loot_survivor::AdventurerModel` struct
export interface AdventurerModel {
  fieldOrder: string[];
  adventurer_id: BigNumberish;
  adventurer: Adventurer;
}
export type InputAdventurerModel = RemoveFieldOrder<AdventurerModel>;

// Type definition for `tournament::ls15_components::models::loot_survivor::Adventurer` struct
export interface Adventurer {
  fieldOrder: string[];
  health: BigNumberish;
  xp: BigNumberish;
  gold: BigNumberish;
  beast_health: BigNumberish;
  stat_upgrades_available: BigNumberish;
  stats: Stats;
  equipment: Equipment;
  battle_action_count: BigNumberish;
  mutated: boolean;
  awaiting_item_specials: boolean;
}
export type InputAdventurer = RemoveFieldOrder<Adventurer>;

// Type definition for `tournament::ls15_components::models::loot_survivor::Equipment` struct
export interface Equipment {
  fieldOrder: string[];
  weapon: Item;
  chest: Item;
  head: Item;
  waist: Item;
  foot: Item;
  hand: Item;
  neck: Item;
  ring: Item;
}
export type InputEquipment = RemoveFieldOrder<Equipment>;

// Type definition for `tournament::ls15_components::models::loot_survivor::Item` struct
export interface Item {
  fieldOrder: string[];
  id: BigNumberish;
  xp: BigNumberish;
}
export type InputItem = RemoveFieldOrder<Item>;

// Type definition for `tournament::ls15_components::models::loot_survivor::Bag` struct
export interface Bag {
  fieldOrder: string[];
  item_1: Item;
  item_2: Item;
  item_3: Item;
  item_4: Item;
  item_5: Item;
  item_6: Item;
  item_7: Item;
  item_8: Item;
  item_9: Item;
  item_10: Item;
  item_11: Item;
  item_12: Item;
  item_13: Item;
  item_14: Item;
  item_15: Item;
  mutated: boolean;
}
export type InputBag = RemoveFieldOrder<Bag>;

// Type definition for `tournament::ls15_components::models::loot_survivor::BagModel` struct
export interface BagModel {
  fieldOrder: string[];
  adventurer_id: BigNumberish;
  bag: Bag;
}
export type InputBagModel = RemoveFieldOrder<BagModel>;

// Type definition for `tournament::ls15_components::models::loot_survivor::BagModelValue` struct
export interface BagModelValue {
  fieldOrder: string[];
  bag: Bag;
}
export type InputBagModelValue = RemoveFieldOrder<BagModelValue>;

// Type definition for `tournament::ls15_components::models::loot_survivor::ContractsValue` struct
export interface ContractsValue {
  fieldOrder: string[];
  eth: string;
  lords: string;
  oracle: string;
}
export type InputContractsValue = RemoveFieldOrder<ContractsValue>;

// Type definition for `tournament::ls15_components::models::loot_survivor::Contracts` struct
export interface Contracts {
  fieldOrder: string[];
  contract: string;
  eth: string;
  lords: string;
  oracle: string;
}
export type InputContracts = RemoveFieldOrder<Contracts>;

// Type definition for `tournament::ls15_components::models::loot_survivor::GameCountModel` struct
export interface GameCountModel {
  fieldOrder: string[];
  contract_address: string;
  game_count: BigNumberish;
}
export type InputGameCountModel = RemoveFieldOrder<GameCountModel>;

// Type definition for `tournament::ls15_components::models::loot_survivor::GameCountModelValue` struct
export interface GameCountModelValue {
  fieldOrder: string[];
  game_count: BigNumberish;
}
export type InputGameCountModelValue = RemoveFieldOrder<GameCountModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::ERC20Data` struct
export interface ERC20Data {
  fieldOrder: string[];
  token_amount: BigNumberish;
}
export type InputERC20Data = RemoveFieldOrder<ERC20Data>;

// Type definition for `tournament::ls15_components::models::tournament::PrizesModelValue` struct
export interface TournamentPrizeValue {
  fieldOrder: string[];
  token: string;
  token_data_type: TokenDataTypeEnum;
  payout_position: BigNumberish;
  claimed: boolean;
}
export type InputTournamentPrizeValue = RemoveFieldOrder<TournamentPrizeValue>;

// Type definition for `tournament::ls15_components::models::tournament::ERC721Data` struct
export interface ERC721Data {
  fieldOrder: string[];
  token_id: BigNumberish;
}
export type InputERC721Data = RemoveFieldOrder<ERC721Data>;

// Type definition for `tournament::ls15_components::models::tournament::PrizesModel` struct
export interface TournamentPrize {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  prize_key: BigNumberish;
  token: string;
  token_data_type: TokenDataTypeEnum;
  payout_position: BigNumberish;
  claimed: boolean;
}
export type InputTournamentPrize = RemoveFieldOrder<TournamentPrize>;

// Type definition for `tournament::ls15_components::models::tournament::TokenModel` struct
export interface Token {
  fieldOrder: string[];
  token: string;
  name: string;
  symbol: string;
  token_data_type: TokenDataTypeEnum;
  is_registered: boolean;
}
export type InputToken = RemoveFieldOrder<Token>;

// Type definition for `tournament::ls15_components::models::tournament::TokenModelValue` struct
export interface TokenValue {
  fieldOrder: string[];
  name: string;
  symbol: string;
  token_data_type: TokenDataTypeEnum;
  is_registered: boolean;
}
export type InputTokenValue = RemoveFieldOrder<TokenValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentConfigValue` struct
export interface TournamentConfigValue {
  fieldOrder: string[];
  eth: string;
  lords: string;
  loot_survivor: string;
  oracle: string;
  safe_mode: boolean;
  test_mode: boolean;
}
export type InputTournamentConfigValue =
  RemoveFieldOrder<TournamentConfigValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentConfig` struct
export interface TournamentConfig {
  fieldOrder: string[];
  contract: string;
  eth: string;
  lords: string;
  loot_survivor: string;
  oracle: string;
  golden_token: string;
  blobert: string;
  safe_mode: boolean;
  test_mode: boolean;
}
export type InputTournamentConfig = RemoveFieldOrder<TournamentConfig>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesAddressModelValue` struct
export interface TournamentEntriesAddressValue {
  fieldOrder: string[];
  entry_count: BigNumberish;
}
export type InputTournamentEntriesAddressValue =
  RemoveFieldOrder<TournamentEntriesAddressValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesAddressModel` struct
export interface TournamentEntriesAddress {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  address: string;
  entry_count: BigNumberish;
}
export type InputTournamentEntriesAddress =
  RemoveFieldOrder<TournamentEntriesAddress>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesModel` struct
export interface TournamentEntries {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  entry_count: BigNumberish;
  premiums_formatted: boolean;
  distribute_called: boolean;
}
export type InputTournamentEntries = RemoveFieldOrder<TournamentEntries>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesModelValue` struct
export interface TournamentEntriesValue {
  fieldOrder: string[];
  entry_count: BigNumberish;
  premiums_formatted: boolean;
  distribute_called: boolean;
}
export type InputTournamentEntriesValue =
  RemoveFieldOrder<TournamentEntriesValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntryAddressesModel` struct
export interface TournamentEntryAddresses {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  addresses: Array<string>;
}
export type InputTournamentEntryAddresses =
  RemoveFieldOrder<TournamentEntryAddresses>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntryAddressesModelValue` struct
export interface TournamentEntryAddressesValue {
  fieldOrder: string[];
  addresses: Array<string>;
}
export type InputTournamentEntryAddressesValue =
  RemoveFieldOrder<TournamentEntryAddressesValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentGameModel` struct
export interface TournamentGame {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  game_id: BigNumberish;
  address: string;
  status: EntryStatus;
}
export type InputTournamentGame = RemoveFieldOrder<TournamentGame>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentGameModelValue` struct
export interface TournamentGameValue {
  fieldOrder: string[];
  address: string;
  status: EntryStatus;
}
export type InputTournamentGameValue = RemoveFieldOrder<TournamentGameValue>;

// Type definition for `tournament::ls15_components::models::tournament::EntryCriteria` struct
export interface EntryCriteria {
  fieldOrder: string[];
  token_id: BigNumberish;
  entry_count: BigNumberish;
}
export type InputEntryCriteria = RemoveFieldOrder<EntryCriteria>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentModelValue` struct
export interface TournamentValue {
  fieldOrder: string[];
  name: BigNumberish;
  description: string;
  creator: string;
  start_time: BigNumberish;
  end_time: BigNumberish;
  submission_period: BigNumberish;
  winners_count: BigNumberish;
  gated_type: CairoOption<GatedTypeEnum>;
  entry_premium: CairoOption<Premium>;
}
export type InputTournamentValue = RemoveFieldOrder<TournamentValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentModel` struct
export interface Tournament {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  name: BigNumberish;
  description: string;
  creator: string;
  registration_start_time: BigNumberish;
  registration_end_time: BigNumberish;
  start_time: BigNumberish;
  end_time: BigNumberish;
  submission_period: BigNumberish;
  winners_count: BigNumberish;
  gated_type: CairoOption<GatedTypeEnum>;
  entry_premium: CairoOption<Premium>;
}
export type InputTournament = RemoveFieldOrder<Tournament>;

// Type definition for `tournament::ls15_components::models::tournament::Premium` struct
export interface Premium {
  fieldOrder: string[];
  token: string;
  token_amount: BigNumberish;
  token_distribution: Array<BigNumberish>;
  creator_fee: BigNumberish;
}
export type InputPremium = RemoveFieldOrder<Premium>;

// Type definition for `tournament::ls15_components::models::tournament::GatedToken` struct
export interface GatedToken {
  fieldOrder: string[];
  token: string;
  entry_type: GatedEntryTypeEnum;
}
export type InputGatedToken = RemoveFieldOrder<GatedToken>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentScoresModelValue` struct
export interface TournamentScoresValue {
  fieldOrder: string[];
  top_score_ids: Array<BigNumberish>;
}
export type InputTournamentScoresValue =
  RemoveFieldOrder<TournamentScoresValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentScoresModel` struct
export interface TournamentScores {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  top_score_ids: Array<BigNumberish>;
}
export type InputTournamentScores = RemoveFieldOrder<TournamentScores>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartsAddressModel` struct
export interface TournamentStartsAddress {
  fieldOrder: string[];
  tournament_id: BigNumberish;
  address: string;
  start_count: BigNumberish;
}
export type InputTournamentStartsAddress =
  RemoveFieldOrder<TournamentStartsAddress>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartsAddressModelValue` struct
export interface TournamentStartsAddressValue {
  fieldOrder: string[];
  start_count: BigNumberish;
}
export type InputTournamentStartsAddressValue =
  RemoveFieldOrder<TournamentStartsAddressValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentTotalsModelValue` struct
export interface TournamentTotalsValue {
  fieldOrder: string[];
  total_tournaments: BigNumberish;
  total_prizes: BigNumberish;
}
export type InputTournamentTotalsValue =
  RemoveFieldOrder<TournamentTotalsValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentTotalsModel` struct
export interface TournamentTotals {
  fieldOrder: string[];
  contract: string;
  total_tournaments: BigNumberish;
  total_prizes: BigNumberish;
}
export type InputTournamentTotals = RemoveFieldOrder<TournamentTotals>;

// Type definition for `tournament::ls15_components::models::tournament::TokenDataType` enum
export type TokenDataType = {
  erc20: ERC20Data;
  erc721: ERC721Data;
};
export type TokenDataTypeEnum = TypedCairoEnum<TokenDataType>;
export type InputTokenDataTypeEnum = RemoveFieldOrder<TokenDataTypeEnum>;

// Type definition for `tournament::ls15_components::models::tournament::EntryStatus` enum
export enum EntryStatus {
  Started,
  Submitted,
}

// Type definition for `tournament::ls15_components::models::tournament::GatedType` enum
export type GatedType = {
  token: GatedToken;
  tournament: Array<BigNumberish>;
  address: Array<string>;
};
export type GatedTypeEnum = TypedCairoEnum<GatedType>;
export type InputGatedTypeEnum = RemoveFieldOrder<GatedTypeEnum>;

// Type definition for `tournament::ls15_components::models::tournament::GatedEntryType` enum
export type GatedEntryType = {
  criteria: EntryCriteria[];
  uniform: number;
};
export type GatedEntryTypeEnum = TypedCairoEnum<GatedEntryType>;

export enum Models {
  Tournament = "ls_tournaments_v0-Tournament",
  TournamentGame = "ls_tournaments_v0-TournamentGame",
  TournamentEntryAddresses = "ls_tournaments_v0-TournamentEntryAddresses",
  TournamentEntriesAddress = "ls_tournaments_v0-TournamentEntriesAddress",
  TournamentStartIds = "ls_tournaments_v0-TournamentStartIds",
  TournamentEntries = "ls_tournaments_v0-TournamentEntries",
  TournamentStartsAddress = "ls_tournaments_v0-TournamentStartsAddress",
  TournamentScores = "ls_tournaments_v0-TournamentScores",
  TournamentTotals = "ls_tournaments_v0-TournamentTotals",
  TournamentPrize = "ls_tournaments_v0-TournamentPrize",
  Token = "ls_tournaments_v0-Token",
  TournamentConfig = "ls_tournaments_v0-TournamentConfig",
}

export interface SchemaType extends ISchemaType {
  [namespace: string]: {
    AdventurerMetadata: AdventurerMetadata;
    AdventurerMetaModel: AdventurerMetaModel;
    AdventurerMetaModelValue: AdventurerMetaModelValue;
    AdventurerModelValue: AdventurerModelValue;
    Stats: Stats;
    AdventurerModel: AdventurerModel;
    Adventurer: Adventurer;
    Equipment: Equipment;
    Item: Item;
    Bag: Bag;
    BagModel: BagModel;
    BagModelValue: BagModelValue;
    ContractsValue: ContractsValue;
    Contracts: Contracts;
    GameCountModel: GameCountModel;
    GameCountModelValue: GameCountModelValue;
    ERC20Data: ERC20Data;
    ERC721Data: ERC721Data;
    TournamentPrizeValue: TournamentPrizeValue;
    TournamentPrize: TournamentPrize;
    Token: Token;
    TokenValue: TokenValue;
    TournamentConfigValue: TournamentConfigValue;
    TournamentConfig: TournamentConfig;
    TournamentEntriesAddressValue: TournamentEntriesAddressValue;
    TournamentEntriesAddress: TournamentEntriesAddress;
    TournamentEntries: TournamentEntries;
    TournamentEntriesValue: TournamentEntriesValue;
    TournamentEntryAddresses: TournamentEntryAddresses;
    TournamentEntryAddressesValue: TournamentEntryAddressesValue;
    TournamentGame: TournamentGame;
    TournamentGameValue: TournamentGameValue;
    EntryCriteria: EntryCriteria;
    TournamentValue: TournamentValue;
    Tournament: Tournament;
    Premium: Premium;
    GatedToken: GatedToken;
    TournamentScoresValue: TournamentScoresValue;
    TournamentScores: TournamentScores;
    TournamentStartsAddress: TournamentStartsAddress;
    TournamentStartsAddressValue: TournamentStartsAddressValue;
    TournamentTotalsValue: TournamentTotalsValue;
    TournamentTotals: TournamentTotals;
  };
}
export const schema: SchemaType = {
  ls_tournaments_v0: {
    AdventurerMetadata: {
      fieldOrder: [
        "birth_date",
        "death_date",
        "level_seed",
        "item_specials_seed",
        "rank_at_death",
        "delay_stat_reveal",
        "golden_token_id",
      ],
      birth_date: 0,
      death_date: 0,
      level_seed: 0,
      item_specials_seed: 0,
      rank_at_death: 0,
      delay_stat_reveal: false,
      golden_token_id: 0,
    },
    AdventurerMetaModel: {
      fieldOrder: ["adventurer_id", "adventurer_meta"],
      adventurer_id: 0,
      adventurer_meta: {
        fieldOrder: [
          "birth_date",
          "death_date",
          "level_seed",
          "item_specials_seed",
          "rank_at_death",
          "delay_stat_reveal",
          "golden_token_id",
        ],
        birth_date: 0,
        death_date: 0,
        level_seed: 0,
        item_specials_seed: 0,
        rank_at_death: 0,
        delay_stat_reveal: false,
        golden_token_id: 0,
      },
    },
    AdventurerMetaModelValue: {
      fieldOrder: ["adventurer_meta"],
      adventurer_meta: {
        fieldOrder: [
          "birth_date",
          "death_date",
          "level_seed",
          "item_specials_seed",
          "rank_at_death",
          "delay_stat_reveal",
          "golden_token_id",
        ],
        birth_date: 0,
        death_date: 0,
        level_seed: 0,
        item_specials_seed: 0,
        rank_at_death: 0,
        delay_stat_reveal: false,
        golden_token_id: 0,
      },
    },
    AdventurerModelValue: {
      fieldOrder: ["adventurer"],
      adventurer: {
        fieldOrder: [
          "health",
          "xp",
          "gold",
          "beast_health",
          "stat_upgrades_available",
          "stats",
          "equipment",
          "battle_action_count",
          "mutated",
          "awaiting_item_specials",
        ],
        health: 0,
        xp: 0,
        gold: 0,
        beast_health: 0,
        stat_upgrades_available: 0,
        stats: {
          fieldOrder: [
            "strength",
            "dexterity",
            "vitality",
            "intelligence",
            "wisdom",
            "charisma",
            "luck",
          ],
          strength: 0,
          dexterity: 0,
          vitality: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
          luck: 0,
        },
        equipment: {
          fieldOrder: [
            "weapon",
            "chest",
            "head",
            "waist",
            "foot",
            "hand",
            "neck",
            "ring",
          ],
          weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        },
        battle_action_count: 0,
        mutated: false,
        awaiting_item_specials: false,
      },
    },
    Stats: {
      fieldOrder: [
        "strength",
        "dexterity",
        "vitality",
        "intelligence",
        "wisdom",
        "charisma",
        "luck",
      ],
      strength: 0,
      dexterity: 0,
      vitality: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    AdventurerModel: {
      fieldOrder: ["adventurer_id", "adventurer"],
      adventurer_id: 0,
      adventurer: {
        fieldOrder: [
          "health",
          "xp",
          "gold",
          "beast_health",
          "stat_upgrades_available",
          "stats",
          "equipment",
          "battle_action_count",
          "mutated",
          "awaiting_item_specials",
        ],
        health: 0,
        xp: 0,
        gold: 0,
        beast_health: 0,
        stat_upgrades_available: 0,
        stats: {
          fieldOrder: [
            "strength",
            "dexterity",
            "vitality",
            "intelligence",
            "wisdom",
            "charisma",
            "luck",
          ],
          strength: 0,
          dexterity: 0,
          vitality: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
          luck: 0,
        },
        equipment: {
          fieldOrder: [
            "weapon",
            "chest",
            "head",
            "waist",
            "foot",
            "hand",
            "neck",
            "ring",
          ],
          weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        },
        battle_action_count: 0,
        mutated: false,
        awaiting_item_specials: false,
      },
    },
    Adventurer: {
      fieldOrder: [
        "health",
        "xp",
        "gold",
        "beast_health",
        "stat_upgrades_available",
        "stats",
        "equipment",
        "battle_action_count",
        "mutated",
        "awaiting_item_specials",
      ],
      health: 0,
      xp: 0,
      gold: 0,
      beast_health: 0,
      stat_upgrades_available: 0,
      stats: {
        fieldOrder: [
          "strength",
          "dexterity",
          "vitality",
          "intelligence",
          "wisdom",
          "charisma",
          "luck",
        ],
        strength: 0,
        dexterity: 0,
        vitality: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        luck: 0,
      },
      equipment: {
        fieldOrder: [
          "weapon",
          "chest",
          "head",
          "waist",
          "foot",
          "hand",
          "neck",
          "ring",
        ],
        weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      },
      battle_action_count: 0,
      mutated: false,
      awaiting_item_specials: false,
    },
    Equipment: {
      fieldOrder: [
        "weapon",
        "chest",
        "head",
        "waist",
        "foot",
        "hand",
        "neck",
        "ring",
      ],
      weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
    },
    Item: {
      fieldOrder: ["id", "xp"],
      id: 0,
      xp: 0,
    },
    Bag: {
      fieldOrder: [
        "item_1",
        "item_2",
        "item_3",
        "item_4",
        "item_5",
        "item_6",
        "item_7",
        "item_8",
        "item_9",
        "item_10",
        "item_11",
        "item_12",
        "item_13",
        "item_14",
        "item_15",
        "mutated",
      ],
      item_1: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_2: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_3: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_4: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_5: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_6: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_7: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_8: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_9: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_10: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_11: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_12: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_13: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_14: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_15: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      mutated: false,
    },
    BagModel: {
      fieldOrder: ["adventurer_id", "bag"],
      adventurer_id: 0,
      bag: {
        fieldOrder: [
          "item_1",
          "item_2",
          "item_3",
          "item_4",
          "item_5",
          "item_6",
          "item_7",
          "item_8",
          "item_9",
          "item_10",
          "item_11",
          "item_12",
          "item_13",
          "item_14",
          "item_15",
          "mutated",
        ],
        item_1: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_2: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_3: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_4: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_5: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_6: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_7: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_8: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_9: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_10: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_11: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_12: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_13: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_14: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_15: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        mutated: false,
      },
    },
    BagModelValue: {
      fieldOrder: ["bag"],
      bag: {
        fieldOrder: [
          "item_1",
          "item_2",
          "item_3",
          "item_4",
          "item_5",
          "item_6",
          "item_7",
          "item_8",
          "item_9",
          "item_10",
          "item_11",
          "item_12",
          "item_13",
          "item_14",
          "item_15",
          "mutated",
        ],
        item_1: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_2: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_3: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_4: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_5: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_6: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_7: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_8: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_9: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_10: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_11: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_12: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_13: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_14: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_15: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        mutated: false,
      },
    },
    ContractsValue: {
      fieldOrder: ["eth", "lords", "oracle"],
      eth: "",
      lords: "",
      oracle: "",
    },
    Contracts: {
      fieldOrder: ["contract", "eth", "lords", "oracle"],
      contract: "",
      eth: "",
      lords: "",
      oracle: "",
    },
    GameCountModel: {
      fieldOrder: ["contract_address", "game_count"],
      contract_address: "",
      game_count: 0,
    },
    GameCountModelValue: {
      fieldOrder: ["game_count"],
      game_count: 0,
    },
    ERC20Data: {
      fieldOrder: ["token_amount"],
      token_amount: 0,
    },
    ERC721Data: {
      fieldOrder: ["token_id"],
      token_id: 0,
    },
    TournamentPrizeValue: {
      fieldOrder: ["token", "token_data_type", "payout_position", "claimed"],
      token: "",
      token_data_type: {
        variant: {
          fieldOrder: ["erc20"],
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        },
        unwrap: function () {
          const variants = Object.values(this.variant);
          const value = variants.find((v) => v !== undefined);
          return value;
        },
        activeVariant: () => "erc20",
      },
      payout_position: 0,
      claimed: false,
    },
    TournamentPrize: {
      fieldOrder: [
        "tournament_id",
        "prize_key",
        "token",
        "token_data_type",
        "payout_position",
        "claimed",
      ],
      tournament_id: 0,
      prize_key: 0,
      token: "",
      token_data_type: {
        variant: {
          fieldOrder: ["token_amount"],
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        },
        unwrap: function () {
          const variants = Object.values(this.variant);
          const value = variants.find((v) => v !== undefined);
          return value;
        },
        activeVariant: () => "erc20",
      },
      payout_position: 0,
      claimed: false,
    },
    Token: {
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
      token_data_type: {
        variant: {
          fieldOrder: ["token_amount"],
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        },
        unwrap: function () {
          const variants = Object.values(this.variant);
          const value = variants.find((v) => v !== undefined);
          return value;
        },
        activeVariant: () => "erc20",
      },
      is_registered: false,
    },
    TokenValue: {
      fieldOrder: ["name", "symbol", "token_data_type", "is_registered"],
      name: "",
      symbol: "",
      token_data_type: {
        variant: {
          fieldOrder: ["token_amount"],
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        },
        unwrap: function () {
          const variants = Object.values(this.variant);
          const value = variants.find((v) => v !== undefined);
          return value;
        },
        activeVariant: () => "erc20",
      },
      is_registered: false,
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
      golden_token: "",
      blobert: "",
      safe_mode: false,
      test_mode: false,
    },
    TournamentEntriesAddressValue: {
      fieldOrder: ["entry_count"],
      entry_count: 0,
    },
    TournamentEntriesAddress: {
      fieldOrder: ["tournament_id", "address", "entry_count"],
      tournament_id: 0,
      address: "",
      entry_count: 0,
    },
    TournamentEntries: {
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
    TournamentEntriesValue: {
      fieldOrder: ["entry_count", "premiums_formatted", "distribute_called"],
      entry_count: 0,
      premiums_formatted: false,
      distribute_called: false,
    },
    TournamentEntryAddresses: {
      fieldOrder: ["tournament_id", "addresses"],
      tournament_id: 0,
      addresses: [""],
    },
    TournamentEntryAddressesValue: {
      fieldOrder: ["addresses"],
      addresses: [""],
    },
    TournamentGame: {
      fieldOrder: ["tournament_id", "game_id", "address", "status"],
      tournament_id: 0,
      game_id: 0,
      address: "",
      status: EntryStatus.Started,
    },
    TournamentGameValue: {
      fieldOrder: ["address", "status"],
      address: "",
      status: EntryStatus.Started,
    },
    EntryCriteria: {
      fieldOrder: ["token_id", "entry_count"],
      token_id: 0,
      entry_count: 0,
    },
    TournamentValue: {
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
    Tournament: {
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
      registration_start_time: 0,
      registration_end_time: 0,
      start_time: 0,
      end_time: 0,
      submission_period: 0,
      winners_count: 0,
      gated_type: new CairoOption(CairoOptionVariant.None),
      entry_premium: new CairoOption(CairoOptionVariant.Some, {
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
    GatedToken: {
      fieldOrder: ["token", "entry_type"],
      token: "",
      entry_type: {
        variant: {
          fieldOrder: ["criteria", "uniform"],
          criteria: [
            {
              fieldOrder: ["token_id", "entry_count"],
              token_id: 0,
              entry_count: 0,
            },
          ],
          uniform: 0,
        },
        unwrap: function () {
          const variants = Object.values(this.variant);
          const value = variants.find((v) => v !== undefined);
          return value;
        },
        activeVariant: () => "criteria",
      },
    },
    TournamentScoresValue: {
      fieldOrder: ["top_score_ids"],
      top_score_ids: [0],
    },
    TournamentScores: {
      fieldOrder: ["tournament_id", "top_score_ids"],
      tournament_id: 0,
      top_score_ids: [0],
    },
    TournamentStartsAddress: {
      fieldOrder: ["tournament_id", "address", "start_count"],
      tournament_id: 0,
      address: "",
      start_count: 0,
    },
    TournamentStartsAddressValue: {
      fieldOrder: ["start_count"],
      start_count: 0,
    },
    TournamentTotalsValue: {
      fieldOrder: ["total_tournaments", "total_prizes"],
      total_tournaments: 0,
      total_prizes: 0,
    },
    TournamentTotals: {
      fieldOrder: ["contract", "total_tournaments", "total_prizes"],
      contract: "",
      total_tournaments: 0,
      total_prizes: 0,
    },
  },
};
// Type definition for ERC__Balance struct
export type ERC__Type = "ERC20" | "ERC721";
export interface ERC__Balance {
  fieldOrder: string[];
  balance: string;
  type: string;
  tokenMetadata: ERC__Token;
}
export interface ERC__Token {
  fieldOrder: string[];
  name: string;
  symbol: string;
  tokenId: string;
  decimals: string;
  contractAddress: string;
}
export interface ERC__Transfer {
  fieldOrder: string[];
  from: string;
  to: string;
  amount: string;
  type: string;
  executedAt: string;
  tokenMetadata: ERC__Token;
  transactionHash: string;
}
