use starknet::ContractAddress;
use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};

use ls_tournaments_v0::ls15_components::models::loot_survivor::{
    AdventurerModel, AdventurerMetaModel, BagModel, GameCountModel, FreeGameAvailableModel,
    Contracts
};
use ls_tournaments_v0::ls15_components::models::tournament::{
    TournamentTotals, Tournament, TournamentEntries, TournamentPrize, TournamentScores,
    Token, TournamentEntriesAddress, TournamentEntryAddresses, TournamentStartsAddress,
    TournamentGame, TournamentConfig, FreeGameTokenType
};

#[derive(Copy, Drop)]
pub struct Store {
    world: WorldStorage,
}

#[generate_trait]
pub impl StoreImpl of StoreTrait {
    #[inline(always)]
    fn new(world: WorldStorage) -> Store {
        (Store { world })
    }

    //
    // Getters
    //

    // Loot Survivor

    #[inline(always)]
    fn get_adventurer_model(ref self: Store, adventurer_id: felt252) -> AdventurerModel {
        (self.world.read_model(adventurer_id))
    }

    #[inline(always)]
    fn get_adventurer_meta_model(ref self: Store, adventurer_id: felt252) -> AdventurerMetaModel {
        (self.world.read_model(adventurer_id))
    }

    #[inline(always)]
    fn get_bag_model(ref self: Store, adventurer_id: felt252) -> BagModel {
        (self.world.read_model(adventurer_id))
    }

    #[inline(always)]
    fn get_game_count_model(ref self: Store, contract: ContractAddress) -> GameCountModel {
        (self.world.read_model(contract))
    }

    #[inline(always)]
    fn get_free_game_available_model(
        ref self: Store, free_game_type: FreeGameTokenType, token_id: u128
    ) -> FreeGameAvailableModel {
        (self.world.read_model((free_game_type, token_id),))
    }

    #[inline(always)]
    fn get_contracts_model(ref self: Store, contract: ContractAddress) -> Contracts {
        (self.world.read_model(contract))
    }

    // Tournament

    #[inline(always)]
    fn get_tournament_totals(ref self: Store, contract: ContractAddress) -> TournamentTotals {
        (self.world.read_model(contract))
    }

    #[inline(always)]
    fn get_tournament(ref self: Store, tournament_id: u64) -> Tournament {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_total_entries(ref self: Store, tournament_id: u64) -> TournamentEntries {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_address_entries(
        ref self: Store, tournament_id: u64, account: ContractAddress
    ) -> TournamentEntriesAddress {
        (self.world.read_model((tournament_id, account),))
    }

    #[inline(always)]
    fn get_tournament_entry_addresses(
        ref self: Store, tournament_id: u64
    ) -> TournamentEntryAddresses {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_tournament_starts(
        ref self: Store, tournament_id: u64, address: ContractAddress
    ) -> TournamentStartsAddress {
        (self.world.read_model((tournament_id, address),))
    }

    #[inline(always)]
    fn get_tournament_game(
        ref self: Store, tournament_id: u64, game_id: felt252
    ) -> TournamentGame {
        (self.world.read_model((tournament_id, game_id),))
    }

    #[inline(always)]
    fn get_tournament_scores(ref self: Store, tournament_id: u64) -> TournamentScores {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_prize(ref self: Store, tournament_id: u64, prize_key: u64) -> TournamentPrize {
        (self.world.read_model((tournament_id, prize_key),))
    }

    #[inline(always)]
    fn get_token(ref self: Store, token: ContractAddress) -> Token {
        (self.world.read_model(token))
    }

    #[inline(always)]
    fn get_tournament_config(ref self: Store, contract: ContractAddress) -> TournamentConfig {
        (self.world.read_model(contract))
    }
    // Setters
    //

    // Loot Survivor

    #[inline(always)]
    fn set_adventurer_model(ref self: Store, model: @AdventurerModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_adventurer_meta_model(ref self: Store, model: @AdventurerMetaModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_bag_model(ref self: Store, model: @BagModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_game_count_model(ref self: Store, model: @GameCountModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_free_game_available_model(ref self: Store, model: @FreeGameAvailableModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_contracts_model(ref self: Store, model: @Contracts) {
        self.world.write_model(model);
    }

    // Tournament

    #[inline(always)]
    fn set_tournament_totals(ref self: Store, model: @TournamentTotals) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament(ref self: Store, model: @Tournament) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_total_entries(ref self: Store, model: @TournamentEntries) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_address_entries(ref self: Store, model: @TournamentEntriesAddress) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_entry_addresses(ref self: Store, model: @TournamentEntryAddresses) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_address_starts(ref self: Store, model: @TournamentStartsAddress) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_game(ref self: Store, model: @TournamentGame) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_scores(ref self: Store, model: @TournamentScores) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_prize(ref self: Store, model: @TournamentPrize) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_token(ref self: Store, model: @Token) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_config(ref self: Store, model: @TournamentConfig) {
        self.world.write_model(model);
    }
}
