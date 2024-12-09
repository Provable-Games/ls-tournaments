import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import type { CairoCustomEnum, CairoOption, BigNumberish } from 'starknet';

export type TypedCairoEnum<T> = CairoCustomEnum & {
	variant: { [K in keyof T]: T[K] | undefined };
	unwrap(): T[keyof T];
}

type RemoveFieldOrder<T> = T extends object
  ? Omit<
      {
        [K in keyof T]: T[K] extends object ? RemoveFieldOrder<T[K]> : T[K];
      },
      'fieldOrder'
    >
  : T;
// Type definition for `tournament::ls15_components::models::tournament::PrizesModelValue` struct
export interface PrizesModelValue {
	fieldOrder: string[];
	token: string;
	token_data_type: TokenDataTypeEnum;
	payout_position: BigNumberish;
	claimed: boolean;
}
export type InputPrizesModelValue = RemoveFieldOrder<PrizesModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::ERC721Data` struct
export interface ERC721Data {
	fieldOrder: string[];
	token_id: BigNumberish;
}
export type InputERC721Data = RemoveFieldOrder<ERC721Data>;

// Type definition for `tournament::ls15_components::models::tournament::ERC20Data` struct
export interface ERC20Data {
	fieldOrder: string[];
	token_amount: BigNumberish;
}
export type InputERC20Data = RemoveFieldOrder<ERC20Data>;

// Type definition for `tournament::ls15_components::models::tournament::PrizesModel` struct
export interface PrizesModel {
	fieldOrder: string[];
	prize_key: BigNumberish;
	token: string;
	token_data_type: TokenDataTypeEnum;
	payout_position: BigNumberish;
	claimed: boolean;
}
export type InputPrizesModel = RemoveFieldOrder<PrizesModel>;

// Type definition for `tournament::ls15_components::models::tournament::TokenModelValue` struct
export interface TokenModelValue {
	fieldOrder: string[];
	name: string;
	symbol: string;
	token_data_type: TokenDataTypeEnum;
	is_registered: boolean;
}
export type InputTokenModelValue = RemoveFieldOrder<TokenModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TokenModel` struct
export interface TokenModel {
	fieldOrder: string[];
	token: string;
	name: string;
	symbol: string;
	token_data_type: TokenDataTypeEnum;
	is_registered: boolean;
}
export type InputTokenModel = RemoveFieldOrder<TokenModel>;

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
export type InputTournamentConfigValue = RemoveFieldOrder<TournamentConfigValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentConfig` struct
export interface TournamentConfig {
	fieldOrder: string[];
	contract: string;
	eth: string;
	lords: string;
	loot_survivor: string;
	oracle: string;
	safe_mode: boolean;
	test_mode: boolean;
}
export type InputTournamentConfig = RemoveFieldOrder<TournamentConfig>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesAddressModel` struct
export interface TournamentEntriesAddressModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	address: string;
	entry_count: BigNumberish;
}
export type InputTournamentEntriesAddressModel = RemoveFieldOrder<TournamentEntriesAddressModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesAddressModelValue` struct
export interface TournamentEntriesAddressModelValue {
	fieldOrder: string[];
	entry_count: BigNumberish;
}
export type InputTournamentEntriesAddressModelValue = RemoveFieldOrder<TournamentEntriesAddressModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesModelValue` struct
export interface TournamentEntriesModelValue {
	fieldOrder: string[];
	entry_count: BigNumberish;
	premiums_formatted: boolean;
	distribute_called: boolean;
}
export type InputTournamentEntriesModelValue = RemoveFieldOrder<TournamentEntriesModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntriesModel` struct
export interface TournamentEntriesModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	entry_count: BigNumberish;
	premiums_formatted: boolean;
	distribute_called: boolean;
}
export type InputTournamentEntriesModel = RemoveFieldOrder<TournamentEntriesModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntryAddressesModelValue` struct
export interface TournamentEntryAddressesModelValue {
	fieldOrder: string[];
	addresses: Array<string>;
}
export type InputTournamentEntryAddressesModelValue = RemoveFieldOrder<TournamentEntryAddressesModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentEntryAddressesModel` struct
export interface TournamentEntryAddressesModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	addresses: Array<string>;
}
export type InputTournamentEntryAddressesModel = RemoveFieldOrder<TournamentEntryAddressesModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentGameModel` struct
export interface TournamentGameModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	game_id: BigNumberish;
	address: string;
	status: EntryStatus;
}
export type InputTournamentGameModel = RemoveFieldOrder<TournamentGameModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentGameModelValue` struct
export interface TournamentGameModelValue {
	fieldOrder: string[];
	address: string;
	status: EntryStatus;
}
export type InputTournamentGameModelValue = RemoveFieldOrder<TournamentGameModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::Premium` struct
export interface Premium {
	fieldOrder: string[];
	token: string;
	token_amount: BigNumberish;
	token_distribution: Array<BigNumberish>;
	creator_fee: BigNumberish;
}
export type InputPremium = RemoveFieldOrder<Premium>;

