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

export function useTournamentContracts(): ContractAddresses {
  const { selectedChainConfig } = useDojo();

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  const TOURNAMENT_SYSTEM_NAME = isMainnet ? "LSTournament" : "tournament_mock";

  // Call hooks unconditionally
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

  const configModel = useModel(entityId, Models.TournamentConfig);

  // Return mock addresses for non-mainnet
  if (!isMainnet) {
    return {
      tournament,
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
