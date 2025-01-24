import { useMemo, useState } from "react";
import Pagination from "@/components/table/Pagination";
import GameRow from "@/components/tournament/GameRow";

interface GamesTableProps {
  adventurersData: any;
  tournamentGames: any;
}

const GamesTable = ({ adventurersData, tournamentGames }: GamesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => {
    if (!tournamentGames) return 0;
    return Math.ceil(tournamentGames.length / 5);
  }, [tournamentGames]);

  const pagedAdventurers = useMemo(() => {
    if (!adventurersData) return [];
    return adventurersData.slice((currentPage - 1) * 5, currentPage * 5);
  }, [adventurersData, currentPage]);

  return (
    <div className="w-1/2 flex flex-col border-4 border-terminal-green/75">
      {tournamentGames && tournamentGames.length > 0 ? (
        <>
          <div className="flex flex-row items-center justify-between w-full">
            <div className="w-1/4"></div>
            <p className="w-1/2 text-4xl text-center uppercase">
              Games In Play
            </p>
            <div className="w-1/4 flex justify-end">
              {tournamentGames && tournamentGames.length > 5 && (
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
                <th className="text-center">Rank</th>
                <th className="text-left">Name</th>
                <th className="text-left">Address</th>
                <th className="text-left">ID</th>
                <th className="text-left">Level</th>
                <th className="text-left">XP</th>
                <th className="text-left">Health</th>
              </tr>
            </thead>
            <tbody>
              {tournamentGames &&
                tournamentGames.length > 0 &&
                pagedAdventurers.map((adventurer: any, index: any) => {
                  return (
                    <GameRow
                      key={index}
                      rank={index + (currentPage - 1) * 5 + 1}
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
