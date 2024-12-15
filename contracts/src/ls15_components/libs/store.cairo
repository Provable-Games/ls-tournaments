use starknet::ContractAddress;
use dojo::world::{WorldStorage};
use dojo::model::{ModelStorage};

use tournament::ls15_components::models::tournament::{
    TournamentTotalsModel, TournamentModel, TournamentEntriesModel, TournamentPrizeKeysModel,
    PrizesModel, TournamentScoresModel, TokenModel, TournamentEntriesAddressModel,
    TournamentEntryAddressesModel, TournamentStartsAddressModel, TournamentGameModel,
    TournamentConfig, TournamentStartIdsModel
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

    // Tournament

    #[inline(always)]
    fn get_tournament_totals(self: Store, contract: ContractAddress) -> TournamentTotalsModel {
        (self.world.read_model(contract))
    }

    #[inline(always)]
    fn get_tournament(self: Store, tournament_id: u64) -> TournamentModel {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_total_entries(self: Store, tournament_id: u64) -> TournamentEntriesModel {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_address_entries(
        self: Store, tournament_id: u64, account: ContractAddress
    ) -> TournamentEntriesAddressModel {
        (self.world.read_model((tournament_id, account),))
    }

    #[inline(always)]
    fn get_tournament_entry_addresses(
        self: Store, tournament_id: u64
    ) -> TournamentEntryAddressesModel {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_tournament_starts(
        self: Store, tournament_id: u64, address: ContractAddress
    ) -> TournamentStartsAddressModel {
        (self.world.read_model((tournament_id, address),))
    }

    #[inline(always)]
    fn get_tournament_game(
        self: Store, tournament_id: u64, game_id: felt252
    ) -> TournamentGameModel {
        (self.world.read_model((tournament_id, game_id),))
    }

    #[inline(always)]
    fn get_tournament_scores(self: Store, tournament_id: u64) -> TournamentScoresModel {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_prize_keys(self: Store, tournament_id: u64) -> TournamentPrizeKeysModel {
        (self.world.read_model(tournament_id))
    }

    #[inline(always)]
    fn get_prize(self: Store, prize_key: u64) -> PrizesModel {
        (self.world.read_model(prize_key))
    }

    #[inline(always)]
    fn get_token(self: Store, token: ContractAddress) -> TokenModel {
        (self.world.read_model(token))
    }

    #[inline(always)]
    fn get_tournament_config(self: Store, contract: ContractAddress) -> TournamentConfig {
        (self.world.read_model(contract))
    }
    // Setters
    //

    // Tournament

    #[inline(always)]
    fn set_tournament_totals(ref self: Store, model: @TournamentTotalsModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament(ref self: Store, model: @TournamentModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_total_entries(ref self: Store, model: @TournamentEntriesModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_address_entries(ref self: Store, model: @TournamentEntriesAddressModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_entry_addresses(ref self: Store, model: @TournamentEntryAddressesModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_address_starts(ref self: Store, model: @TournamentStartsAddressModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_game(ref self: Store, model: @TournamentGameModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_starts(ref self: Store, model: @TournamentStartIdsModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_scores(ref self: Store, model: @TournamentScoresModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_prize_keys(ref self: Store, model: @TournamentPrizeKeysModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_prize(ref self: Store, model: @PrizesModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_token(ref self: Store, model: @TokenModel) {
        self.world.write_model(model);
    }

    #[inline(always)]
    fn set_tournament_config(ref self: Store, model: @TournamentConfig) {
        self.world.write_model(model);
    }
}
