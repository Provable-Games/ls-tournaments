use starknet::ContractAddress;
use ls_tournaments_v0::ls15_components::models::tournament::{
    Tournament as TournamentModel, GatedType, Premium, GatedSubmissionType, TokenDataType
};

///
/// Interface
///

#[starknet::interface]
trait ITournament<TState> {
    fn total_tournaments(self: @TState) -> u64;
    fn tournament(self: @TState, tournament_id: u64) -> TournamentModel;
    fn tournament_entries(self: @TState, tournament_id: u64) -> u64;
    fn top_scores(self: @TState, tournament_id: u64) -> Array<u64>;
    fn is_token_registered(self: @TState, token: ContractAddress) -> bool;
    // TODO: add for V2 (only ERC721 tokens)
    fn register_token(ref self: TState, token: ContractAddress, token_data_type: TokenDataType);
    fn create_tournament(
        ref self: TState,
        name: felt252,
        description: ByteArray,
        registration_start_time: u64,
        registration_end_time: u64,
        start_time: u64,
        end_time: u64,
        submission_period: u64,
        winners_count: u8,
        gated_type: Option<GatedType>,
        entry_premium: Option<Premium>,
    ) -> u64;
    fn enter_tournament(
        ref self: TState, tournament_id: u64, gated_submission_type: Option<GatedSubmissionType>
    );
    fn start_tournament(
        ref self: TState,
        tournament_id: u64,
        start_all: bool,
        start_count: Option<u64>,
        client_reward_address: ContractAddress,
        golden_token_free_game_token_ids: Span<u256>,
        blobert_free_game_token_ids: Span<u256>,
        weapon: u8,
        name: felt252,
    );
    fn submit_scores(ref self: TState, tournament_id: u64, game_ids: Array<felt252>);
    fn add_prize(
        ref self: TState,
        tournament_id: u64,
        token: ContractAddress,
        token_data_type: TokenDataType,
        position: u8
    );
    fn distribute_prizes(ref self: TState, tournament_id: u64, prize_keys: Array<u64>);
    fn override_safe_mode(ref self: TState);
}

///
/// Tournament Component
///

#[starknet::component]
pub mod tournament_component {
    use super::ITournament;

    use core::num::traits::Zero;

    use ls_tournaments_v0::ls15_components::constants::{
        VRF_COST_PER_GAME, MIN_REGISTRATION_PERIOD, MAX_REGISTRATION_PERIOD, MIN_TOURNAMENT_LENGTH,
        MAX_TOURNAMENT_LENGTH, MIN_SUBMISSION_PERIOD, MAX_SUBMISSION_PERIOD,
        TEST_MIN_REGISTRATION_PERIOD, TEST_MIN_SUBMISSION_PERIOD, TEST_MIN_TOURNAMENT_LENGTH,
        GAME_EXPIRATION_PERIOD, ETHEREUM_ADDRESS, LORDS_ADDRESS, SURVIVORS_ADDRESS, BEASTS_ADDRESS,
        DARK_SHUFFLE_ADDRESS, ETH_SAFE_AMOUNT, LORDS_SAFE_AMOUNT, DEFAULT_NS, TWO_POW_128
    };
    use ls_tournaments_v0::ls15_components::interfaces::{
        ILootSurvivorDispatcher, ILootSurvivorDispatcherTrait, IPragmaABIDispatcher,
        IPragmaABIDispatcherTrait, DataType
    };
    use ls_tournaments_v0::ls15_components::models::tournament::{
        Tournament as TournamentModel, TournamentGame, TournamentEntryAddresses,
        TournamentEntriesAddress, TournamentEntries, TournamentStartsAddress, TournamentScores,
        TournamentTotals, TournamentPrize, Token, TournamentConfig, TokenDataType, EntryStatus,
        GatedType, GatedSubmissionType, GatedEntryType, GatedToken, Premium, ERC20Data, ERC721Data,
        FreeGameTokenType
    };
    use ls_tournaments_v0::ls15_components::interfaces::{WorldTrait, WorldImpl,};
    use ls_tournaments_v0::ls15_components::libs::store::{Store, StoreTrait};
    use ls_tournaments_v0::ls15_components::libs::utils::{pow};

    use dojo::contract::components::world_provider::{IWorldProvider};


    use starknet::{
        ContractAddress, get_block_timestamp, get_contract_address, get_caller_address,
        contract_address_const
    };

    use openzeppelin_token::erc20::interface::{
        IERC20Dispatcher, IERC20DispatcherTrait, IERC20MetadataDispatcher,
        IERC20MetadataDispatcherTrait
    };
    use openzeppelin_token::erc721::interface::{
        IERC721Dispatcher, IERC721DispatcherTrait, IERC721MetadataDispatcher,
        IERC721MetadataDispatcherTrait
    };

    #[storage]
    pub struct Storage {}

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {}

    mod Errors {
        //
        // Create Tournament
        //
        pub const START_TIME_NOT_IN_FUTURE: felt252 = 'start time not in future';
        pub const REGISTRATION_PERIOD_TOO_SHORT: felt252 = 'registration period too short';
        pub const REGISTRATION_PERIOD_TOO_LONG: felt252 = 'registration period too long';
        pub const REGISTRATION_START_TOO_LATE: felt252 = 'registration start too late';
        pub const REGISTRATION_END_TOO_LATE: felt252 = 'registration end too late';
        pub const TOURNAMENT_TOO_SHORT: felt252 = 'tournament too short';
        pub const TOURNAMENT_TOO_LONG: felt252 = 'tournament too long';
        pub const ZERO_WINNERS_COUNT: felt252 = 'zero winners count';
        pub const NO_QUALIFYING_NFT: felt252 = 'no qualifying nft';
        pub const GATED_TOKEN_NOT_REGISTERED: felt252 = 'gated token not registered';
        pub const PREMIUM_TOKEN_NOT_REGISTERED: felt252 = 'premium token not registered';
        pub const PREMIUM_DISTRIBUTIONS_TOO_LONG: felt252 = 'premium distributions too long';
        pub const PREMIUM_DISTRIBUTIONS_NOT_100: felt252 = 'premium distributions not 100%';
        pub const SUBMISSION_PERIOD_TOO_SHORT: felt252 = 'submission period too short';
        pub const SUBMISSION_PERIOD_TOO_LONG: felt252 = 'submission period too long';
        pub const NOT_TOKEN_OWNER: felt252 = 'not token owner';
        //
        // Register Tokens
        //
        pub const TOKEN_ALREADY_REGISTERED: felt252 = 'token already registered';
        pub const INVALID_TOKEN_ALLOWANCES: felt252 = 'invalid token allowances';
        pub const INVALID_TOKEN_BALANCES: felt252 = 'invalid token balances';
        pub const TOKEN_SUPPLY_TOO_LARGE: felt252 = 'token supply too large';
        pub const INVALID_TOKEN_APPROVALS: felt252 = 'invalid token approvals';
        pub const INVALID_TOKEN_OWNER: felt252 = 'invalid token owner';
        pub const CANNOT_REGISTER_IN_SAFE_MODE: felt252 = 'cannot register in safe mode';
        pub const INVALID_TOKEN_FOR_SAFE_MODE: felt252 = 'invalid token for safe mode';
        //
        // Enter Tournament
        //
        pub const NOT_WITHIN_REGISTRATION_PERIOD: felt252 = 'not within registration period';
        pub const TOURNAMENT_ALREADY_STARTED: felt252 = 'tournament already started';
        pub const TOURNAMENT_NOT_STARTED: felt252 = 'tournament not started';
        pub const INVALID_GATED_SUBMISSION_TYPE: felt252 = 'invalid gated submission type';
        pub const INVALID_SUBMITTED_GAMES_LENGTH: felt252 = 'invalid submitted games length';
        pub const NOT_OWNER_OF_SUBMITTED_GAME_ID: felt252 = 'not owner of submitted game';
        pub const SUBMITTED_GAME_NOT_TOP_SCORE: felt252 = 'submitted game not top score';
        pub const CALLER_DOES_NOT_QUALIFY: felt252 = 'caller does not qualify';
        //
        // Start Tournament
        //
        pub const TOURNAMENT_NOT_ACTIVE: felt252 = 'tournament not active';
        pub const FETCHING_ETH_PRICE_ERROR: felt252 = 'error fetching eth price';
        pub const ALL_ENTRIES_STARTED: felt252 = 'all entries started';
        pub const ADDRESS_ENTRIES_STARTED: felt252 = 'address entries started';
        pub const START_COUNT_TOO_LARGE: felt252 = 'start count too large';
        pub const TOURNAMENT_PERIOD_TOO_LONG: felt252 = 'period too long to start all';
        pub const FREE_GAME_NOT_AVAILABLE: felt252 = 'free game not available';
        pub const TOO_MANY_FREE_GAMES: felt252 = 'too many free games';
        //
        // Submit Scores
        //
        pub const TOURNAMENT_NOT_ENDED: felt252 = 'tournament not ended';
        pub const TOURNAMENT_ALREADY_SETTLED: felt252 = 'tournament already settled';
        pub const NOT_GAME_OWNER: felt252 = 'not game owner';
        pub const GAME_NOT_STARTED: felt252 = 'game not started';
        pub const INVALID_SCORES_SUBMISSION: felt252 = 'invalid scores submission';
        pub const INVALID_SCORE: felt252 = 'invalid score';
        //
        // Add Prize
        //
        pub const TOURNAMENT_ENDED: felt252 = 'tournament ended';
        pub const PRIZE_POSITION_TOO_LARGE: felt252 = 'prize position too large';
        pub const PRIZE_TOKEN_NOT_REGISTERED: felt252 = 'prize token not registered';
        pub const INVALID_SAFE_TOKEN_AMOUNT: felt252 = 'invalid safe token amount';
        //
        // Distribute Prizes
        //
        pub const TOURNAMENT_NOT_SETTLED: felt252 = 'tournament not settled';
        pub const DISTRIBUTE_ALREADY_CALLED: felt252 = 'distribute already called';
        pub const NO_PRIZE_KEYS: felt252 = 'no prize keys provided';
        pub const PRIZE_DOES_NOT_EXIST: felt252 = 'prize does not exist';
        pub const PRIZE_ALREADY_CLAIMED: felt252 = 'prize already claimed';
    }

