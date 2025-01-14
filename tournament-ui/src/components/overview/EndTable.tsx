import { useMemo, useState } from "react";
import { useGetEndedTournamentsQuery } from "@/hooks/useSdkQueries";
import EndRow from "@/components/overview/EndRow";
import Pagination from "@/components/table/Pagination";
import { bigintToHex } from "@/lib/utils";

const EndTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const hexTimestamp = useMemo(() => {
    return bigintToHex(BigInt(new Date().getTime()) / 1000n);
  }, []);
  const { entities: endedTournaments } = useGetEndedTournamentsQuery(
    hexTimestamp,
    5,
    (currentPage - 1) * 5
  );

  const totalPages = useMemo(() => {
    if (!endedTournaments) return 0;
    return Math.ceil(endedTournaments.length / 5);
  }, [endedTournaments]);

  const pagedTournaments = useMemo(() => {
    if (!endedTournaments) return [];
    return endedTournaments.slice((currentPage - 1) * 5, currentPage * 5);
  }, [endedTournaments, currentPage]);

  return (
    <div className="flex flex-col items-center border-4 border-terminal-green/75 h-1/2">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-1/4"></div>
        <p className="w-1/2 text-4xl text-center">Ended</p>
        {endedTournaments && endedTournaments.length > 5 ? (
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
                <th className="text-left">Status</th>
                <th className="text-left">Prizes</th>
              </tr>
            </thead>
            <tbody>
              {endedTournaments && endedTournaments.length > 0 ? (
                pagedTournaments.map((tournament) => {
                  const tournamentModel = tournament.Tournament;
                  return (
                    <EndRow
                      key={tournament.entityId}
                      tournamentId={tournamentModel?.tournament_id}
                      name={tournamentModel?.name}
                      winnersCount={tournamentModel?.winners_count}
                      endTime={tournamentModel?.end_time}
                      submissionPeriod={tournamentModel?.submission_period}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="h-full">
                    <div className="flex items-center justify-center w-full h-full">
                      <p className="text-2xl text-center">
                        No Ended Tournaments
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EndTable;
