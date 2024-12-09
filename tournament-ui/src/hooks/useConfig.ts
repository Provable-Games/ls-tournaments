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

export function ConfigStoreSync() {
  const tournament = useDojoSystem("LSTournament").contractAddress;
  const query_get: TournamentGetQuery = {
    tournament: {
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
    tournament: {
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
  const tournament = useDojoSystem("LSTournament").contractAddress;
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
  };
};
