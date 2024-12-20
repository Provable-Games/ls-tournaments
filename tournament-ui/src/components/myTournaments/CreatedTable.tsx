import { useMemo, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { useDojoStore } from "@/hooks/useDojoStore";
// import { useGetAccountCreatedTournamentsQuery } from "@/hooks/useSdkQueries";
import CreatedRow from "@/components/myTournaments/CreatedRow";
import Pagination from "@/components/table/Pagination";
import { useDojo } from "@/DojoContext";

const CreatedTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { account } = useAccount();
  const { nameSpace } = useDojo();
  const address = useMemo(
    () => addAddressPadding(account?.address ?? "0x0"),
    [account]
  );
  const state = useDojoStore();

  const tournamentPrizesEntities = state.getEntitiesByModel(
    nameSpace,
    "TournamentPrize"
  );

  // const { entities: tournaments, isLoading } =
  //   useGetAccountCreatedTournamentsQuery(address);
  const createdTournaments = state.getEntities((entity) => {
    const creator = entity.models[nameSpace].Tournament?.creator!;
    return creator === address;
  });

  // TODO: Remove handling of pagination within client for paginated queries
  // (get totalPages from the totals model)

  const totalPages = useMemo(() => {
    if (!createdTournaments) return 0;
    return Math.ceil(createdTournaments.length / 5);
  }, [createdTournaments]);

  const pagedTournaments = useMemo(() => {
    if (!createdTournaments) return [];
    return createdTournaments.slice((currentPage - 1) * 5, currentPage * 5);
  }, [createdTournaments, currentPage]);

  return (
    <div className="w-full flex flex-col items-center border-4 border-terminal-green/75 h-1/2">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-1/4"></div>
        <p className="text-4xl">Created Tournaments</p>
        <div className="w-1/4 flex justify-end">
          {createdTournaments && createdTournaments.length > 10 ? (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          ) : null}
        </div>
      </div>
      <div className="w-full max-h-[500px]">
        <div className="flex flex-col gap-4">
          <table className="relative w-full">
            <thead className="bg-terminal-green/75 no-text-shadow text-terminal-black text-lg h-6">
              <tr>
                <th className="px-2 text-left">Name</th>
                <th className="text-left">Entries</th>
                <th className="text-left">Start</th>
                <th className="text-left">Status</th>
                <th className="text-left">Entry Fee</th>
                <th className="text-left">Creator Fee</th>
                <th className="text-left">Prizes</th>
              </tr>
            </thead>
            <tbody>
              {createdTournaments && createdTournaments.length > 0 ? (
                pagedTournaments.map((tournament) => {
                  const tournamentModel =
                    tournament.models[nameSpace].Tournament;
                  const tournamentPrizes = tournamentPrizesEntities.filter(
                    (prize) =>
                      prize.models[nameSpace].TournamentPrize?.tournament_id ===
                      tournamentModel?.tournament_id
                  );
                  return (
                    <CreatedRow
                      key={tournament.entityId}
                      entityId={tournament.entityId}
                      tournamentId={tournamentModel?.tournament_id}
                      name={tournamentModel?.name}
                      startTime={tournamentModel?.start_time}
                      entryPremium={tournamentModel?.entry_premium}
                      prizeKeys={tournamentPrizes?.map(
                        (prize) =>
                          prize.models[nameSpace].TournamentPrize?.prize_key
                      )}
                    />
                  );
                })
              ) : (
                <div className="absolute flex items-center justify-center w-full h-full">
                  <p className="text-2xl text-center">No Created Tournaments</p>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreatedTable;
