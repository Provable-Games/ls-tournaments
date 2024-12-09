import { useMemo, useState } from "react";
import { useGetLiveTournamentsQuery } from "@/hooks/useSdkQueries";
import LiveRow from "@/components/overview/LiveRow";
import Pagination from "@/components/table/Pagination";

const LiveTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const hexTimestamp = (BigInt(new Date().getTime()) / 1000n).toString(16);
  const { entities: tournaments, isLoading } =
    useGetLiveTournamentsQuery(hexTimestamp);

  const totalPages = useMemo(() => {
    if (!tournaments) return 0;
    return Math.ceil(tournaments.length / 5);
  }, [tournaments]);

  const pagedTournaments = useMemo(() => {
    if (!tournaments) return [];
    return tournaments.slice((currentPage - 1) * 5, currentPage * 5);
  }, [tournaments, currentPage]);

  return (
    <div className="flex flex-col items-center border-4 border-terminal-green/75 h-1/2">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-1/4"></div>
        <p className="w-1/2 text-4xl text-center">Live</p>
        {tournaments && tournaments.length > 10 ? (
          <div className="w-1/4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        ) : (
          <div className="w-1/4"></div>
        )}
      </div>
      <div className="w-full max-h-[500px]">
        <div className="flex flex-col gap-4">
          <table className="relative w-full">
            <thead className="bg-terminal-green/75 no-text-shadow text-terminal-black text-lg h-8">
              <tr>
                <th className="px-2 text-left">Name</th>
                <th className="text-left">Games Played</th>
                <th className="text-left">Top Scores</th>
                <th className="text-left">Prizes</th>
                <th className="text-left">Time Left</th>
              </tr>
            </thead>
            <tbody>
              {tournaments && tournaments.length > 0 ? (
                pagedTournaments.map((tournament) => {
                  const tournamentModel = tournament.TournamentModel;
                  return (
                    <LiveRow
                      key={tournament.entityId}
                      tournamentId={tournamentModel?.tournament_id}
                      name={tournamentModel?.name}
                      endTime={tournamentModel?.end_time}
                      winnersCount={tournamentModel?.winners_count}
                    />
                  );
                })
              ) : isLoading ? (
                <div className="absolute flex items-center justify-center w-full h-full">
                  <p className="text-2xl text-center">Loading...</p>
                </div>
              ) : (
                <div className="absolute flex items-center justify-center w-full h-full">
                  <p className="text-2xl text-center">No Live Tournaments</p>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveTable;
