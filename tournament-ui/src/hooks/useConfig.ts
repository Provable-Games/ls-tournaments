import { useMemo } from "react";
import {
  useSdkGetEntities,
  TournamentGetQuery,
} from "@/lib/dojo/hooks/useSdkGet";
import {
  useSdkSubscribeEntities,
  TournamentSubQuery,
} from "@/lib/dojo/hooks/useSdkSub";
import { Models } from "@/generated/models.gen";
import useModel from "@/useModel";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoSystem } from "@/hooks/useDojoSystem";
import { addAddressPadding } from "starknet";
import { useDojo } from "@/DojoContext";

export function ConfigStoreSync() {
  const { selectedChainConfig, nameSpace } = useDojo();

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  const tournament = isMainnet
    ? useDojoSystem("LSTournament").contractAddress
    : useDojoSystem("tournament_mock").contractAddress;
  const query_get: TournamentGetQuery = {
    [nameSpace]: {
      TournamentConfig: {
        $: {
          where: {
            contract: { $eq: addAddressPadding(tournament) },
          },
        },
      },
    },
  };
  const query_sub: TournamentSubQuery = {
    [nameSpace]: {
      TournamentConfig: {
        $: {
          where: {
            contract: { $is: addAddressPadding(tournament) },
          },
        },
      },
    },
  };

  useSdkGetEntities({
    query: query_get,
  });

  useSdkSubscribeEntities({
    query: query_sub,
  });
}

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
