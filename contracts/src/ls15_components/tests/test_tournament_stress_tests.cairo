use starknet::testing;
use ls_tournaments_v0::ls15_components::constants::{MIN_SUBMISSION_PERIOD};
use ls_tournaments_v0::ls15_components::models::tournament::{
    TournamentGame, EntryStatus, TokenDataType, ERC20Data, TournamentPrize
};

use ls_tournaments_v0::ls15_components::tests::interfaces::{
    ILootSurvivorMockDispatcherTrait, ITournamentMockDispatcherTrait, IERC20MockDispatcherTrait
};
use ls_tournaments_v0::ls15_components::tests::test_tournament::{setup, TestContracts};
use ls_tournaments_v0::tests::{
    utils,
    constants::{
        OWNER, TOURNAMENT_NAME, TOURNAMENT_DESCRIPTION, TEST_START_TIME, TEST_END_TIME,
        TEST_REGISTRATION_START_TIME, TEST_REGISTRATION_END_TIME
    },
};
use ls_tournaments_v0::ls15_components::tests::helpers::{create_dead_adventurer_with_xp};

use dojo::model::{ModelStorageTest};

#[test]
fn test_submit_multiple_scores_stress_test() {
    let mut contracts: TestContracts = setup();

    utils::impersonate(OWNER());

    let tournament_id = contracts
        .tournament
        .create_tournament(
            TOURNAMENT_NAME(),
            TOURNAMENT_DESCRIPTION(),
            TEST_REGISTRATION_START_TIME().into(),
            TEST_REGISTRATION_END_TIME().into(),
            TEST_START_TIME().into(),
            TEST_END_TIME().into(),
            MIN_SUBMISSION_PERIOD.into(),
            150, // 100 top scores
            Option::None, // zero gated type
            Option::None, // zero entry premium
        );

    utils::impersonate(OWNER());

    testing::set_block_timestamp(TEST_END_TIME().into());

    // Set data to adventurers with increasing XP
    let mut i: u64 = 0;
    loop {
        if i == 150 {
            break;
        }
        let submitted_adventurer = create_dead_adventurer_with_xp((i + 1).try_into().unwrap());
        contracts.loot_survivor.set_adventurer((i + 1).try_into().unwrap(), submitted_adventurer);
        i += 1;
    };

    let mut i: u64 = 0;
    loop {
        if i == 150 {
            break;
        }
        contracts
            .world
            .write_model_test(
                @TournamentGame {
                    tournament_id: tournament_id,
                    game_id: i + 1,
                    address: OWNER(),
                    status: EntryStatus::Started,
                }
            );
        i += 1;
    };

    // Submit scores in order of position
    let mut score_ids: Array<felt252> = array![];
    let mut i: u64 = 0;
    loop {
        if i == 150 {
            break;
        }
        score_ids.append((150 - i).try_into().unwrap());
        i += 1;
    };
    contracts.tournament.submit_scores(tournament_id, score_ids);
}

#[test]
fn test_distribute_many_prizes() {
    let mut contracts: TestContracts = setup();

    let tournament_id = contracts
        .tournament
        .create_tournament(
            TOURNAMENT_NAME(),
            TOURNAMENT_DESCRIPTION(),
            TEST_REGISTRATION_START_TIME().into(),
            TEST_REGISTRATION_END_TIME().into(),
            TEST_START_TIME().into(),
            TEST_END_TIME().into(),
            MIN_SUBMISSION_PERIOD.into(),
            250, // 250 top scores
            Option::None, // zero gated type
            Option::None, // zero entry premium
        );

    utils::impersonate(OWNER());

    testing::set_block_timestamp(TEST_END_TIME().into());

    contracts.erc20.transfer(contracts.tournament.contract_address, 250);

    let mut i: u64 = 0;
    loop {
        if i == 250 {
            break;
        }
        contracts
            .world
            .write_model_test(
                @TournamentPrize {
                    tournament_id,
                    prize_key: i + 1,
                    token: contracts.erc20.contract_address,
                    token_data_type: TokenDataType::erc20(ERC20Data { token_amount: 1 }),
                    payout_position: (i + 1).try_into().unwrap(),
                    claimed: true
                }
            );
        i += 1;
    };

    testing::set_block_timestamp((TEST_END_TIME() + MIN_SUBMISSION_PERIOD).into());

    let mut i: u64 = 0;
    let mut prize_keys: Array<u64> = array![];
    loop {
        if i == 250 {
            break;
        }
        prize_keys.append(i + 1);
        i += 1;
    };

    contracts.tournament.distribute_prizes(tournament_id, prize_keys);
}
