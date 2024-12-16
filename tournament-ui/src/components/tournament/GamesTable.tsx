import { useMemo, useState } from "react";
import Pagination from "@/components/table/Pagination";
import GameRow from "@/components/tournament/GameRow";
import { useDojo } from "@/DojoContext";

interface GamesTableProps {
  adventurersData: any;
}

const GamesTable = ({ adventurersData }: GamesTableProps) => {
  const {
    setup: { selectedChainConfig },
  } = useDojo();
  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => {
    if (!adventurersData) return 0;
    return Math.ceil(adventurersData.length / 10);
  }, [adventurersData]);

  const pagedAdventurers = useMemo(() => {
    if (!adventurersData) return [];
    return adventurersData.slice((currentPage - 1) * 10, currentPage * 10);
  }, [adventurersData, currentPage]);

  return (
    <div className="w-1/2 flex flex-col border-4 border-terminal-green/75">
      {adventurersData && adventurersData.length > 0 ? (
        <>
          <div className="flex flex-row items-center justify-between w-full">
            <div className="w-1/4"></div>
            <p className="w-1/2 text-4xl text-center uppercase">
              Games In Play
            </p>
            <div className="w-1/4 flex justify-end">
              {adventurersData && adventurersData.length > 10 && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-terminal-green/75 text-terminal-black text-lg h-10 uppercase">
              <tr>
                <th className="text-center">Name</th>
                <th className="text-left">Address</th>
                <th className="text-left">ID</th>
                <th className="text-left">Level</th>
                <th className="text-left">XP</th>
                <th className="text-left">Health</th>
              </tr>
            </thead>
            <tbody>
              {adventurersData &&
                adventurersData.length > 0 &&
                pagedAdventurers.map((data: any, index: any) => {
                  const adventurer = isMainnet
                    ? data
                    : data.models.tournament.AdventurerModel;
                  return (
                    <GameRow
                      key={index}
                      rank={index + 1}
                      adventurer={adventurer}
                    />
                  );
                })}
            </tbody>
          </table>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl uppercase">Tournament has no games played</p>
        </div>
      )}
    </div>
  );
};

export default GamesTable;