    #[embeddable_as(TournamentImpl)]
    impl Tournament<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +Drop<TContractState>
    > of ITournament<ComponentState<TContractState>> {
        fn total_tournaments(self: @ComponentState<TContractState>) -> u64 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_tournament_totals(get_contract_address()).total_tournaments
        }
        fn tournament(
            self: @ComponentState<TContractState>, tournament_id: u64
        ) -> TournamentModel {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_tournament(tournament_id)
        }
        fn tournament_entries(self: @ComponentState<TContractState>, tournament_id: u64) -> u64 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_total_entries(tournament_id).entry_count
        }

        fn top_scores(self: @ComponentState<TContractState>, tournament_id: u64) -> Array<u64> {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_tournament_scores(tournament_id).top_score_ids
        }

        fn is_token_registered(
            self: @ComponentState<TContractState>, token: ContractAddress
        ) -> bool {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            self._is_token_registered(store, token)
        }

        // TODO: add for V2 (use Ekubo tokens)
        fn register_token(
            ref self: ComponentState<TContractState>,
            token: ContractAddress,
            token_data_type: TokenDataType
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            self._register_token(ref store, token, token_data_type);
        }

        /// @title Create tournament
        /// @notice Allows a player to create a tournament.
        /// @dev Registration times provide capability of seasons (overlaps of entry periods and
        /// start periods).
        /// @param self A reference to the ContractState object.
        /// @param name A felt252 representing the name of the tournament.
        /// @param description A ByteArray representing the description of the tournament.
        /// @param registration_start_time A u64 representing the start time of the registration
        /// period.
        /// @param registration_end_time A u64 representing the end time of the registration period.
        /// @param start_time A u64 representing the start time of the tournament.
        /// @param end_time A u64 representing the end time of the tournament.
        /// @param submission_period A u64 representing the length of the submission period.
        /// @param winners_count A u8 representing the number of winners.
        /// @param gated_type A Option<GatedType> representing the gated type of the tournament.
        /// @param entry_premium A Option<Premium> representing the entry premium of the tournament.
        fn create_tournament(
            ref self: ComponentState<TContractState>,
            name: felt252,
            description: ByteArray,
            registration_start_time: u64,
            registration_end_time: u64,
            start_time: u64,
            end_time: u64,
            submission_period: u64,
            winners_count: u8,
            gated_type: Option<GatedType>,
            entry_premium: Option<Premium>,
        ) -> u64 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);

            self._assert_future_start_time(registration_start_time, start_time);
            self
                ._assert_bigger_than_min_registration_period(
                    store, registration_start_time, registration_end_time
                );
            self
                ._assert_less_than_max_registration_period(
                    registration_start_time, registration_end_time
                );
            self
                ._assert_registration_start_not_after_tournament_start(
                    registration_start_time, start_time
                );
            self._assert_registration_end_not_after_tournament_end(registration_end_time, end_time);
            self._assert_tournament_length_not_too_short(store, end_time, start_time);
            self._assert_tournament_length_not_too_long(end_time, start_time);
            self._assert_submission_period_larger_than_minimum(store, submission_period);
            self._assert_submission_period_less_than_maximum(submission_period);
            self._assert_winners_count_greater_than_zero(winners_count);
            self._assert_gated_type_validates(store, gated_type);
            self
                ._assert_premium_token_registered_and_distribution_valid(
                    store, entry_premium.clone(), winners_count
                );

            // create a new tournament
            self
                ._create_tournament(
                    ref store,
                    name,
                    description,
                    get_caller_address(),
                    registration_start_time,
                    registration_end_time,
                    start_time,
                    end_time,
                    submission_period,
                    winners_count,
                    gated_type,
                    entry_premium,
                )
        }

        /// @title Enter tournament
        /// @notice Allows a player to enter a tournament for a particular tournament id.
        /// @dev Requires a tournament to have already been created.
        /// @param self A reference to the ContractState object.
        /// @param tournament_id A u64 representing the unique ID of the tournament.
        /// @param gated_submission_type A Option<GatedSubmissionType> representing the gated
        /// submission type of the tournament.
        fn enter_tournament(
            ref self: ComponentState<TContractState>,
            tournament_id: u64,
            gated_submission_type: Option<GatedSubmissionType>,
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            let tournament = store.get_tournament(tournament_id);
            // assert tournament has not started
            self
                ._assert_within_registration_period(
                    tournament.registration_start_time, tournament.registration_end_time
                );

            let mut entries: u64 = 1;

            // if tournament is gated then assert the submission type qualifies
            // also add mutate the entries based on criteria
            match tournament.gated_type {
                Option::Some(gated_type) => {
                    self
                        ._get_gated_entries(
                            store,
                            gated_type,
                            gated_submission_type,
                            get_caller_address(),
                            ref entries
                        );
                },
                Option::None => {},
            };

            // if tournament has a premium then transfer it
            match tournament.entry_premium {
                Option::Some(premium) => {
                    let premium_dispatcher = IERC20Dispatcher { contract_address: premium.token };
                    premium_dispatcher
                        .transfer_from(
                            get_caller_address(),
                            get_contract_address(),
                            entries.into() * premium.token_amount.into()
                        );
                },
                Option::None => {},
            };
            let address_entries = store.get_address_entries(tournament_id, get_caller_address());
            // if caller not currently stored append their address
            if (address_entries.entry_count == 0) {
                self.append_tournament_address_list(ref store, tournament_id, get_caller_address());
            }
            // increment both entries by address and total entries
            self.increment_entries(ref store, tournament_id, entries);
        }

        /// @title Start tournament
        /// @notice Allows a player to start a tournament for a particular tournament id.
        /// @dev Requires the player starting to have already entered.
        /// @param self A reference to the ContractState object.
        /// @param tournament_id A u64 representing the unique ID of the tournament.
        /// @param start_all A bool representing whether to start everyones games.
        /// @param start_count A u64 representing the number of games to start.
        /// @param client_reward_address A contract address representing the address to send client
        /// rewards.
        /// @param golden_token_free_game_token_ids A span of u256 representing the token ids for
        /// golden tokens.
        /// @param blobert_free_game_token_ids A span of u256 representing the token ids for blobert
        /// tokens.
        /// @param weapon A u8 representing the weapon to start the game with.
        /// @param name A felt252 representing the name of the adventurer.
        fn start_tournament(
            ref self: ComponentState<TContractState>,
            tournament_id: u64,
            start_all: bool,
            start_count: Option<u64>,
            client_reward_address: ContractAddress,
            golden_token_free_game_token_ids: Span<u256>,
            blobert_free_game_token_ids: Span<u256>,
            weapon: u8,
            name: felt252,
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);

            self._assert_tournament_active(store, tournament_id);
            self
                ._assert_free_game_ids_not_larger_than_start_count(
                    start_count, golden_token_free_game_token_ids, blobert_free_game_token_ids
                );

            if (start_all) {
                self._assert_tournament_period_within_max(store, tournament_id);
            }

            // TODO: store the dispatchers
            let mut tournament_config = store.get_tournament_config(get_contract_address());
            let mut ls_dispatcher = ILootSurvivorDispatcher {
                contract_address: tournament_config.loot_survivor
            };

            // first get the number of entries for calculations and allowed starts
            let mut entries = 0;
            if start_all {
                // if starting all games, assert there are entries that haven't started
                // get the total number of entries to mint
                let addresses = store.get_tournament_entry_addresses(tournament_id).addresses;
                let total_entries = self._calculate_total_entries(store, tournament_id, addresses);
                match start_count {
                    Option::Some(start_count) => {
                        assert(total_entries >= start_count, Errors::START_COUNT_TOO_LARGE);
                        entries = start_count;
                    },
                    Option::None => {
                        assert(total_entries > 0, Errors::ALL_ENTRIES_STARTED);
                        entries = total_entries;
                    },
                };
            } else {
                let address_entries = store
                    .get_address_entries(tournament_id, get_caller_address())
                    .entry_count;
                let address_starts = store
                    .get_tournament_starts(tournament_id, get_caller_address())
                    .start_count;
                assert(address_entries > address_starts, Errors::ALL_ENTRIES_STARTED);
                let remaining_entries = address_entries - address_starts;
                match start_count {
                    Option::Some(start_count) => {
                        assert(remaining_entries >= start_count, Errors::START_COUNT_TOO_LARGE);
                        entries = start_count;
                    },
                    Option::None => {
                        assert(remaining_entries > 0, Errors::ADDRESS_ENTRIES_STARTED);
                        entries = remaining_entries;
                    },
                };
            }

            self
                ._assert_free_game_ids_not_larger_than_entries(
                    entries, golden_token_free_game_token_ids, blobert_free_game_token_ids
                );

            let free_games = self
                ._flash_loan_free_game_tokens(
                    tournament_config,
                    ls_dispatcher,
                    golden_token_free_game_token_ids,
                    blobert_free_game_token_ids
                );

            let paid_starts = entries - free_games.into();

            // define contract interfaces
            let lords_dispatcher: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: tournament_config.lords
            };
            let eth_dispatcher: IERC20Dispatcher = IERC20Dispatcher {
                contract_address: tournament_config.eth
            };

            // get current game cost
            let cost_to_play = ls_dispatcher.get_cost_to_play();
            let entries_cost = paid_starts.into() * cost_to_play.into();

            // check we actually need to pay for a game
            if (paid_starts > 0) {
                lords_dispatcher
                    .transfer_from(get_caller_address(), get_contract_address(), entries_cost);
                lords_dispatcher.approve(tournament_config.loot_survivor, entries_cost);
            }

            // transfer VRF cost (still need vrf cost for free games)
            let vrf_cost = self
                ._convert_usd_to_wei(tournament_config, entries.into() * VRF_COST_PER_GAME.into());
            eth_dispatcher
                .transfer_from(get_caller_address(), get_contract_address(), vrf_cost.into());

            eth_dispatcher.approve(tournament_config.loot_survivor, vrf_cost.into());

            let mut golden_token_index = 0;
            let mut blobert_token_index = 0;

            if start_all {
                // if start all then we need to loop through stored addresses and mint games
                // for each
                let mut addresses = store.get_tournament_entry_addresses(tournament_id).addresses;
                let mut total_start_index = 0;
                loop {
                    if (total_start_index == entries) {
                        break;
                    }
                    let result = addresses.pop_front();
                    match result {
                        Option::Some(address) => {
                            self
                                ._start_game(
                                    ref store,
                                    tournament_id,
                                    ref total_start_index,
                                    entries,
                                    address,
                                    ref golden_token_index,
                                    ref blobert_token_index,
                                    golden_token_free_game_token_ids,
                                    blobert_free_game_token_ids,
                                    ls_dispatcher,
                                    client_reward_address,
                                    weapon,
                                    name,
                                );
                        },
                        Option::None => { break; },
                    };
                };
                // set stored addresses to empty
                let addresses_model = TournamentEntryAddresses { tournament_id, addresses };
                store.set_tournament_entry_addresses(@addresses_model);
            } else {
                let mut total_start_index = 0;
                self
                    ._start_game(
                        ref store,
                        tournament_id,
                        ref total_start_index,
                        entries,
                        get_caller_address(),
                        ref golden_token_index,
                        ref blobert_token_index,
                        golden_token_free_game_token_ids,
                        blobert_free_game_token_ids,
                        ls_dispatcher,
                        client_reward_address,
                        weapon,
                        name,
                    );
            }

            self
                ._return_free_game_tokens(
                    ref tournament_config,
                    golden_token_free_game_token_ids,
                    blobert_free_game_token_ids
                );
        }

        /// @title Submit scores
        /// @notice Allows anyone to submit scores for a tournament for a particular tournament id.
        /// @dev For more efficient gas we assume that the game ids are in order of highest score
        /// @param self A reference to the ContractState object.
        /// @param tournament_id A u64 representing the unique ID of the tournament.
        /// @param game_ids A span of felt252 representing the game ids to submit.
        fn submit_scores(
            ref self: ComponentState<TContractState>, tournament_id: u64, game_ids: Array<felt252>
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            let mut tournament = store.get_tournament(tournament_id);

            self._assert_tournament_ended(ref tournament);

            self._assert_scores_count_valid(ref tournament, game_ids.len());

            self._assert_tournament_not_settled(ref tournament);

            let total_entries = store.get_total_entries(tournament_id);

            // handle formatiing of premium config into prize keys
            if (!total_entries.premiums_formatted) {
                self._format_premium_config_into_prize_keys(ref store, tournament_id);
            }

            let tournament_config = store.get_tournament_config(get_contract_address());
            let mut ls_dispatcher = ILootSurvivorDispatcher {
                contract_address: tournament_config.loot_survivor
            };

            // loop through game ids and update scores
            let mut num_games = game_ids.len();
            let mut game_index = 0;
            let mut new_score_ids = ArrayTrait::<u64>::new();
            loop {
                if game_index == num_games {
                    break;
                }
                let game_id = *game_ids.at(game_index);
                self._assert_game_started_or_submitted(store, tournament_id, game_id);

                let adventurer = ls_dispatcher.get_adventurer(game_id.try_into().unwrap());

                self
                    ._update_tournament_scores(
                        store, tournament_id, game_id, adventurer.xp, ref new_score_ids, game_index
                    );

                self.set_submitted_score(ref store, tournament_id, game_id, adventurer.xp);
                game_index += 1;
            };
            store
                .set_tournament_scores(
                    @TournamentScores { tournament_id, top_score_ids: new_score_ids }
                );
        }

        /// @title Add prize
        /// @notice Allows anyone to add a prize for a tournament for a particular tournament id.
        /// @param self A reference to the ContractState object.
        /// @param tournament_id A u64 representing the unique ID of the tournament.
        /// @param token A contract address representing the token to add as a prize.
        /// @param token_data_type A TokenDataType representing the type of token to add as a prize.
        /// @param position A u8 representing the scoreboard position to distribute the prize to.
        fn add_prize(
            ref self: ComponentState<TContractState>,
            tournament_id: u64,
            token: ContractAddress,
            token_data_type: TokenDataType,
            position: u8
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            let mut tournament = store.get_tournament(tournament_id);

            self._assert_tournament_not_ended(ref tournament);

            self._deposit_prize(ref store, tournament_id, token, token_data_type, position);
        }

        /// @title Distribute prizes
        /// @notice Allows anyone to distribute prizes for a tournament for a particular tournament
        /// id.
        /// @param self A reference to the ContractState object.
        /// @param tournament_id A u64 representing the unique ID of the tournament.
        /// @param prize_keys An array of u64 representing the prize keys to distribute.
        fn distribute_prizes(
            ref self: ComponentState<TContractState>, tournament_id: u64, prize_keys: Array<u64>,
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            // assert tournament settled
            self._assert_tournament_settled(store, tournament_id);
            self._assert_prize_keys_not_empty(prize_keys.span());

            let mut total_entries = store.get_total_entries(tournament_id);

            // if noone has submitted scores for the tournament already, then we need to create the
            // prize keys
            if (!total_entries.premiums_formatted) {
                self._format_premium_config_into_prize_keys(ref store, tournament_id);
            }

            let top_score_ids = store.get_tournament_scores(tournament_id).top_score_ids;
            // check if top scores empty then refund prizes and premiums
            // else, distribute to top scores
            if top_score_ids.len() == 0 {
                self._assert_distribute_has_not_been_called(ref total_entries);
                self
                    ._distribute_prizes_to_address(
                        ref store, tournament_id, prize_keys, get_caller_address()
                    );
                self.set_tournament_distribute_called(ref store, ref total_entries);
            } else {
                self
                    ._distribute_prizes_to_top_scores(
                        ref store, tournament_id, prize_keys, top_score_ids.span()
                    );
            };
        }

        fn override_safe_mode(ref self: ComponentState<TContractState>) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);

            let mut tournament_config = store.get_tournament_config(get_contract_address());

            tournament_config.safe_mode = false;

            store.set_tournament_config(@tournament_config);
        }
    }


    #[generate_trait]
    pub impl InternalImpl<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +Drop<TContractState>
    > of InternalTrait<TContractState> {
        //
        // INITIALIZE COMPONENT
        //

        /// @title Initialize tournament
        /// @notice Initializes the tournament component for storing its config.
        /// @param self A copy to the ContractState object.
        /// @param eth A contract address representing the ETH token.
        /// @param lords A contract address representing the LORDS token.
        /// @param loot_survivor A contract address representing the LOOT SURVIVOR contract.
        /// @param oracle A contract address representing the oracle contract.
        /// @param golden_token A contract address representing the GOLDEN token.
        /// @param blobert A contract address representing the BLOBERT token.
        /// @param safe_mode A bool representing whether to use safe mode.
        /// @param test_mode A bool representing whether to use test mode.
        fn initialize(
            self: @ComponentState<TContractState>,
            eth: ContractAddress,
            lords: ContractAddress,
            loot_survivor: ContractAddress,
            oracle: ContractAddress,
            golden_token: ContractAddress,
            blobert: ContractAddress,
            safe_mode: bool,
            test_mode: bool
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            // Store the config
            store
                .set_tournament_config(
                    @TournamentConfig {
                        contract: get_contract_address(),
                        eth,
                        lords,
                        loot_survivor,
                        oracle,
                        golden_token,
                        blobert,
                        safe_mode,
                        test_mode,
                    }
                );
        }

        //
        // INITIALIZE TOKENS
        //

        /// @title Initialize erc20
        /// @notice Initializes an erc20 token for registration.
        /// @param self A copy to the ContractState object.
        /// @param token A contract address representing the token.
        /// @param name A byte array representing the name of the token.
        /// @param symbol A byte array representing the symbol of the token.
        fn initialize_erc20(
            self: @ComponentState<TContractState>,
            token: ContractAddress,
            name: ByteArray,
            symbol: ByteArray,
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            assert(!self._is_token_registered(store, token), Errors::TOKEN_ALREADY_REGISTERED);
            store
                .set_token(
                    @Token {
                        token: token,
                        name: name,
                        symbol: symbol,
                        token_data_type: TokenDataType::erc20(ERC20Data { token_amount: 1 }),
                        is_registered: true
                    }
                );
        }

        /// @title Initialize erc721
        /// @notice Initializes an erc721 token for registration.
        /// @param self A copy to the ContractState object.
        /// @param token A contract address representing the token.
        /// @param name A byte array representing the name of the token.
        /// @param symbol A byte array representing the symbol of the token.
        fn initialize_erc721(
            self: @ComponentState<TContractState>,
            token: ContractAddress,
            name: ByteArray,
            symbol: ByteArray
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            assert(!self._is_token_registered(store, token), Errors::TOKEN_ALREADY_REGISTERED);
            store
                .set_token(
                    @Token {
                        token: token,
                        name: name,
                        symbol: symbol,
                        token_data_type: TokenDataType::erc721(ERC721Data { token_id: 1 }),
                        is_registered: true
                    }
                );
        }

        //
        // GETTERS
        //

        fn get_score_from_id(
            self: @ComponentState<TContractState>, store: Store, game_id: felt252
        ) -> u16 {
            let tournament_config = store.get_tournament_config(get_contract_address());
            let ls_dispatcher = ILootSurvivorDispatcher {
                contract_address: tournament_config.loot_survivor
            };
            ls_dispatcher.get_adventurer(game_id).xp
        }

        fn _get_owner(
            self: @ComponentState<TContractState>, token: ContractAddress, token_id: u256
        ) -> ContractAddress {
            IERC721Dispatcher { contract_address: token }.owner_of(token_id)
        }

        fn _is_tournament_active(
            self: @ComponentState<TContractState>, store: Store, tournament_id: u64
        ) -> bool {
            let tournament = store.get_tournament(tournament_id);
            tournament.start_time <= get_block_timestamp()
                && tournament.end_time > get_block_timestamp()
        }

        fn _is_top_score(
            self: @ComponentState<TContractState>, store: Store, tournament_id: u64, score: u16
        ) -> bool {
            let top_score_ids = self.top_scores(tournament_id);
            let num_scores = top_score_ids.len();
            if num_scores == 0 {
                true
            } else {
                let last_place_id = *top_score_ids.at(num_scores - 1);
                let last_place_score = self
                    .get_score_from_id(store, last_place_id.try_into().unwrap());
                score >= last_place_score
            }
        }

        fn _is_token_registered(
            self: @ComponentState<TContractState>, store: Store, token: ContractAddress
        ) -> bool {
            store.get_token(token).is_registered
        }

        //
        // SETTERS
        //

        fn increment_entries(
            self: @ComponentState<TContractState>,
            ref store: Store,
            tournament_id: u64,
            entries: u64
        ) {
            let address_entries = store.get_address_entries(tournament_id, get_caller_address());
            store
                .set_address_entries(
                    @TournamentEntriesAddress {
                        tournament_id,
                        address: get_caller_address(),
                        entry_count: address_entries.entry_count + entries
                    }
                );
            let total_entries = store.get_total_entries(tournament_id);
            store
                .set_total_entries(
                    @TournamentEntries {
                        tournament_id,
                        entry_count: total_entries.entry_count + entries,
                        distribute_called: total_entries.distribute_called,
                        premiums_formatted: total_entries.premiums_formatted
                    }
                );
        }

        fn append_tournament_address_list(
            self: @ComponentState<TContractState>,
            ref store: Store,
            tournament_id: u64,
            address: ContractAddress
        ) {
            let mut tournament_addresses = store
                .get_tournament_entry_addresses(tournament_id)
                .addresses;
            tournament_addresses.append(address);
            store
                .set_tournament_entry_addresses(
                    @TournamentEntryAddresses { tournament_id, addresses: tournament_addresses }
                );
        }

        fn set_submitted_score(
            ref self: ComponentState<TContractState>,
            ref store: Store,
            tournament_id: u64,
            game_id: felt252,
            score: u16
        ) {
            let entry = store.get_tournament_game(tournament_id, game_id);
            store
                .set_tournament_game(
                    @TournamentGame {
                        tournament_id,
                        game_id: game_id.try_into().unwrap(),
                        address: entry.address,
                        status: EntryStatus::Submitted
                    }
                );
        }

        fn set_tournament_distribute_called(
            self: @ComponentState<TContractState>,
            ref store: Store,
            ref total_entries: TournamentEntries
        ) {
            total_entries.distribute_called = true;
            store.set_total_entries(@total_entries);
        }

        //
        // ASSERTIONS
        //

        fn _assert_future_start_time(
            self: @ComponentState<TContractState>, registration_start_time: u64, start_time: u64
        ) {
            assert(
                registration_start_time >= get_block_timestamp(), Errors::START_TIME_NOT_IN_FUTURE
            );
            assert(start_time >= get_block_timestamp(), Errors::START_TIME_NOT_IN_FUTURE);
        }

        fn _assert_bigger_than_min_registration_period(
            self: @ComponentState<TContractState>,
            store: Store,
            registration_start_time: u64,
            registration_end_time: u64
        ) {
            let test_mode = store.get_tournament_config(get_contract_address()).test_mode;
            let min_registration_period = if test_mode {
                TEST_MIN_REGISTRATION_PERIOD
            } else {
                MIN_REGISTRATION_PERIOD
            };
            assert(
                registration_end_time - registration_start_time >= min_registration_period.into(),
                Errors::REGISTRATION_PERIOD_TOO_SHORT
            );
        }

        fn _assert_less_than_max_registration_period(
            self: @ComponentState<TContractState>,
            registration_start_time: u64,
            registration_end_time: u64
        ) {
            assert(
                registration_end_time - registration_start_time < MAX_REGISTRATION_PERIOD.into(),
                Errors::REGISTRATION_PERIOD_TOO_LONG
            );
        }

        fn _assert_registration_start_not_after_tournament_start(
            self: @ComponentState<TContractState>,
            registration_start_time: u64,
            tournament_start_time: u64
        ) {
            assert(
                registration_start_time <= tournament_start_time,
                Errors::REGISTRATION_START_TOO_LATE
            );
        }

        fn _assert_registration_end_not_after_tournament_end(
            self: @ComponentState<TContractState>,
            registration_end_time: u64,
            tournament_end_time: u64
        ) {
            assert(registration_end_time <= tournament_end_time, Errors::REGISTRATION_END_TOO_LATE);
        }

        fn _assert_tournament_length_not_too_short(
            self: @ComponentState<TContractState>, store: Store, end_time: u64, start_time: u64
        ) {
            let test_mode = store.get_tournament_config(get_contract_address()).test_mode;
            let min_tournament_length = if test_mode {
                TEST_MIN_TOURNAMENT_LENGTH
            } else {
                MIN_TOURNAMENT_LENGTH
            };
            assert(
                end_time - start_time >= min_tournament_length.into(), Errors::TOURNAMENT_TOO_SHORT
            );
        }

        fn _assert_tournament_length_not_too_long(
            self: @ComponentState<TContractState>, end_time: u64, start_time: u64
        ) {
            assert(
                end_time - start_time <= MAX_TOURNAMENT_LENGTH.into(), Errors::TOURNAMENT_TOO_LONG
            );
        }

        fn _assert_submission_period_larger_than_minimum(
            self: @ComponentState<TContractState>, store: Store, submission_period: u64
        ) {
            let test_mode = store.get_tournament_config(get_contract_address()).test_mode;
            let min_submission_period = if test_mode {
                TEST_MIN_SUBMISSION_PERIOD
            } else {
                MIN_SUBMISSION_PERIOD
            };
            assert(
                submission_period >= min_submission_period.into(),
                Errors::SUBMISSION_PERIOD_TOO_SHORT
            );
        }

        fn _assert_submission_period_less_than_maximum(
            self: @ComponentState<TContractState>, submission_period: u64
        ) {
            assert(
                submission_period <= MAX_SUBMISSION_PERIOD.into(),
                Errors::SUBMISSION_PERIOD_TOO_LONG
            );
        }

        fn _assert_winners_count_greater_than_zero(
            self: @ComponentState<TContractState>, winners_count: u8
        ) {
            assert(winners_count > 0, Errors::ZERO_WINNERS_COUNT);
        }

        fn _assert_premium_token_registered_and_distribution_valid(
            self: @ComponentState<TContractState>,
            store: Store,
            premium: Option<Premium>,
            winners_count: u8
        ) {
            match premium {
                Option::Some(token) => {
                    self._assert_premium_token_registered(store, token.token);
                    self
                        ._assert_premium_token_distribution_length_not_too_long(
                            token.token_distribution.len(), winners_count.into()
                        );
                    // check the sum of distributions is equal to 100%
                    let mut distribution_sum: u8 = 0;
                    let mut distribution_index: u32 = 0;
                    loop {
                        if distribution_index == token.token_distribution.len() {
                            break;
                        }
                        let distribution = *token.token_distribution.at(distribution_index);
                        distribution_sum += distribution;
                        distribution_index += 1;
                    };
                    self._assert_premium_token_distribution_sum_is_100(distribution_sum);

                    let safe_mode = store.get_tournament_config(get_contract_address()).safe_mode;
                    if (safe_mode) {
                        if (token.token == ETHEREUM_ADDRESS()) {
                            assert(
                                token.token_amount <= ETH_SAFE_AMOUNT,
                                Errors::INVALID_SAFE_TOKEN_AMOUNT
                            );
                        } else {
                            assert(
                                token.token_amount <= LORDS_SAFE_AMOUNT,
                                Errors::INVALID_SAFE_TOKEN_AMOUNT
                            );
                        }
                    }
                },
                Option::None => {},
            }
        }

        fn _assert_premium_token_registered(
            self: @ComponentState<TContractState>, store: Store, token: ContractAddress
        ) {
            assert(self._is_token_registered(store, token), Errors::PREMIUM_TOKEN_NOT_REGISTERED);
        }

        fn _assert_premium_token_distribution_length_not_too_long(
            self: @ComponentState<TContractState>, distribution_length: u32, winners_count: u32
        ) {
            assert(distribution_length <= winners_count, Errors::PREMIUM_DISTRIBUTIONS_TOO_LONG);
        }

        fn _assert_premium_token_distribution_sum_is_100(
            self: @ComponentState<TContractState>, sum: u8
        ) {
            assert(sum == 100, Errors::PREMIUM_DISTRIBUTIONS_NOT_100);
        }

        fn _assert_prize_token_registered(
            self: @ComponentState<TContractState>, store: Store, token: ContractAddress
        ) {
            assert(self._is_token_registered(store, token), Errors::PRIZE_TOKEN_NOT_REGISTERED);
        }

        fn _assert_within_registration_period(
            self: @ComponentState<TContractState>,
            registration_start_time: u64,
            registration_end_time: u64
        ) {
            assert(
                registration_start_time <= get_block_timestamp()
                    && registration_end_time >= get_block_timestamp(),
                Errors::NOT_WITHIN_REGISTRATION_PERIOD
            );
        }

        fn _assert_game_started_or_submitted(
            self: @ComponentState<TContractState>,
            store: Store,
            tournament_id: u64,
            game_id: felt252
        ) {
            let entry = store.get_tournament_game(tournament_id, game_id);
            assert(
                entry.status == EntryStatus::Started || entry.status == EntryStatus::Submitted,
                Errors::GAME_NOT_STARTED
            );
        }

        fn _assert_tournament_active(
            self: @ComponentState<TContractState>, store: Store, tournament_id: u64
        ) {
            let is_active = self._is_tournament_active(store, tournament_id);
            assert(is_active, Errors::TOURNAMENT_NOT_ACTIVE);
        }

        fn _assert_tournament_ended(
            self: @ComponentState<TContractState>, ref tournament: TournamentModel
        ) {
            assert(tournament.end_time <= get_block_timestamp(), Errors::TOURNAMENT_NOT_ENDED);
        }

        fn _assert_tournament_not_ended(
            self: @ComponentState<TContractState>, ref tournament: TournamentModel
        ) {
            assert(tournament.end_time > get_block_timestamp(), Errors::TOURNAMENT_ENDED);
        }

        fn _assert_tournament_period_within_max(
            self: @ComponentState<TContractState>, store: Store, tournament_id: u64
        ) {
            let tournament = store.get_tournament(tournament_id);
            assert(
                tournament.end_time - tournament.start_time < GAME_EXPIRATION_PERIOD.into(),
                Errors::TOURNAMENT_PERIOD_TOO_LONG
            );
        }

        fn _assert_free_game_ids_not_larger_than_start_count(
            self: @ComponentState<TContractState>,
            start_count: Option<u64>,
            golden_token_free_game_token_ids: Span<u256>,
            blobert_free_game_token_ids: Span<u256>
        ) {
            match start_count {
                Option::Some(start_count) => {
                    assert(
                        golden_token_free_game_token_ids.len()
                            + blobert_free_game_token_ids.len() <= start_count.try_into().unwrap(),
                        Errors::TOO_MANY_FREE_GAMES
                    );
                },
                Option::None => {},
            }
        }

        fn _assert_free_game_ids_not_larger_than_entries(
            self: @ComponentState<TContractState>,
            entries: u64,
            golden_token_free_game_token_ids: Span<u256>,
            blobert_free_game_token_ids: Span<u256>
        ) {
            assert(
                golden_token_free_game_token_ids.len()
                    + blobert_free_game_token_ids.len() <= entries.try_into().unwrap(),
                Errors::TOO_MANY_FREE_GAMES
            );
        }

        fn _assert_scores_count_valid(
            self: @ComponentState<TContractState>,
            ref tournament: TournamentModel,
            scores_count: u32
        ) {
            assert(
                scores_count <= tournament.winners_count.into(), Errors::INVALID_SCORES_SUBMISSION
            );
        }

        fn _assert_prize_position_less_than_winners_count(
            self: @ComponentState<TContractState>, store: Store, tournament_id: u64, position: u8
        ) {
            let tournament = store.get_tournament(tournament_id);
            assert(position <= tournament.winners_count, Errors::PRIZE_POSITION_TOO_LARGE);
        }

        fn _assert_prize_exists(self: @ComponentState<TContractState>, token: ContractAddress) {
            assert(!token.is_zero(), Errors::PRIZE_DOES_NOT_EXIST);
        }

        fn _assert_prize_not_claimed(self: @ComponentState<TContractState>, claimed: bool) {
            assert(!claimed, Errors::PRIZE_ALREADY_CLAIMED);
        }

        fn _assert_token_owner(
            self: @ComponentState<TContractState>,
            token: ContractAddress,
            token_id: u256,
            account: ContractAddress
        ) {
            let owner = self._get_owner(token, token_id);
            assert(owner == account, Errors::NOT_TOKEN_OWNER);
        }

        fn _assert_gated_token_owner(
            self: @ComponentState<TContractState>,
            token: ContractAddress,
            token_id: u256,
            account: ContractAddress
        ) {
            let owner = self._get_owner(token, token_id);
            assert(owner == account, Errors::NO_QUALIFYING_NFT);
        }

        fn _assert_game_token_owner(
            self: @ComponentState<TContractState>, game_id: u256, account: ContractAddress
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            let tournament_config = store.get_tournament_config(get_contract_address());
            let owner = self._get_owner(tournament_config.loot_survivor, game_id);
            assert(owner == account, Errors::NOT_GAME_OWNER);
        }

        fn _assert_gated_type_validates(
            self: @ComponentState<TContractState>, store: Store, gated_type: Option<GatedType>
        ) {
            match gated_type {
                Option::Some(gated_type) => {
                    match gated_type {
                        GatedType::token(token) => {
                            let safe_mode = store
                                .get_tournament_config(get_contract_address())
                                .safe_mode;
                            if (safe_mode) {
                                assert(
                                    token.token == SURVIVORS_ADDRESS()
                                        || token.token == BEASTS_ADDRESS(),
                                    Errors::INVALID_TOKEN_FOR_SAFE_MODE
                                );
                            }
                            assert(
                                self._is_token_registered(store, token.token),
                                Errors::GATED_TOKEN_NOT_REGISTERED
                            )
                        },
                        GatedType::tournament(tournament_ids) => {
                            let mut loop_index = 0;
                            loop {
                                if loop_index == tournament_ids.len() {
                                    break;
                                }
                                self
                                    ._assert_tournament_settled(
                                        store, *tournament_ids.at(loop_index)
                                    );
                                loop_index += 1;
                            }
                        },
                        GatedType::address(_) => {},
                    }
                },
                Option::None => {},
            }
        }

        fn _assert_tournament_settled(
            self: @ComponentState<TContractState>, store: Store, tournament_id: u64
        ) {
            let tournament = store.get_tournament(tournament_id);
            assert(
                tournament.end_time + tournament.submission_period <= get_block_timestamp(),
                Errors::TOURNAMENT_NOT_SETTLED
            );
        }

        fn _assert_tournament_not_settled(
            self: @ComponentState<TContractState>, ref tournament: TournamentModel
        ) {
            assert(
                tournament.end_time + tournament.submission_period > get_block_timestamp(),
                Errors::TOURNAMENT_ALREADY_SETTLED
            );
        }

        fn _assert_distribute_has_not_been_called(
            self: @ComponentState<TContractState>, ref total_entries: TournamentEntries
        ) {
            assert(!total_entries.distribute_called, Errors::DISTRIBUTE_ALREADY_CALLED);
        }

        fn _assert_prize_keys_not_empty(
            self: @ComponentState<TContractState>, prize_keys: Span<u64>
        ) {
            assert(prize_keys.len() > 0, Errors::NO_PRIZE_KEYS);
        }

        fn _get_gated_entries(
            self: @ComponentState<TContractState>,
            store: Store,
            gated_type: GatedType,
            gated_submission_type: Option<GatedSubmissionType>,
            address: ContractAddress,
            ref entries: u64
        ) {
            match gated_type {
                GatedType::token(token) => {
                    // assert the caller has a qualifying nft
                    self
                        ._assert_has_qualifying_nft(
                            token, gated_submission_type, address, ref entries
                        );
                },
                GatedType::tournament(tournament_ids) => {
                    // assert the owner owns game ids and has a top score in tournaments
                    self
                        ._assert_has_qualified_in_tournaments(
                            store, tournament_ids, gated_submission_type, address
                        );
                },
                GatedType::address(qualifying_addresses) => {
                    self._assert_qualifying_address(address, qualifying_addresses);
                },
            }
        }

        fn _assert_has_qualifying_nft(
            self: @ComponentState<TContractState>,
            gated_token: GatedToken,
            gated_submission_type: Option<GatedSubmissionType>,
            address: ContractAddress,
            ref entries: u64
        ) {
            match gated_submission_type {
                Option::Some(submission) => {
                    match submission {
                        GatedSubmissionType::token_id(token_id) => {
                            self._assert_gated_token_owner(gated_token.token, token_id, address);
                            let entry_type = gated_token.entry_type;
                            match entry_type {
                                GatedEntryType::criteria(entry_criteria) => {
                                    let mut entry_count = 0;
                                    let num_criteria = entry_criteria.len();
                                    let mut criteria_index = 0;
                                    loop {
                                        if criteria_index == num_criteria {
                                            break;
                                        }
                                        let criteria = *entry_criteria.at(criteria_index);
                                        if criteria.token_id == token_id.low {
                                            entry_count += criteria.entry_count;
                                        }
                                        criteria_index += 1;
                                    };
                                    entries = entry_count;
                                },
                                GatedEntryType::uniform(entry_count) => { entries = entry_count; },
                            }
                        },
                        GatedSubmissionType::game_id(_) => {
                            assert(false, Errors::INVALID_GATED_SUBMISSION_TYPE)
                        },
                    }
                },
                Option::None => { assert(false, Errors::INVALID_GATED_SUBMISSION_TYPE); }
            }
        }

        fn _assert_has_qualified_in_tournaments(
            self: @ComponentState<TContractState>,
            store: Store,
            tournament_ids: Span<u64>,
            gated_submission_type: Option<GatedSubmissionType>,
            address: ContractAddress
        ) {
            match gated_submission_type {
                Option::Some(submission) => {
                    match submission {
                        GatedSubmissionType::token_id(_) => {
                            assert(false, Errors::INVALID_GATED_SUBMISSION_TYPE)
                        },
                        GatedSubmissionType::game_id(game_ids) => {
                            assert(
                                game_ids.len() == tournament_ids.len(),
                                Errors::INVALID_SUBMITTED_GAMES_LENGTH
                            );
                            let tournament_config = store
                                .get_tournament_config(get_contract_address());
                            let ls_dispatcher = ILootSurvivorDispatcher {
                                contract_address: tournament_config.loot_survivor
                            };
                            let mut loop_index = 0;
                            loop {
                                if loop_index == tournament_ids.len() {
                                    break;
                                }
                                self
                                    ._assert_game_token_owner(
                                        (*game_ids.at(loop_index)).into(), address
                                    );
                                let adventurer = ls_dispatcher
                                    .get_adventurer(*game_ids.at(loop_index).try_into().unwrap());
                                assert(
                                    self
                                        ._is_top_score(
                                            store, *tournament_ids.at(loop_index), adventurer.xp
                                        ),
                                    Errors::SUBMITTED_GAME_NOT_TOP_SCORE
                                );
                                loop_index += 1;
                            }
                        }
                    }
                },
                Option::None => { assert(false, Errors::INVALID_GATED_SUBMISSION_TYPE); }
            }
        }

        fn _assert_qualifying_address(
            self: @ComponentState<TContractState>,
            address: ContractAddress,
            qualifying_addresses: Span<ContractAddress>
        ) {
            let mut found = false;
            let mut loop_index = 0;
            loop {
                if loop_index == qualifying_addresses.len() {
                    break;
                }
                let qualifying_address = *qualifying_addresses.at(loop_index);
                if qualifying_address == address {
                    found = true;
                    break;
                }
                loop_index += 1;
            };
            assert(found, Errors::CALLER_DOES_NOT_QUALIFY);
        }

        //
        // INTERNALS
        //

        fn _create_tournament(
            ref self: ComponentState<TContractState>,
            ref store: Store,
            name: felt252,
            description: ByteArray,
            creator: ContractAddress,
            registration_start_time: u64,
            registration_end_time: u64,
            start_time: u64,
            end_time: u64,
            submission_period: u64,
            winners_count: u8,
            gated_type: Option<GatedType>,
            entry_premium: Option<Premium>,
        ) -> u64 {
            let mut tournament_totals = store.get_tournament_totals(get_contract_address());
            let new_tournament_id = tournament_totals.total_tournaments + 1;
            store
                .set_tournament(
                    @TournamentModel {
                        tournament_id: new_tournament_id,
                        name,
                        description,
                        creator,
                        registration_start_time,
                        registration_end_time,
                        start_time,
                        end_time,
                        submission_period,
                        winners_count,
                        gated_type,
                        entry_premium,
                    }
                );

            tournament_totals.total_tournaments = new_tournament_id;
            store.set_tournament_totals(@tournament_totals);
            new_tournament_id
        }

        // TODO: add for V2 (only ERC721 tokens)
        fn _register_token(
            ref self: ComponentState<TContractState>,
            ref store: Store,
            token: ContractAddress,
            token_data_type: TokenDataType
        ) {
            let safe_mode = store.get_tournament_config(get_contract_address()).safe_mode;

            assert(!safe_mode, Errors::CANNOT_REGISTER_IN_SAFE_MODE);

            assert(!self._is_token_registered(store, token), Errors::TOKEN_ALREADY_REGISTERED);

            let mut name = "";
            let mut symbol = "";

            match token_data_type.into() {
                TokenDataType::erc20(_) => {
                    let token_dispatcher = IERC20Dispatcher { contract_address: token };
                    let token_dispatcher_metadata = IERC20MetadataDispatcher {
                        contract_address: token
                    };
                    name = token_dispatcher_metadata.name();
                    symbol = token_dispatcher_metadata.symbol();
                    // check that the contract is approved for the minimal amount
                    let allowance = token_dispatcher
                        .allowance(get_caller_address(), get_contract_address());
                    assert(allowance == 1, Errors::INVALID_TOKEN_ALLOWANCES);
                    // take a reading of the current balance (incase contract has assets
                    // already)
                    let current_balance = token_dispatcher.balance_of(get_contract_address());
                    // trnsfer a minimal amount to the contract
                    token_dispatcher.transfer_from(get_caller_address(), get_contract_address(), 1);
                    // take a reading of the new balance
                    let new_balance = token_dispatcher.balance_of(get_contract_address());
                    assert(new_balance == current_balance + 1, Errors::INVALID_TOKEN_BALANCES);
                    // transfer back the minimal amount
                    token_dispatcher.transfer(get_caller_address(), 1);
                    // check the total supply is legitimate
                    let total_supply = token_dispatcher.total_supply();
                    assert(total_supply < TWO_POW_128.into(), Errors::TOKEN_SUPPLY_TOO_LARGE);
                },
                TokenDataType::erc721(token_data_type) => {
                    let token_dispatcher = IERC721Dispatcher { contract_address: token };
                    let token_dispatcher_metadata = IERC721MetadataDispatcher {
                        contract_address: token
                    };
                    name = token_dispatcher_metadata.name();
                    symbol = token_dispatcher_metadata.symbol();
                    // check that the contract is approved for the specific id
                    let approved = token_dispatcher.get_approved(token_data_type.token_id.into());
                    assert(approved == get_contract_address(), Errors::INVALID_TOKEN_APPROVALS);
                    // transfer a specific id to the contract
                    token_dispatcher
                        .transfer_from(
                            get_caller_address(),
                            get_contract_address(),
                            token_data_type.token_id.into()
                        );
                    // check the balance of the contract
                    let balance = token_dispatcher.balance_of(get_contract_address());
                    assert(balance == 1, Errors::INVALID_TOKEN_BALANCES);
                    let owner = token_dispatcher.owner_of(token_data_type.token_id.into());
                    assert(owner == get_contract_address(), Errors::INVALID_TOKEN_OWNER);
                    // transfer back the token
                    token_dispatcher
                        .transfer_from(
                            get_contract_address(),
                            get_caller_address(),
                            token_data_type.token_id.into()
                        );
                },
            }
            let token_model = Token { token, name, symbol, token_data_type, is_registered: true };
            store.set_token(@token_model);
        }

        fn _start_game(
            ref self: ComponentState<TContractState>,
            ref store: Store,
            tournament_id: u64,
            ref total_start_index: u64,
            total_entries: u64,
            address: ContractAddress,
            ref golden_token_index: u32,
            ref blobert_token_index: u32,
            golden_token_free_game_token_ids: Span<u256>,
            blobert_free_game_token_ids: Span<u256>,
            ls_dispatcher: ILootSurvivorDispatcher,
            client_reward_address: ContractAddress,
            weapon: u8,
            name: felt252
        ) {
            let mut address_address_entries = store
                .get_address_entries(tournament_id, address)
                .entry_count;
            let mut address_start_index = store
                .get_tournament_starts(tournament_id, address)
                .start_count;
            let mut game_ids = ArrayTrait::<u64>::new();
            loop {
                if (address_start_index == address_address_entries
                    || total_start_index == total_entries) {
                    break;
                }
                let mut game_id = 0;
                if (golden_token_index != golden_token_free_game_token_ids.len()) {
                    let token_id = *golden_token_free_game_token_ids.at(golden_token_index);
                    // to avoid extra storage we are just providing defualt configs for the
                    // adventurers
                    game_id = ls_dispatcher
                        .new_game(
                            client_reward_address,
                            weapon,
                            name,
                            (token_id.low).try_into().unwrap(),
                            true,
                            contract_address_const::<0>(),
                            0,
                            address
                        );
                    golden_token_index += 1;
                } else if (blobert_token_index != blobert_free_game_token_ids.len()) {
                    let token_id = *blobert_free_game_token_ids.at(blobert_token_index);
                    game_id = ls_dispatcher
                        .new_game(
                            client_reward_address,
                            weapon,
                            name,
                            0,
                            true,
                            contract_address_const::<0>(),
                            token_id.low,
                            address
                        );
                    blobert_token_index += 1;
                } else {
                    game_id = ls_dispatcher
                        .new_game(
                            client_reward_address,
                            weapon,
                            name,
                            0,
                            true,
                            contract_address_const::<0>(),
                            0,
                            address
                        );
                }
                game_ids.append(game_id.try_into().unwrap());
                let game = TournamentGame {
                    tournament_id,
                    game_id: game_id.try_into().unwrap(),
                    address: address,
                    status: EntryStatus::Started
                };
                store.set_tournament_game(@game);
                address_start_index += 1;
                total_start_index += 1;
            };
            let address_starts = TournamentStartsAddress {
                tournament_id, address, start_count: address_start_index
            };
            store.set_address_starts(@address_starts);
        }

        fn _flash_loan_free_game_tokens(
            ref self: ComponentState<TContractState>,
            tournament_config: TournamentConfig,
            ls_dispatcher: ILootSurvivorDispatcher,
            golden_token_free_game_token_ids: Span<u256>,
            blobert_free_game_token_ids: Span<u256>
        ) -> u32 {
            let mut free_games = 0;
            let mut golden_token_index = 0;
            loop {
                if golden_token_index == golden_token_free_game_token_ids.len() {
                    break;
                }
                let golden_token_id = *golden_token_free_game_token_ids.at(golden_token_index);
                self
                    ._assert_token_owner(
                        tournament_config.golden_token, golden_token_id, get_caller_address()
                    );
                // check if free game token is available
                let free_game_available = ls_dispatcher
                    .free_game_available(FreeGameTokenType::GoldenToken, golden_token_id.low);
                assert(free_game_available, Errors::FREE_GAME_NOT_AVAILABLE);
                // flash loan free game tokens
                IERC721Dispatcher { contract_address: tournament_config.golden_token }
                    .transfer_from(get_caller_address(), get_contract_address(), golden_token_id);
                free_games += 1;
                golden_token_index += 1;
            };

            let mut blobert_token_index = 0;
            loop {
                if blobert_token_index == blobert_free_game_token_ids.len() {
                    break;
                }
                let blobert_token_id = *blobert_free_game_token_ids.at(blobert_token_index);
                self
                    ._assert_token_owner(
                        tournament_config.blobert, blobert_token_id, get_caller_address()
                    );
                // check if caller has blobert
                let free_game_available = ls_dispatcher
                    .free_game_available(
                        FreeGameTokenType::LaunchTournamentChampion, blobert_token_id.low
                    );
                assert(free_game_available, Errors::FREE_GAME_NOT_AVAILABLE);
                // flash loan bloberts
                IERC721Dispatcher { contract_address: tournament_config.blobert }
                    .transfer_from(get_caller_address(), get_contract_address(), blobert_token_id);
                free_games += 1;
                blobert_token_index += 1;
            };
            free_games
        }

        fn _return_free_game_tokens(
            ref self: ComponentState<TContractState>,
            ref tournament_config: TournamentConfig,
            golden_token_free_game_token_ids: Span<u256>,
            blobert_free_game_token_ids: Span<u256>
        ) {
            let mut golden_token_index = 0;
            loop {
                if golden_token_index == golden_token_free_game_token_ids.len() {
                    break;
                }
                IERC721Dispatcher { contract_address: tournament_config.golden_token }
                    .transfer_from(
                        get_contract_address(),
                        get_caller_address(),
                        *golden_token_free_game_token_ids.at(golden_token_index)
                    );
                golden_token_index += 1;
            };

            let mut blobert_token_index = 0;
            loop {
                if blobert_token_index == blobert_free_game_token_ids.len() {
                    break;
                }
                IERC721Dispatcher { contract_address: tournament_config.blobert }
                    .transfer_from(
                        get_contract_address(),
                        get_caller_address(),
                        *blobert_free_game_token_ids.at(blobert_token_index)
                    );
                blobert_token_index += 1;
            };
        }

        fn _format_premium_config_into_prize_keys(
            ref self: ComponentState<TContractState>, ref store: Store, tournament_id: u64
        ) {
            let tournament = store.get_tournament(tournament_id);
            match tournament.entry_premium {
                Option::Some(premium) => {
                    let total_entries = store.get_total_entries(tournament_id);
                    // first pay the creator fee
                    let token_dispatcher = IERC20Dispatcher { contract_address: premium.token };
                    let creator_amount = self
                        ._calculate_payout(
                            premium.creator_fee.into(),
                            total_entries.entry_count.into() * premium.token_amount
                        );
                    if creator_amount > 0 {
                        token_dispatcher.transfer(tournament.creator, creator_amount.into());
                    }

                    // then format the rest of the premium distributions into prize keys
                    let players_amount = (total_entries.entry_count.into() * premium.token_amount)
                        - creator_amount;
                    let totals = store.get_tournament_totals(get_contract_address());
                    let mut prize_key_total = totals.total_prizes;
                    let player_distributions = premium.token_distribution;
                    let num_distributions = player_distributions.len();
                    let mut distribution_index = 0;
                    loop {
                        if distribution_index == num_distributions {
                            break;
                        }
                        let distribution_percentage = *player_distributions.at(distribution_index);
                        let distribution_amount = self
                            ._calculate_payout(distribution_percentage.into(), players_amount);
                        // increment prize keys
                        prize_key_total += 1;
                        let totals = TournamentTotals {
                            contract: get_contract_address(),
                            total_tournaments: totals.total_tournaments,
                            total_prizes: prize_key_total,
                        };
                        store.set_tournament_totals(@totals);
                        // store prize against key, claimed is false
                        let prize = TournamentPrize {
                            tournament_id,
                            prize_key: prize_key_total.into(),
                            token: premium.token,
                            token_data_type: TokenDataType::erc20(
                                ERC20Data { token_amount: distribution_amount }
                            ),
                            payout_position: (distribution_index + 1).try_into().unwrap(),
                            claimed: false
                        };
                        store.set_prize(@prize);
                        distribution_index += 1;
                    };
                    // set premiums formatted true
                    let tournament_entries = TournamentEntries {
                        tournament_id,
                        entry_count: total_entries.entry_count,
                        premiums_formatted: true,
                        distribute_called: total_entries.distribute_called
                    };
                    store.set_total_entries(@tournament_entries);
                },
                Option::None => {}
            }
        }
        fn _update_tournament_scores(
            ref self: ComponentState<TContractState>,
            store: Store,
            tournament_id: u64,
            game_id: felt252,
            score: u16,
            ref new_score_ids: Array<u64>,
            game_index: u32
        ) {
            // get current scores which will be mutated as part of this function
            let top_score_ids = store.get_tournament_scores(tournament_id).top_score_ids;

            let num_scores = top_score_ids.len();

            let mut new_score_id: u64 = 0;
            let mut new_score: u16 = 0;

            if num_scores == 0 {
                new_score_id = game_id.try_into().unwrap();
                new_score = score;
            } else {
                if (game_index < num_scores) {
                    let top_score_id = *top_score_ids.at(game_index);
                    let top_score = self.get_score_from_id(store, top_score_id.try_into().unwrap());
                    if (score > top_score) {
                        new_score_id = game_id.try_into().unwrap();
                        new_score = score;
                    } else {
                        new_score_id = top_score_id;
                        new_score = top_score;
                    }
                } else {
                    new_score_id = game_id.try_into().unwrap();
                    new_score = score;
                }
            }
            new_score_ids.append(new_score_id);
        }

        fn _convert_usd_to_wei(
            self: @ComponentState<TContractState>, tournament_config: TournamentConfig, usd: u128
        ) -> u128 {
            let oracle_dispatcher = IPragmaABIDispatcher {
                contract_address: tournament_config.oracle
            };
            let response = oracle_dispatcher.get_data_median(DataType::SpotEntry('ETH/USD'));
            assert(response.price > 0, Errors::FETCHING_ETH_PRICE_ERROR);
            (usd * pow(10, response.decimals.into()) * 1000000000000000000)
                / (response.price * 100000000)
        }

        fn _deposit_prize(
            ref self: ComponentState<TContractState>,
            ref store: Store,
            tournament_id: u64,
            token: ContractAddress,
            token_data_type: TokenDataType,
            position: u8
        ) {
            self._assert_prize_token_registered(store, token);
            self._assert_prize_position_less_than_winners_count(store, tournament_id, position);

            let safe_mode = store.get_tournament_config(get_contract_address()).safe_mode;
            if (safe_mode) {
                assert(
                    token == ETHEREUM_ADDRESS()
                        || token == LORDS_ADDRESS()
                        || token == SURVIVORS_ADDRESS()
                        || token == BEASTS_ADDRESS()
                        || token == DARK_SHUFFLE_ADDRESS(),
                    Errors::INVALID_TOKEN_FOR_SAFE_MODE
                );
            }

            match token_data_type {
                TokenDataType::erc20(token_data) => {
                    let token_dispatcher = IERC20Dispatcher { contract_address: token };
                    let safe_mode = store.get_tournament_config(get_contract_address()).safe_mode;
                    if (safe_mode) {
                        if (token == ETHEREUM_ADDRESS()) {
                            assert(
                                token_data.token_amount <= ETH_SAFE_AMOUNT,
                                Errors::INVALID_SAFE_TOKEN_AMOUNT
                            );
                        } else {
                            assert(
                                token_data.token_amount <= LORDS_SAFE_AMOUNT,
                                Errors::INVALID_SAFE_TOKEN_AMOUNT
                            );
                        }
                    }
                    token_dispatcher
                        .transfer_from(
                            get_caller_address(),
                            get_contract_address(),
                            token_data.token_amount.into()
                        );
                },
                TokenDataType::erc721(token_data) => {
                    let token_dispatcher = IERC721Dispatcher { contract_address: token };
                    self
                        ._assert_token_owner(
                            token, token_data.token_id.into(), get_caller_address()
                        );
                    token_dispatcher
                        .transfer_from(
                            get_caller_address(), get_contract_address(), token_data.token_id.into()
                        );
                },
            }
            let mut totals = store.get_tournament_totals(get_contract_address());
            totals.total_prizes += 1;
            store.set_tournament_totals(@totals);
            // store prize against key, claimed is false
            store
                .set_prize(
                    @TournamentPrize {
                        tournament_id,
                        prize_key: totals.total_prizes.into(),
                        token: token,
                        token_data_type: token_data_type,
                        payout_position: position,
                        claimed: false
                    }
                );
        }

        fn _distribute_prizes_to_address(
            ref self: ComponentState<TContractState>,
            ref store: Store,
            tournament_id: u64,
            prize_keys: Array<u64>,
            address: ContractAddress
        ) {
            let num_prizes = prize_keys.len();
            let mut prize_index = 0;
            loop {
                if prize_index == num_prizes {
                    break;
                }
                let prize_key = *prize_keys.at(prize_index);
                let mut prize = store.get_prize(tournament_id, prize_key);
                match prize.token_data_type {
                    TokenDataType::erc20(token_data) => {
                        let token_dispatcher = IERC20Dispatcher { contract_address: prize.token };
                        token_dispatcher.transfer(address, token_data.token_amount.into());
                    },
                    TokenDataType::erc721(token_data) => {
                        let token_dispatcher = IERC721Dispatcher { contract_address: prize.token };
                        token_dispatcher
                            .transfer_from(
                                get_contract_address(), address, token_data.token_id.into()
                            );
                    },
                }
                prize.claimed = true;
                store.set_prize(@prize);
                prize_index += 1;
            };
        }

        fn _distribute_prizes_to_top_scores(
            ref self: ComponentState<TContractState>,
            ref store: Store,
            tournament_id: u64,
            prize_keys: Array<u64>,
            top_score_ids: Span<u64>
        ) {
            let tournament_config = store.get_tournament_config(get_contract_address());
            let num_prizes = prize_keys.len();
            let mut prize_index = 0;
            loop {
                if prize_index == num_prizes {
                    break;
                }
                let mut prize = store.get_prize(tournament_id, *prize_keys.at(prize_index));
                // assert prize hasn't been claimed
                self._assert_prize_exists(prize.token);
                self._assert_prize_not_claimed(prize.claimed);
                let payout_position_is_top_score = prize
                    .payout_position
                    .into() <= top_score_ids
                    .len();
                // get payout position address
                let payout_position_id = *top_score_ids.at(prize.payout_position.into() - 1);
                let payout_position_address = self
                    ._get_owner(tournament_config.loot_survivor, payout_position_id.into());
                // get first place address
                let first_place_id = *top_score_ids.at(0);
                let first_place_address = self
                    ._get_owner(tournament_config.loot_survivor, first_place_id.into());
                // perform the distributions based on the token data type
                match prize.token_data_type {
                    TokenDataType::erc20(token_data) => {
                        let token_dispatcher = IERC20Dispatcher { contract_address: prize.token };
                        // check if the prize position is less than or equal to the number of
                        //top scores
                        if payout_position_is_top_score {
                            if (token_data.token_amount > 0) {
                                token_dispatcher
                                    .transfer(
                                        payout_position_address, token_data.token_amount.into()
                                    );
                            }
                        } else {
                            token_dispatcher
                                .transfer(first_place_address, token_data.token_amount.into());
                        }
                    },
                    TokenDataType::erc721(token_data) => {
                        let token_dispatcher = IERC721Dispatcher { contract_address: prize.token };
                        if payout_position_is_top_score {
                            token_dispatcher
                                .transfer_from(
                                    get_contract_address(),
                                    payout_position_address,
                                    token_data.token_id.into()
                                );
                        } else {
                            token_dispatcher
                                .transfer_from(
                                    get_contract_address(),
                                    first_place_address,
                                    token_data.token_id.into()
                                );
                        }
                    },
                }
                prize.claimed = true;
                store.set_prize(@prize);
                prize_index += 1;
            }
        }

        fn _calculate_total_entries(
            self: @ComponentState<TContractState>,
            store: Store,
            tournament_id: u64,
            addresses: Array<ContractAddress>
        ) -> u64 {
            let mut entries = 0;
            let num_addresses = addresses.len();
            let mut address_index = 0;
            loop {
                if address_index == num_addresses {
                    break;
                }
                let address = *addresses.at(address_index);
                let address_entries = store.get_address_entries(tournament_id, address).entry_count;
                let address_starts = store
                    .get_tournament_starts(tournament_id, address)
                    .start_count;
                entries += address_entries - address_starts;
                address_index += 1;
            };
            entries
        }

        fn _calculate_payout(
            ref self: ComponentState<TContractState>, bp: u128, total_value: u128
        ) -> u128 {
            (bp * total_value) / 100
        }
    }
}
