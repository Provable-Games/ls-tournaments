import { useMemo, useState } from "react";
// import { useGetUpcomingTournamentsQuery } from "@/hooks/useSdkQueries";
import UpcomingRow from "@/components/overview/UpcomingRow";
import Pagination from "@/components/table/Pagination";
import { useDojoStore } from "@/hooks/useDojoStore";
import { bigintToHex } from "@/lib/utils";
import { addAddressPadding } from "starknet";

const UpcomingTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const hexTimestamp = useMemo(
    () => bigintToHex(BigInt(new Date().getTime()) / 1000n),
    []
  );
  // const { entities: tournaments, isLoading } =
  //   useGetUpcomingTournamentsQuery(hexTimestamp);
  const state = useDojoStore();
  const upcomingTournaments = state.getEntities((entity) => {
    const startTime = entity.models.tournament.TournamentModel?.start_time!;
    return startTime > addAddressPadding(hexTimestamp);
  });

  // TODO: Remove handling of pagination within client for paginated queries
  // (get totalPages from the totals model)

  const totalPages = useMemo(() => {
    if (!upcomingTournaments) return 0;
    return Math.ceil(upcomingTournaments.length / 5);
  }, [upcomingTournaments]);

  const pagedTournaments = useMemo(() => {
    if (!upcomingTournaments) return [];
    return upcomingTournaments.slice((currentPage - 1) * 5, currentPage * 5);
  }, [upcomingTournaments, currentPage]);

  return (
    <div className="w-full flex flex-col items-center border-4 border-terminal-green/75 h-1/2">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-1/4"></div>
        <p className="w-1/2 text-4xl text-center">Upcoming</p>
        <div className="w-1/4 flex justify-end">
          {upcomingTournaments && upcomingTournaments.length > 10 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
      <div className="w-full max-h-[500px]">
        <div className="flex flex-col gap-4">
          <table className="relative w-full">
            <thead className="bg-terminal-green/75 no-text-shadow text-terminal-black text-lg h-10">
              <tr>
                <th className="px-2 text-left">Name</th>
                <th className="text-left">Entries</th>
                <th className="text-left">Start</th>
                <th className="text-left">Registration</th>
                <th className="text-left">Duration</th>
                <th className="text-left">Entry Fee</th>
                <th className="text-left">Creator Fee</th>
                <th className="text-left">Prizes</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTournaments && upcomingTournaments.length > 0 ? (
                pagedTournaments.map((tournament) => {
                  const tournamentModel =
                    tournament.models.tournament.TournamentModel;
                  const tournamentPrizeKeys =
                    tournament.models.tournament.TournamentPrizeKeysModel;
                  return (
                    <UpcomingRow
                      key={tournament.entityId}
                      tournamentId={tournamentModel?.tournament_id}
                      name={tournamentModel?.name}
                      registrationStartTime={
                        tournamentModel?.registration_start_time
                      }
                      registrationEndTime={
                        tournamentModel?.registration_end_time
                      }
                      startTime={tournamentModel?.start_time}
                      endTime={tournamentModel?.end_time}
                      entryPremium={tournamentModel?.entry_premium}
                      prizeKeys={tournamentPrizeKeys?.prize_keys}
                    />
                  );
                })
              ) : (
                <div className="absolute flex items-center justify-center w-full h-full">
                  <p className="text-2xl text-center">
                    No Upcoming Tournaments
                  </p>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTable;
