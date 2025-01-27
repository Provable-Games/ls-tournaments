import { gql } from "@apollo/client";

const ADVENTURER_FIELDS = `
  id
  owner
  entropy
  name
  health
  strength
  dexterity
  vitality
  intelligence
  wisdom
  charisma
  luck
  xp
  level
  weapon
  chest
  head
  waist
  foot
  hand
  neck
  ring
  beastHealth
  statUpgrades
  birthDate
  deathDate
  goldenTokenId
  customRenderer
  battleActionCount
  gold
  createdTime
  lastUpdatedTime
  timestamp
`;

const ADVENTURERS_FRAGMENT = `
  fragment AdventurerFields on Adventurer {
    ${ADVENTURER_FIELDS}
  }
`;

const getAdventurerById = gql`
  ${ADVENTURERS_FRAGMENT}
  query get_adventurer_by_id($id: FeltValue) {
    adventurers(where: { id: { eq: $id } }) {
      ...AdventurerFields
    }
  }
`;

const getAdventurersInList = gql`
  ${ADVENTURERS_FRAGMENT}
  query get_adventurer_by_id($ids: [FeltValue!]) {
    adventurers(
      where: { id: { In: $ids } }
      limit: 500
      orderBy: { timestamp: { desc: true } }
    ) {
      ...AdventurerFields
    }
  }
`;

const getOwnerTokens = gql`
  query getOwnerTokens($token: HexValue, $owner: HexValue) {
    tokens(
      where: { token: { eq: $token }, nftOwnerAddress: { eq: $owner } }
      limit: 1000
    ) {
      hash
      nftOwnerAddress
      timestamp
      token
      tokenId
    }
  }
`;

const getBlobertlaimedFreeGames = gql`
  query getBlobertlaimedFreeGames($tokenIds: [FeltValue!]) {
    claimedFreeGames(
      where: {
        token: {
          eq: "0x539f522b29ae9251dbf7443c7a950cf260372e69efab3710a11bf17a9599f1"
        }
        tokenId: { In: $tokenIds }
      }
      limit: 1000
    ) {
      token
      tokenId
      adventurerId
      gameOwnerAddress
      revealed
      hash
    }
  }
`;

export {
  getAdventurerById,
  getAdventurersInList,
  getOwnerTokens,
  getBlobertlaimedFreeGames,
};
