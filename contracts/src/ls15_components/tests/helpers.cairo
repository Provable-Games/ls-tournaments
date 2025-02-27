use starknet::get_block_timestamp;
use ls_tournaments_v0::ls15_components::constants::MIN_SUBMISSION_PERIOD;
use ls_tournaments_v0::tests::{
    constants::{
        TOURNAMENT_NAME, TOURNAMENT_DESCRIPTION, TEST_REGISTRATION_START_TIME,
        TEST_REGISTRATION_END_TIME, TEST_START_TIME, TEST_END_TIME
    },
};
use ls_tournaments_v0::ls15_components::tests::interfaces::{
    IERC20MockDispatcher, IERC20MockDispatcherTrait, IERC721MockDispatcher,
    IERC721MockDispatcherTrait, ITournamentMockDispatcher, ITournamentMockDispatcherTrait
};
use adventurer::{adventurer::Adventurer, equipment::Equipment, item::Item, stats::Stats};
use ls_tournaments_v0::ls15_components::models::loot_survivor::AdventurerMetadataStorage;

//
// Test Helpers
//

pub fn create_basic_tournament(tournament: ITournamentMockDispatcher) -> u64 {
    tournament
        .create_tournament(
            TOURNAMENT_NAME(),
            TOURNAMENT_DESCRIPTION(),
            TEST_REGISTRATION_START_TIME().into(),
            TEST_REGISTRATION_END_TIME().into(),
            TEST_START_TIME().into(),
            TEST_END_TIME().into(),
            MIN_SUBMISSION_PERIOD.into(),
            1, // single top score
            Option::None, // zero gated type
            Option::None, // zero entry premium
        )
}

pub fn approve_game_costs(
    eth: IERC20MockDispatcher,
    lords: IERC20MockDispatcher,
    tournament: ITournamentMockDispatcher,
    entries: u256
) {
    lords.approve(tournament.contract_address, entries * 50000000000000000000);
    eth.approve(tournament.contract_address, entries * 200000000000000);
}

pub fn approve_free_game_cost(
    eth: IERC20MockDispatcher,
    golden_token: IERC721MockDispatcher,
    token_id: u256,
    tournament: ITournamentMockDispatcher
) {
    eth.approve(tournament.contract_address, 200000000000000);
    golden_token.approve(tournament.contract_address, token_id);
}

pub fn create_dead_adventurer_with_xp(xp: u16) -> Adventurer {
    Adventurer {
        health: 0,
        xp,
        stats: Stats {
            strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0
        },
        gold: 0,
        equipment: Equipment {
            weapon: Item { id: 12, xp: 0 },
            chest: Item { id: 0, xp: 0 },
            head: Item { id: 0, xp: 0 },
            waist: Item { id: 0, xp: 0 },
            foot: Item { id: 0, xp: 0 },
            hand: Item { id: 0, xp: 0 },
            neck: Item { id: 0, xp: 0 },
            ring: Item { id: 0, xp: 0 }
        },
        beast_health: 3,
        stat_upgrades_available: 0,
        battle_action_count: 0,
        mutated: false,
        awaiting_item_specials: false
    }
}

pub fn create_adventurer_metadata_with_death_date(death_date: u64) -> AdventurerMetadataStorage {
    AdventurerMetadataStorage {
        birth_date: get_block_timestamp().into(),
        death_date: death_date,
        level_seed: 0,
        item_specials_seed: 0,
        rank_at_death: 0,
        delay_stat_reveal: false,
        golden_token_id: 0,
    }
}
