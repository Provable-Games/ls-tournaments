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

export const useGetTournamentCountsQuery = (contract: string) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
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
        TournamentEntries: [],
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

export const useGetUpcomingTournamentsQuery = (currentTime: string) => {
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
  });
  return { entities, isLoading, refetch };
};

export const useGetLiveTournamentsQuery = (currentTime: string) => {
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
  });
  return { entities, isLoading, refetch };
};

export const useGetEndedTournamentsQuery = (currentTime: string) => {
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
    []
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetAccountTournamentsQuery = (address: string) => {
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
        TournamentEntriesAddress: {
          $: {
            where: {
              address: { $eq: addAddressPadding(address) },
            },
          },
        },
        TournamentStartsAddress: {
          $: {
            where: {
              address: { $eq: addAddressPadding(address) },
            },
          },
        },
        TournamentStartIds: {
          $: {
            where: {
              address: { $eq: addAddressPadding(address) },
            },
          },
        },
      },
    }),
    [address]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetAccountCreatedTournamentsQuery = (address: string) => {
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
  });
  return { entities, isLoading, refetch };
};

export const useGetAccountEnteredTournamentsQuery = (address: string) => {
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
        Prizes: [],
      },
    }),
    []
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

// export const useGetTournamentListDetailsQuery = (tournamentIds: BigNumberish[]) => {
//   const query = useMemo<TournamentGetQuery>(
//     () => ({
//       tournament: {
//         TournamentModel: {
//           $: {
//             where: {
//               tournament_id: { $in: tournamentIds },
//             },
//           },
//         },
//       },
//     }),
//     [tournamentIds]
//   );

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

// TODO: Add when pagination is available

// interface PageTracker {
//   pageSize: number;
//   fetchedPages: Set<number>;
// }

// interface useGetPaginatedTournamentsQueryProps {
//   limit?: number;
//   offset?: number;
// }

// export const useGetPaginatedTournamentsQuery = ({
//   limit = 10,
//   offset = 0,
// }: useGetPaginatedTournamentsQueryProps) => {
//   const state = useDojoStore((state) => state);
//   // Track fetched pages using a ref to persist between renders
//   const pageTracker = useRef<PageTracker>({
//     pageSize: limit,
//     fetchedPages: new Set(),
//   });

//   const getCurrentPage = useCallback(() => {
//     return Math.floor(offset / limit);
//   }, [offset, limit]);

//   const isPageFetched = useCallback((page: number) => {
//     return pageTracker.current.fetchedPages.has(page);
//   }, []);

//   const currentPage = getCurrentPage();

//   // If we've already fetched this page, just get from state
//   if (isPageFetched(currentPage)) {
//     if (logging) {
//       console.log(`Page ${currentPage} already fetched, using state data`);
//     }

//     const stateEntities = state.getEntities((entity) =>
//       matchesQuery(entity, query)
//     );

//     // Apply pagination to state entities
//     const paginatedEntities = stateEntities.slice(offset, offset + limit);
//     state.setEntities(paginatedEntities);
//     return;
//   }

//   const query = useMemo<TournamentGetQuery>(
//     () => ({
//       tournament: {
//         TournamentModel: [],
//       },
//     }),
//     []
//   );
//   const { entities, isLoading, refetch } = useSdkGetEntities({
//     query,
//     limit,
//     offset,
//   });
//   const tournaments = useMemo(
//     () =>
//       _filterEntitiesByModel<models.TournamentModel>(
//         entities,
//         "TournamentModel"
//       ),
//     [entities]
//   );
//   useEffect(
//     () => console.log(`useGetTournamentsQuery()`, tournaments),
//     [tournaments]
//   );
//   return { tournaments, isLoading, refetch };
// };
