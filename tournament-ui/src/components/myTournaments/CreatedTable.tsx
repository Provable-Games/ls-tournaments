import { useMemo, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding, CairoOption } from "starknet";
import { useGetAccountCreatedTournamentsQuery } from "@/hooks/useSdkQueries";
import CreatedRow from "@/components/myTournaments/CreatedRow";
import Pagination from "@/components/table/Pagination";
import { Premium } from "@/generated/models.gen";

const CreatedTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { address } = useAccount();
  const formattedAddress = useMemo(
    () => addAddressPadding(address ?? "0x0"),
    [address]
  );

  const { entities: tournaments } = useGetAccountCreatedTournamentsQuery(
    formattedAddress,
    5,
    (currentPage - 1) * 5
  );

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
        <p className="text-4xl">Created Tournaments</p>
        <div className="w-1/4 flex justify-end">
          {tournaments && tournaments.length > 5 ? (
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
              {tournaments && tournaments.length > 0 ? (
                pagedTournaments.map((tournament) => {
                  return (
                    <CreatedRow
                      key={tournament.entityId}
                      entityId={tournament.entityId}
                      tournamentId={tournament.Tournament?.tournament_id}
                      name={tournament.Tournament?.name}
                      startTime={tournament.Tournament?.start_time}
                      entryPremium={
                        tournament.Tournament
                          ?.entry_premium as unknown as CairoOption<Premium>
                      }
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
