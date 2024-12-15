use adventurer::{
    adventurer::{Adventurer, ImplAdventurer},
    adventurer_meta::{AdventurerMetadata, ImplAdventurerMetadata}, bag::Bag
};
use tournament::ls15_components::models::loot_survivor::AdventurerMetadataStorage;
use tournament::ls15_components::models::tournament::{
    TournamentModel, Token, Premium, TokenDataType, GatedType, GatedSubmissionType,
    FreeGameTokenType
};
use tournament::ls15_components::interfaces::{DataType, PragmaPricesResponse};

use starknet::ContractAddress;
use dojo::world::{WorldStorage, WorldStorageTrait, IWorldDispatcher};

use tournament::ls15_components::libs::utils::ZERO;

#[starknet::interface]
pub trait IERC20Mock<TState> {
    // IWorldProvider
    fn world_dispatcher(self: @TState) -> IWorldDispatcher;

    // IERC20
    fn total_supply(self: @TState) -> u256;
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn allowance(self: @TState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transfer(ref self: TState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
    fn approve(ref self: TState, spender: ContractAddress, amount: u256) -> bool;
    // IERC20Metadata
    fn name(self: @TState) -> ByteArray;
    fn symbol(self: @TState) -> ByteArray;
    fn decimals(self: @TState) -> u8;
    // IERC20CamelOnly
    fn totalSupply(self: @TState) -> u256;
    fn balanceOf(self: @TState, account: ContractAddress) -> u256;
    fn transferFrom(
        ref self: TState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;

    // IERCPublic
    fn mint(ref self: TState, recipient: ContractAddress, amount: u256);
}

#[starknet::interface]
pub trait IERC721Mock<TState> {
    // IWorldProvider
    fn world_dispatcher(self: @TState) -> IWorldDispatcher;

    // ISRC5
    fn supports_interface(self: @TState, interface_id: felt252) -> bool;
    // IERC721
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn owner_of(self: @TState, token_id: u256) -> ContractAddress;
    fn safe_transfer_from(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    );
    fn transfer_from(ref self: TState, from: ContractAddress, to: ContractAddress, token_id: u256);
    fn approve(ref self: TState, to: ContractAddress, token_id: u256);
    fn set_approval_for_all(ref self: TState, operator: ContractAddress, approved: bool);
    fn get_approved(self: @TState, token_id: u256) -> ContractAddress;
    fn is_approved_for_all(
        self: @TState, owner: ContractAddress, operator: ContractAddress
    ) -> bool;
    // IERC721CamelOnly
    fn balanceOf(self: @TState, account: ContractAddress) -> u256;
    fn ownerOf(self: @TState, tokenId: u256) -> ContractAddress;
    fn safeTransferFrom(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        tokenId: u256,
        data: Span<felt252>
    );
    fn transferFrom(ref self: TState, from: ContractAddress, to: ContractAddress, tokenId: u256);
    fn setApprovalForAll(ref self: TState, operator: ContractAddress, approved: bool);
    fn getApproved(self: @TState, tokenId: u256) -> ContractAddress;
    fn isApprovedForAll(self: @TState, owner: ContractAddress, operator: ContractAddress) -> bool;
    // IERC721Metadata
    fn name(self: @TState) -> ByteArray;
    fn symbol(self: @TState) -> ByteArray;
    fn token_uri(self: @TState, token_id: u256) -> ByteArray;
    // IERC721MetadataCamelOnly
    fn tokenURI(self: @TState, tokenId: u256) -> ByteArray;

    // IERC721Public
    fn mint(ref self: TState, recipient: ContractAddress, token_id: u256);
}

#[starknet::interface]
pub trait ITournamentMock<TState> {
    // IWorldProvider
    fn world_dispatcher(self: @TState) -> IWorldDispatcher;

    fn total_tournaments(self: @TState) -> u64;
    fn tournament(self: @TState, tournament_id: u64) -> TournamentModel;
    fn tournament_entries(self: @TState, tournament_id: u64) -> u64;
    fn tournament_prize_keys(self: @TState, tournament_id: u64) -> Array<u64>;
    fn top_scores(self: @TState, tournament_id: u64) -> Array<u64>;
    fn is_token_registered(self: @TState, token: ContractAddress) -> bool;
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
    fn register_tokens(ref self: TState, tokens: Array<Token>);
    fn enter_tournament(
        ref self: TState, tournament_id: u64, gated_submission_type: Option<GatedSubmissionType>
    );
    fn start_tournament(
        ref self: TState,
        tournament_id: u64,
        start_all: bool,
        start_count: Option<u64>,
        client_reward_address: ContractAddress,
        golden_token_free_game_ids: Span<u256>,
        blobert_free_game_ids: Span<u256>,
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

    fn initializer(
        ref self: TState,
        eth_address: ContractAddress,
        lords_address: ContractAddress,
        loot_survivor_address: ContractAddress,
        oracle_address: ContractAddress,
        golden_token: ContractAddress,
        blobert: ContractAddress,
        safe_mode: bool,
        test_mode: bool,
        test_erc20: ContractAddress,
        test_erc721: ContractAddress,
    );
}

#[starknet::interface]
pub trait ILootSurvivorMock<TState> {
    // IWorldProvider
    fn world_dispatcher(self: @TState) -> IWorldDispatcher;

    // ISRC5
    fn supports_interface(self: @TState, interface_id: felt252) -> bool;
    // IERC721
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn owner_of(self: @TState, token_id: u256) -> ContractAddress;
    fn safe_transfer_from(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    );
    fn transfer_from(ref self: TState, from: ContractAddress, to: ContractAddress, token_id: u256);
    fn approve(ref self: TState, to: ContractAddress, token_id: u256);
    fn set_approval_for_all(ref self: TState, operator: ContractAddress, approved: bool);
    fn get_approved(self: @TState, token_id: u256) -> ContractAddress;
    fn is_approved_for_all(
        self: @TState, owner: ContractAddress, operator: ContractAddress
    ) -> bool;
    // IERC721CamelOnly
    fn balanceOf(self: @TState, account: ContractAddress) -> u256;
    fn ownerOf(self: @TState, tokenId: u256) -> ContractAddress;
    fn safeTransferFrom(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        tokenId: u256,
        data: Span<felt252>
    );
    fn transferFrom(ref self: TState, from: ContractAddress, to: ContractAddress, tokenId: u256);
    fn setApprovalForAll(ref self: TState, operator: ContractAddress, approved: bool);
    fn getApproved(self: @TState, tokenId: u256) -> ContractAddress;
    fn isApprovedForAll(self: @TState, owner: ContractAddress, operator: ContractAddress) -> bool;
    // IERC721Metadata
    fn name(self: @TState) -> ByteArray;
    fn symbol(self: @TState) -> ByteArray;
    fn token_uri(self: @TState, token_id: u256) -> ByteArray;
    // IERC721MetadataCamelOnly
    fn tokenURI(self: @TState, tokenId: u256) -> ByteArray;

    // LS
    fn get_adventurer(self: @TState, adventurer_id: felt252) -> Adventurer;
    fn get_adventurer_meta(self: @TState, adventurer_id: felt252) -> AdventurerMetadata;
    fn get_bag(self: @TState, adventurer_id: felt252) -> Bag;
    fn get_cost_to_play(self: @TState) -> u128;
    fn free_game_available(self: @TState, token_type: FreeGameTokenType, token_id: u128) -> bool;
    fn new_game(
        ref self: TState,
        client_reward_address: ContractAddress,
        weapon: u8,
        name: felt252,
        golden_token_id: u8,
        delay_reveal: bool,
        custom_renderer: ContractAddress,
        launch_tournament_winner_token_id: u128,
        mint_to: ContractAddress
    ) -> felt252;
    fn set_adventurer(ref self: TState, adventurer_id: felt252, adventurer: Adventurer);
    fn set_adventurer_meta(
        ref self: TState, adventurer_id: felt252, adventurer_meta: AdventurerMetadataStorage
    );
    fn set_bag(ref self: TState, adventurer_id: felt252, bag: Bag);
    fn set_free_game_available(ref self: TState, free_game_type: FreeGameTokenType, token_id: u128);

    fn initializer(
        ref self: TState,
        eth_address: ContractAddress,
        lords_address: ContractAddress,
        pragma_address: ContractAddress
    );
}

#[starknet::interface]
pub trait IPragmaMock<TState> {
    // IWorldProvider
    fn world(self: @TState,) -> IWorldDispatcher;

    // IERCPublic
    fn get_data_median(ref self: TState, data_type: DataType) -> PragmaPricesResponse;
}

#[generate_trait]
pub impl WorldImpl of WorldTrait {
    fn contract_address(self: @WorldStorage, contract_name: @ByteArray) -> ContractAddress {
        match self.dns(contract_name) {
            Option::Some((contract_address, _)) => { (contract_address) },
            Option::None => { (ZERO()) },
        }
    }

    // Create a Store from a dispatcher
    // https://github.com/dojoengine/dojo/blob/main/crates/dojo/core/src/contract/components/world_provider.cairo
    // https://github.com/dojoengine/dojo/blob/main/crates/dojo/core/src/world/storage.cairo
    #[inline(always)]
    fn storage(dispatcher: IWorldDispatcher, namespace: @ByteArray) -> WorldStorage {
        (WorldStorageTrait::new(dispatcher, namespace))
    }

    //
    // addresses
    //

    #[inline(always)]
    fn tournament_mock_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"tournament_mock"))
    }

    #[inline(always)]
    fn loot_survivor_mock_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"loot_survivor_mock"))
    }

    #[inline(always)]
    fn pragma_mock_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"pragma_mock"))
    }

    #[inline(always)]
    fn erc20_mock_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"erc20_mock"))
    }

    #[inline(always)]
    fn erc721_mock_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"erc721_mock"))
    }

    //
    // dispatchers
    //

    #[inline(always)]
    fn tournament_mock_dispatcher(self: @WorldStorage) -> ITournamentMockDispatcher {
        (ITournamentMockDispatcher { contract_address: self.tournament_mock_address() })
    }
    #[inline(always)]
    fn loot_survivor_mock_dispatcher(self: @WorldStorage) -> ILootSurvivorMockDispatcher {
        (ILootSurvivorMockDispatcher { contract_address: self.loot_survivor_mock_address() })
    }
    #[inline(always)]
    fn pragma_mock_dispatcher(self: @WorldStorage) -> IPragmaMockDispatcher {
        (IPragmaMockDispatcher { contract_address: self.pragma_mock_address() })
    }
    #[inline(always)]
    fn erc20_mock_dispatcher(self: @WorldStorage) -> IERC20MockDispatcher {
        (IERC20MockDispatcher { contract_address: self.erc20_mock_address() })
    }
    #[inline(always)]
    fn erc721_mock_dispatcher(self: @WorldStorage) -> IERC721MockDispatcher {
        (IERC721MockDispatcher { contract_address: self.erc721_mock_address() })
    }
}
