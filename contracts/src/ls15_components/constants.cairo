use starknet::{ContractAddress, contract_address_const};

pub const VRF_COST_PER_GAME: u32 = 50000000; // $0.50 with 8 decimals

//
// Tournament time constraints
//

// PRODUCTION VALUES
pub const MIN_REGISTRATION_PERIOD: u32 = 3600; // 1 hour
pub const MAX_REGISTRATION_PERIOD: u32 = 2592000; // 1 month
pub const MIN_TOURNAMENT_LENGTH: u32 = 3600; // 1 hour
pub const MAX_TOURNAMENT_LENGTH: u32 = 15552000; // 6 months
pub const MIN_SUBMISSION_PERIOD: u32 = 3600; // 1 hour
pub const MAX_SUBMISSION_PERIOD: u32 = 1209600; // 2 weeks
pub const GAME_EXPIRATION_PERIOD: u32 = 864000; // 10 days

// TEST VALUES
pub const TEST_MIN_REGISTRATION_PERIOD: u32 = 1; // 1 second
pub const TEST_MIN_TOURNAMENT_LENGTH: u32 = 1; // 1 second
pub const TEST_MIN_SUBMISSION_PERIOD: u32 = 1; // 1 second

pub const TWO_POW_128: u128 = 100000000000000000000000000000000;

// SAFE MODE PARAMS
pub fn ETHEREUM_ADDRESS() -> ContractAddress {
    contract_address_const::<0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7>()
}

pub fn LORDS_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49>()
}

pub fn SURVIVORS_ADDRESS() -> ContractAddress {
    contract_address_const::<0x018108b32cea514a78ef1b0e4a0753e855cdf620bc0565202c02456f618c4dc4>()
}

pub fn BEASTS_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0158160018d590d93528995b340260e65aedd76d28a686e9daa5c4e8fad0c5dd>()
}

pub fn DARK_SHUFFLE_ADDRESS() -> ContractAddress {
    contract_address_const::<0x033faad68bac7f856a01eeb4f80f6e98e2cfca9dfc0c8774aee42d68406510cd>()
}

pub const ETH_SAFE_AMOUNT: u128 = 3000000000000000; // 0.003 ETH
pub const LORDS_SAFE_AMOUNT: u128 = 50000000000000000000; // 50 LORDS

pub fn DEFAULT_NS() -> @ByteArray {
    @"ls_tournaments_v0"
}