// Type definition for `tournament::ls15_components::models::tournament::EntryCriteria` struct
export interface EntryCriteria {
	fieldOrder: string[];
	token_id: BigNumberish;
	entry_count: BigNumberish;
}
export type InputEntryCriteria = RemoveFieldOrder<EntryCriteria>;

// Type definition for `tournament::ls15_components::models::tournament::GatedToken` struct
export interface GatedToken {
	fieldOrder: string[];
	token: string;
	entry_type: GatedEntryType;
}
export type InputGatedToken = RemoveFieldOrder<GatedToken>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentModelValue` struct
export interface TournamentModelValue {
	fieldOrder: string[];
	name: BigNumberish;
	description: string;
	creator: string;
	start_time: BigNumberish;
	end_time: BigNumberish;
	submission_period: BigNumberish;
	winners_count: BigNumberish;
	gated_type: CairoOption<GatedType>;
	entry_premium: CairoOption<Premium>;
}
export type InputTournamentModelValue = RemoveFieldOrder<TournamentModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentModel` struct
export interface TournamentModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	name: BigNumberish;
	description: string;
	creator: string;
	start_time: BigNumberish;
	end_time: BigNumberish;
	submission_period: BigNumberish;
	winners_count: BigNumberish;
	gated_type: CairoOption<GatedType>;
	entry_premium: CairoOption<Premium>;
}
export type InputTournamentModel = RemoveFieldOrder<TournamentModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentPrizeKeysModel` struct
export interface TournamentPrizeKeysModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	prize_keys: Array<BigNumberish>;
}
export type InputTournamentPrizeKeysModel = RemoveFieldOrder<TournamentPrizeKeysModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentPrizeKeysModelValue` struct
export interface TournamentPrizeKeysModelValue {
	fieldOrder: string[];
	prize_keys: Array<BigNumberish>;
}
export type InputTournamentPrizeKeysModelValue = RemoveFieldOrder<TournamentPrizeKeysModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentScoresModelValue` struct
export interface TournamentScoresModelValue {
	fieldOrder: string[];
	top_score_ids: Array<BigNumberish>;
}
export type InputTournamentScoresModelValue = RemoveFieldOrder<TournamentScoresModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentScoresModel` struct
export interface TournamentScoresModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	top_score_ids: Array<BigNumberish>;
}
export type InputTournamentScoresModel = RemoveFieldOrder<TournamentScoresModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartIdsModel` struct
export interface TournamentStartIdsModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	address: string;
	game_ids: Array<BigNumberish>;
}
export type InputTournamentStartIdsModel = RemoveFieldOrder<TournamentStartIdsModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartIdsModelValue` struct
export interface TournamentStartIdsModelValue {
	fieldOrder: string[];
	game_ids: Array<BigNumberish>;
}
export type InputTournamentStartIdsModelValue = RemoveFieldOrder<TournamentStartIdsModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartsAddressModelValue` struct
export interface TournamentStartsAddressModelValue {
	fieldOrder: string[];
	start_count: BigNumberish;
}
export type InputTournamentStartsAddressModelValue = RemoveFieldOrder<TournamentStartsAddressModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentStartsAddressModel` struct
export interface TournamentStartsAddressModel {
	fieldOrder: string[];
	tournament_id: BigNumberish;
	address: string;
	start_count: BigNumberish;
}
export type InputTournamentStartsAddressModel = RemoveFieldOrder<TournamentStartsAddressModel>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentTotalsModelValue` struct
export interface TournamentTotalsModelValue {
	fieldOrder: string[];
	total_tournaments: BigNumberish;
	total_prizes: BigNumberish;
}
export type InputTournamentTotalsModelValue = RemoveFieldOrder<TournamentTotalsModelValue>;

// Type definition for `tournament::ls15_components::models::tournament::TournamentTotalsModel` struct
export interface TournamentTotalsModel {
	fieldOrder: string[];
	contract: string;
	total_tournaments: BigNumberish;
	total_prizes: BigNumberish;
}
export type InputTournamentTotalsModel = RemoveFieldOrder<TournamentTotalsModel>;

// Type definition for `tournament::ls15_components::models::tournament::TokenDataType` enum
export type TokenDataType = {
	erc20: ERC20Data;
	erc721: ERC721Data;
}
export type TokenDataTypeEnum = TypedCairoEnum<TokenDataType>;

// Type definition for `tournament::ls15_components::models::tournament::EntryStatus` enum
export enum EntryStatus {
	Started,
	Submitted,
}

// Type definition for `tournament::ls15_components::models::tournament::GatedEntryType` enum
export enum GatedEntryType {
	criteria,
	uniform,
}

// Type definition for `tournament::ls15_components::models::tournament::GatedType` enum
export type GatedType = {
	token: GatedToken;
	tournament: Array<BigNumberish>;
	address: Array<string>;
}
export type GatedTypeEnum = TypedCairoEnum<GatedType>;

export interface SchemaType extends ISchemaType {
	tournament: {
		PrizesModelValue: PrizesModelValue,
		ERC721Data: ERC721Data,
		ERC20Data: ERC20Data,
		PrizesModel: PrizesModel,
		TokenModelValue: TokenModelValue,
		TokenModel: TokenModel,
		TournamentConfigValue: TournamentConfigValue,
		TournamentConfig: TournamentConfig,
		TournamentEntriesAddressModel: TournamentEntriesAddressModel,
		TournamentEntriesAddressModelValue: TournamentEntriesAddressModelValue,
		TournamentEntriesModelValue: TournamentEntriesModelValue,
		TournamentEntriesModel: TournamentEntriesModel,
		TournamentEntryAddressesModelValue: TournamentEntryAddressesModelValue,
		TournamentEntryAddressesModel: TournamentEntryAddressesModel,
		TournamentGameModel: TournamentGameModel,
		TournamentGameModelValue: TournamentGameModelValue,
		Premium: Premium,
		EntryCriteria: EntryCriteria,
		GatedToken: GatedToken,
		TournamentModelValue: TournamentModelValue,
		TournamentModel: TournamentModel,
		TournamentPrizeKeysModel: TournamentPrizeKeysModel,
		TournamentPrizeKeysModelValue: TournamentPrizeKeysModelValue,
		TournamentScoresModelValue: TournamentScoresModelValue,
		TournamentScoresModel: TournamentScoresModel,
		TournamentStartIdsModel: TournamentStartIdsModel,
		TournamentStartIdsModelValue: TournamentStartIdsModelValue,
		TournamentStartsAddressModelValue: TournamentStartsAddressModelValue,
		TournamentStartsAddressModel: TournamentStartsAddressModel,
		TournamentTotalsModelValue: TournamentTotalsModelValue,
		TournamentTotalsModel: TournamentTotalsModel,
	},
}
export const schema: SchemaType = {
	tournament: {
		PrizesModelValue: {
			fieldOrder: ['token', 'token_data_type', 'payout_position', 'claimed'],
			token: "",
			token_data_type: { fieldOrder: ['token_amount'], token_amount: 0, },
			payout_position: 0,
			claimed: false,
		},
		ERC721Data: {
			fieldOrder: ['token_id'],
			token_id: 0,
		},
		ERC20Data: {
			fieldOrder: ['token_amount'],
			token_amount: 0,
		},
		PrizesModel: {
			fieldOrder: ['prize_key', 'token', 'token_data_type', 'payout_position', 'claimed'],
			prize_key: 0,
			token: "",
			token_data_type: { fieldOrder: ['token_amount'], token_amount: 0, },
			payout_position: 0,
			claimed: false,
		},
		TokenModelValue: {
			fieldOrder: ['name', 'symbol', 'token_data_type', 'is_registered'],
			name: "",
			symbol: "",
			token_data_type: { fieldOrder: ['token_amount'], token_amount: 0, },
			is_registered: false,
		},
		TokenModel: {
			fieldOrder: ['token', 'name', 'symbol', 'token_data_type', 'is_registered'],
			token: "",
			name: "",
			symbol: "",
			token_data_type: { fieldOrder: ['token_amount'], token_amount: 0, },
			is_registered: false,
		},
		TournamentConfigValue: {
			fieldOrder: ['eth', 'lords', 'loot_survivor', 'oracle', 'safe_mode', 'test_mode'],
			eth: "",
			lords: "",
			loot_survivor: "",
			oracle: "",
			safe_mode: false,
			test_mode: false,
		},
		TournamentConfig: {
			fieldOrder: ['contract', 'eth', 'lords', 'loot_survivor', 'oracle', 'safe_mode', 'test_mode'],
			contract: "",
			eth: "",
			lords: "",
			loot_survivor: "",
			oracle: "",
			safe_mode: false,
			test_mode: false,
		},
		TournamentEntriesAddressModel: {
			fieldOrder: ['tournament_id', 'address', 'entry_count'],
			tournament_id: 0,
			address: "",
			entry_count: 0,
		},
		TournamentEntriesAddressModelValue: {
			fieldOrder: ['entry_count'],
			entry_count: 0,
		},
		TournamentEntriesModelValue: {
			fieldOrder: ['entry_count', 'premiums_formatted', 'distribute_called'],
			entry_count: 0,
			premiums_formatted: false,
			distribute_called: false,
		},
		TournamentEntriesModel: {
			fieldOrder: ['tournament_id', 'entry_count', 'premiums_formatted', 'distribute_called'],
			tournament_id: 0,
			entry_count: 0,
			premiums_formatted: false,
			distribute_called: false,
		},
		TournamentEntryAddressesModelValue: {
			fieldOrder: ['addresses'],
			addresses: [""],
		},
		TournamentEntryAddressesModel: {
			fieldOrder: ['tournament_id', 'addresses'],
			tournament_id: 0,
			addresses: [""],
		},
		TournamentGameModel: {
			fieldOrder: ['tournament_id', 'game_id', 'address', 'status'],
			tournament_id: 0,
			game_id: 0,
			address: "",
			status: EntryStatus.Started,
		},
		TournamentGameModelValue: {
			fieldOrder: ['address', 'status'],
			address: "",
			status: EntryStatus.Started,
		},
		Premium: {
			fieldOrder: ['token', 'token_amount', 'token_distribution', 'creator_fee'],
			token: "",
			token_amount: 0,
			token_distribution: [0],
			creator_fee: 0,
		},
		EntryCriteria: {
			fieldOrder: ['token_id', 'entry_count'],
			token_id: 0,
			entry_count: 0,
		},
		GatedToken: {
			fieldOrder: ['token', 'entry_type'],
			token: "",
			entry_type: GatedEntryType.criteria,
		},
		TournamentModelValue: {
			fieldOrder: ['name', 'description', 'creator', 'start_time', 'end_time', 'submission_period', 'winners_count', 'gated_type', 'entry_premium'],
			name: 0,
			description: "",
			creator: "",
			start_time: 0,
			end_time: 0,
			submission_period: 0,
			winners_count: 0,
			gated_type: Option,
			entry_premium: Option,
		},
		TournamentModel: {
			fieldOrder: ['tournament_id', 'name', 'description', 'creator', 'start_time', 'end_time', 'submission_period', 'winners_count', 'gated_type', 'entry_premium'],
			tournament_id: 0,
			name: 0,
			description: "",
			creator: "",
			start_time: 0,
			end_time: 0,
			submission_period: 0,
			winners_count: 0,
			gated_type: Option,
			entry_premium: Option,
		},
		TournamentPrizeKeysModel: {
			fieldOrder: ['tournament_id', 'prize_keys'],
			tournament_id: 0,
			prize_keys: [0],
		},
		TournamentPrizeKeysModelValue: {
			fieldOrder: ['prize_keys'],
			prize_keys: [0],
		},
		TournamentScoresModelValue: {
			fieldOrder: ['top_score_ids'],
			top_score_ids: [0],
		},
		TournamentScoresModel: {
			fieldOrder: ['tournament_id', 'top_score_ids'],
			tournament_id: 0,
			top_score_ids: [0],
		},
		TournamentStartIdsModel: {
			fieldOrder: ['tournament_id', 'address', 'game_ids'],
			tournament_id: 0,
			address: "",
			game_ids: [0],
		},
		TournamentStartIdsModelValue: {
			fieldOrder: ['game_ids'],
			game_ids: [0],
		},
		TournamentStartsAddressModelValue: {
			fieldOrder: ['start_count'],
			start_count: 0,
		},
		TournamentStartsAddressModel: {
			fieldOrder: ['tournament_id', 'address', 'start_count'],
			tournament_id: 0,
			address: "",
			start_count: 0,
		},
		TournamentTotalsModelValue: {
			fieldOrder: ['total_tournaments', 'total_prizes'],
			total_tournaments: 0,
			total_prizes: 0,
		},
		TournamentTotalsModel: {
			fieldOrder: ['contract', 'total_tournaments', 'total_prizes'],
			contract: "",
			total_tournaments: 0,
			total_prizes: 0,
		},
	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
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