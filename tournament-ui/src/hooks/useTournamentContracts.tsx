import { useMemo } from "react";
import { useDojoSystem } from "@/hooks/useDojoSystem";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "@/DojoContext";
import useModel from "@/useModel";
import { Models } from "@/generated/models.gen";

interface ContractAddresses {
  tournament: string;
  eth: string;
  lords: string;
  lootSurvivor: string;
  oracle: string;
  goldenToken: string;
  blobert: string;
}

const TOURNAMENT_SYSTEM_NAME = "LSTournament";

export function useTournamentContracts(): ContractAddresses {
  const {
    setup: { selectedChainConfig },
  } = useDojo();

  // Call hooks unconditionally
  const tournamentMock = useDojoSystem("tournament_mock").contractAddress;
  const ethMock = useDojoSystem("eth_mock").contractAddress;
  const lordsMock = useDojoSystem("lords_mock").contractAddress;
  const lootSurvivorMock = useDojoSystem("loot_survivor_mock").contractAddress;
  const oracleMock = useDojoSystem("pragma_mock").contractAddress;
  const goldenTokenMock = useDojoSystem("erc721_mock").contractAddress;
  const blobertMock = useDojoSystem("erc721_mock").contractAddress;

  const tournament = useDojoSystem(TOURNAMENT_SYSTEM_NAME).contractAddress;
  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(tournament)]),
    [tournament]
  );

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";
  const configModel = useModel(entityId, Models.TournamentConfig);

  // Return mock addresses for non-mainnet
  if (!isMainnet) {
    return {
      tournament: tournamentMock,
      eth: ethMock,
      lords: lordsMock,
      lootSurvivor: lootSurvivorMock,
      oracle: oracleMock,
      goldenToken: goldenTokenMock,
      blobert: blobertMock,
    };
  }

  return {
    tournament,
    eth: configModel?.eth,
    lords: configModel?.lords,
    lootSurvivor: configModel?.loot_survivor,
    oracle: configModel?.oracle,
    goldenToken: configModel?.golden_token,
    blobert: configModel?.blobert,
  };
}
