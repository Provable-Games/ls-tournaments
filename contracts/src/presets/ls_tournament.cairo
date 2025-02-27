use starknet::ContractAddress;
use dojo::world::IWorldDispatcher;
use ls_tournaments_v0::ls15_components::models::tournament::{
    Tournament, Premium, TokenDataType, GatedType, GatedSubmissionType
};

#[starknet::interface]
pub trait ILSTournament<TState> {
    // IWorldProvider
    fn world_dispatcher(self: @TState) -> IWorldDispatcher;

    fn total_tournaments(self: @TState) -> u64;
    fn tournament(self: @TState, tournament_id: u64) -> Tournament;
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
        golden_token_free_game_ids: Span<u256>,
        blobert_free_game_ids: Span<u256>,
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

#[dojo::contract]
pub mod LSTournament {
    use starknet::{contract_address_const};
    use ls_tournaments_v0::ls15_components::tournament::tournament_component;

    component!(path: tournament_component, storage: tournament, event: TournamentEvent);

    #[abi(embed_v0)]
    impl TournamentImpl = tournament_component::TournamentImpl<ContractState>;

    impl TournamentInternalImpl = tournament_component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        tournament: tournament_component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TournamentEvent: tournament_component::Event,
    }

    fn dojo_init(ref self: ContractState, safe_mode: bool, test_mode: bool,) {
        self
            .tournament
            .initialize(
                contract_address_const::<
                    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                >(), // eth
                contract_address_const::<
                    0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49
                >(), // lords
                contract_address_const::<
                    0x018108b32cea514a78ef1b0e4a0753e855cdf620bc0565202c02456f618c4dc4
                >(), // loot survivor
                contract_address_const::<
                    0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b
                >(), // oracle
                contract_address_const::<
                    0x04f5e296c805126637552cf3930e857f380e7c078e8f00696de4fc8545356b1d
                >(), // golden token
                contract_address_const::<
                    0x00539f522b29ae9251dbf7443c7a950cf260372e69efab3710a11bf17a9599f1
                >(), // blobert
                safe_mode,
                test_mode
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                >(),
                "Ether",
                "ETH"
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49
                >(),
                "Lords",
                "LORDS"
            );
        self
            .tournament
            .initialize_erc721(
                contract_address_const::<
                    0x018108b32cea514a78ef1b0e4a0753e855cdf620bc0565202c02456f618c4dc4
                >(),
                "Loot Survivor",
                "LSVR"
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
                >(),
                "Starknet Token",
                "STRK"
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
                >(),
                "USD Coin",
                "USDC"
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x4878d1148318a31829523ee9c6a5ee563af6cd87f90a30809e5b0d27db8a9b
                >(),
                "Standard Weighted Adalian Yield",
                "SWAY"
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x410466536b5ae074f7fea81e5533b8134a9fa08b3dd077dd9db08f64997d113
                >(),
                "Paper",
                "PAPER"
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x75afe6402ad5a5c20dd25e10ec3b3986acaa647b77e4ae24b0cbc9a54a27a87
                >(),
                "Ekubo Protocol",
                "EKUBO"
            );
        self
            .tournament
            .initialize_erc20(
                contract_address_const::<
                    0x3b405a98c9e795d427fe82cdeeeed803f221b52471e3a757574a2b4180793ee
                >(),
                "STARKNET BROTHER",
                "BROTHER"
            );
        self
            .tournament
            .initialize_erc721(
                contract_address_const::<
                    0x00539f522b29ae9251dbf7443c7a950cf260372e69efab3710a11bf17a9599f1
                >(),
                "Blobert",
                "BLOB"
            );
        self
            .tournament
            .initialize_erc721(
                contract_address_const::<
                    0x0158160018d590d93528995b340260e65aedd76d28a686e9daa5c4e8fad0c5dd
                >(),
                "Beasts",
                "BEASTS"
            );
        self
            .tournament
            .initialize_erc721(
                contract_address_const::<
                    0x033faad68bac7f856a01eeb4f80f6e98e2cfca9dfc0c8774aee42d68406510cd
                >(),
                "Dark Shuffle Game Token",
                "DSGT"
            );
    }
}
