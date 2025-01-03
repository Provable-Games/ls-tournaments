import { useMemo } from "react";
import { Models } from "@/generated/models.gen";
import useModel from "@/useModel";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoSystem } from "@/hooks/useDojoSystem";
import { useDojo } from "@/DojoContext";

export const useConfig = () => {
  const { selectedChainConfig } = useDojo();

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  const tournament = isMainnet
    ? useDojoSystem("LSTournament").contractAddress
    : useDojoSystem("tournament_mock").contractAddress;
  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(tournament)]),
    [tournament]
  );

  const config = useModel(entityId, Models.TournamentConfig);

  return {
    ethAddress: config?.eth,
    lordsAddress: config?.lords,
    lootSurvivorAddress: config?.loot_survivor,
    oracleAddress: config?.oracle,
    goldenTokenAddress: config?.golden_token,
    blobertAddress: config?.blobert,
    safeModeAddress: config?.safe_mode,
    testMode: config?.test_mode,
  };
};
