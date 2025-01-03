import { useMemo, useState } from "react";
import UpcomingRow from "@/components/overview/UpcomingRow";
import Pagination from "@/components/table/Pagination";
import { bigintToHex } from "@/lib/utils";
import { CairoOption } from "starknet";
import { Premium } from "@/generated/models.gen";
import { useGetUpcomingTournamentsQuery } from "@/hooks/useSdkQueries";

const UpcomingTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const hexTimestamp = useMemo(
    () => bigintToHex(BigInt(new Date().getTime()) / 1000n),
    []
  );
  const { entities: tournaments } =
    useGetUpcomingTournamentsQuery(hexTimestamp);

  // const tournamentIds = useMemo(() => {
  //   return (
  //     tournaments
  //       ?.map((tournament) => tournament.Tournament?.tournament_id)
  //       .filter((id): id is BigNumberish => id !== undefined) ?? []
  //   );
  // }, [tournaments]);

  // const { entities: tournamentDetails } =
  //   useGetTournamentDetailsInListQuery(tournamentIds);

  // TODO: Remove handling of pagination within client for paginated queries
  // (get totalPages from the totals model)

  const totalPages = useMemo(() => {
    if (!tournaments) return 0;
    return Math.ceil(tournaments.length / 5);
  }, [tournaments]);

  const pagedTournaments = useMemo(() => {
    if (!tournaments) return [];
    return tournaments.slice((currentPage - 1) * 5, currentPage * 5);
  }, [tournaments, currentPage]);

  return (
    <div className="w-full flex flex-col items-center border-4 border-terminal-green/75 h-1/2">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-1/4"></div>
        <p className="w-1/2 text-4xl text-center">Upcoming</p>
        <div className="w-1/4 flex justify-end">
          {tournaments && tournaments.length > 10 && (
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
          {tournaments && tournaments.length > 0 ? (
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
                {pagedTournaments.map((tournament) => {
                  return (
                    <UpcomingRow
                      key={tournament.entityId}
                      tournamentId={tournament.Tournament?.tournament_id}
                      name={tournament.Tournament?.name}
                      registrationStartTime={
                        tournament.Tournament?.registration_start_time
                      }
                      registrationEndTime={
                        tournament.Tournament?.registration_end_time
                      }
                      startTime={tournament.Tournament?.start_time}
                      endTime={tournament.Tournament?.end_time}
                      entryPremium={
                        tournament.Tournament
                          ?.entry_premium as unknown as CairoOption<Premium>
                      }
                    />
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-terminal-yellow">
              <p className="text-2xl text-center">No Upcoming Tournaments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTable;
