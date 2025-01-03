import { useMemo, useState } from "react";
import LiveRow from "@/components/overview/LiveRow";
import Pagination from "@/components/table/Pagination";
import { useDojoStore } from "@/hooks/useDojoStore";
import { bigintToHex } from "@/lib/utils";
import { addAddressPadding } from "starknet";
import { useDojo } from "@/DojoContext";

const LiveTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { nameSpace } = useDojo();
  const hexTimestamp = bigintToHex(BigInt(new Date().getTime()) / 1000n);
  const state = useDojoStore((state) => state);
  const liveTournaments = state.getEntities((entity) => {
    const startTime = entity.models?.[nameSpace]?.Tournament?.start_time!;
    const endTime = entity.models?.[nameSpace]?.Tournament?.end_time!;
    return (
      startTime < addAddressPadding(hexTimestamp) &&
      endTime > addAddressPadding(hexTimestamp)
    );
  });

  const totalPages = useMemo(() => {
    if (!liveTournaments) return 0;
    return Math.ceil(liveTournaments.length / 5);
  }, [liveTournaments]);

  const pagedTournaments = useMemo(() => {
    if (!liveTournaments) return [];
    return liveTournaments.slice((currentPage - 1) * 5, currentPage * 5);
  }, [liveTournaments, currentPage]);

  return (
    <div className="flex flex-col items-center border-4 border-terminal-green/75 h-1/2">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-1/4"></div>
        <p className="w-1/2 text-4xl text-center">Live</p>
        {liveTournaments && liveTournaments.length > 10 ? (
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
                <th className="text-left">Prizes</th>
                <th className="text-left">Time Left</th>
              </tr>
            </thead>
            <tbody>
              {liveTournaments && liveTournaments.length > 0 ? (
                pagedTournaments.map((tournament) => {
                  const tournamentModel =
                    tournament.models[nameSpace].Tournament;
                  return (
                    <LiveRow
                      key={tournament.entityId}
                      tournamentId={tournamentModel?.tournament_id}
                      name={tournamentModel?.name}
                      endTime={tournamentModel?.end_time}
                    />
                  );
                })
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
