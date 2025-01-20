import { useMemo } from "react";
import {
  useSdkGetEntities,
  TournamentGetQuery,
} from "@/lib/dojo/hooks/useSdkGet";
import {
  useSdkSubscribeEntities,
  TournamentSubQuery,
} from "@/lib/dojo/hooks/useSdkSub";
import { addAddressPadding, BigNumberish } from "starknet";
import { useDojo } from "@/DojoContext";

//
// Getters
//

// Tournament

export const useGetConfigQuery = (contract: string) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        TournamentConfig: {
          $: {
            where: {
              contract: { $eq: addAddressPadding(contract) },
            },
          },
        },
      },
    }),
    []
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  const entity = useMemo(
    () => (Array.isArray(entities) ? entities[0] : entities),
    [entities]
  );
  return { entity, isLoading, refetch };
};

export const useGetTournamentCountsQuery = (contract: string) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        TournamentTotals: {
          $: {
            where: {
              contract: { $eq: addAddressPadding(contract) },
            },
          },
        },
      },
    }),
    []
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  const entity = useMemo(
    () => (Array.isArray(entities) ? entities[0] : entities),
    [entities]
  );
  return { entity, isLoading, refetch };
};

export const useGetAllTournamentsQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: [],
      },
    }),
    []
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetAllEntriesQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        TournamentEntries: [],
      },
    }),
    []
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetAllPrizesQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        TournamentPrize: [],
      },
    }),
    []
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetUpcomingTournamentsQuery = (
  currentTime: string,
  limit: number,
  offset: number
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              start_time: { $gt: addAddressPadding(currentTime) },
            },
          },
        },
      },
    }),
    [currentTime]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    orderBy: [
      {
        model: `${nameSpace}-Tournament`,
        member: "start_time",
        direction: "Asc",
      },
    ],
    limit: limit,
    offset: offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentDetailsInListQuery = (
  tournamentIds: BigNumberish[]
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        TournamentPrize: {
          $: {
            where: {
              tournament_id: { $in: tournamentIds },
            },
          },
        },
        TournamentEntries: {
          $: {
            where: {
              tournament_id: { $in: tournamentIds },
            },
          },
        },
      },
    }),
    [tournamentIds]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetLiveTournamentsQuery = (
  currentTime: string,
  limit: number,
  offset: number
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              And: [
                { start_time: { $lt: addAddressPadding(currentTime) } },
                { end_time: { $gt: addAddressPadding(currentTime) } },
              ],
            },
          },
        },
      },
    }),
    []
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    orderBy: [
      {
        model: `${nameSpace}-Tournament`,
        member: "end_time",
        direction: "Asc",
      },
    ],
    limit: limit,
    offset: offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetEndedTournamentsQuery = (
  currentTime: string,
  limit: number,
  offset: number
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              end_time: { $lt: addAddressPadding(currentTime) },
            },
          },
        },
      },
    }),
    [nameSpace, currentTime]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    orderBy: [
      {
        model: `${nameSpace}-Tournament`,
        member: "end_time",
        direction: "Desc",
      },
    ],
    limit: limit,
    offset: offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetAccountTournamentsQuery = (
  address: string,
  limit: number,
  offset: number
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              creator: { $eq: addAddressPadding(address) },
            },
          },
        },
      },
    }),
    [address]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    orderBy: [
      {
        model: "Tournament",
        member: "startTime",
        direction: "Desc",
      },
    ],
    limit: limit,
    offset: offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetAccountCreatedTournamentsQuery = (
  address: string,
  limit: number,
  offset: number
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              creator: { $eq: addAddressPadding(address) },
            },
          },
        },
      },
    }),
    [address]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    orderBy: [
      {
        model: `${nameSpace}-Tournament`,
        member: "start_time",
        direction: "Desc",
      },
    ],
    limit: limit,
    offset: offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetAccountEnteredTournamentsQuery = (
  address: string
  // limit: number,
  // offset: number
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        TournamentEntriesAddress: {
          $: {
            where: {
              address: { $eq: addAddressPadding(address) },
            },
          },
        },
        // TournamentEntriesAddress: [],
      },
    }),
    [address]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentDetailsQuery = (tournamentId: BigNumberish) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentEntriesAddress: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentEntries: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentGame: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentScores: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentPrize: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
      },
    }),
    [tournamentId]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTokensQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Token: [],
      },
    }),
    []
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

// Loot Survivor

export const useGetAdventurersQuery = (address: BigNumberish) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        AdventurerModel: [],
        TournamentGame: {
          $: {
            where: {
              address: { $eq: addAddressPadding(address) },
            },
          },
        },
      },
    }),
    []
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

//
// Subscriptions
//

export const useSubscribeTournamentCountsQuery = (contract: string) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        TournamentTotals: {
          $: {
            where: {
              contract: { $is: addAddressPadding(contract) },
            },
          },
        },
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeTournamentsQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        Tournament: [],
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribePrizesQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        TournamentPrize: [],
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeTournamentDetailsQuery = (
  tournamentId: BigNumberish
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        TournamentEntries: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentGame: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentPrize: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
            },
          },
        },
        Tournament: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentScores: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentEntriesAddress: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
            },
          },
        },
        TournamentStartsAddress: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
            },
          },
        },
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeTournamentDetailsAddressQuery = (
  tournamentId: BigNumberish,
  address: BigNumberish
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        TournamentEntriesAddress: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
              address: { $is: addAddressPadding(address) },
            },
          },
        },
        TournamentStartsAddress: {
          $: {
            where: {
              tournament_id: { $is: addAddressPadding(tournamentId) },
              address: { $is: addAddressPadding(address) },
            },
          },
        },
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeTokensQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        Token: [],
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};
