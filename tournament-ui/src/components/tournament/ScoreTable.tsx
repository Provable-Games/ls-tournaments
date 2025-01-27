import { useMemo, useState } from "react";
import Pagination from "@/components/table/Pagination";
import ScoreRow from "@/components/tournament/ScoreRow";
import { useDojo } from "@/DojoContext";
import { ChainId } from "@/config";
import { useLSQuery } from "@/hooks/useLSQuery";
import { getAdventurersInList } from "@/hooks/graphql/queries.ts";

interface ScoreTableProps {
  tournamentScores: any;
  adventurersData: any;
  prizes: Record<
    string,
    {
      payout_position: string;
      tokens: Record<
        string,
        {
          type: "erc20" | "erc721";
          values: string[];
          address: string;
        }
      >;
    }
  >;
}

const ScoreTable = ({
  tournamentScores,
  adventurersData,
  prizes,
}: ScoreTableProps) => {
  const { selectedChainConfig, nameSpace } = useDojo();
  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => {
    if (!tournamentScores) return 0;
    return Math.ceil(tournamentScores.top_score_ids.length / 5);
  }, [tournamentScores]);

  const pagedScores = useMemo(() => {
    if (!tournamentScores) return [];
    return tournamentScores.top_score_ids.slice(
      (currentPage - 1) * 5,
      currentPage * 5
    );
  }, [tournamentScores, currentPage]);

  const adventurersListVariables = useMemo(() => {
    return {
      ids: pagedScores,
    };
  }, [tournamentScores, currentPage]);

  const { data: adventurersMainData } = useLSQuery(
    getAdventurersInList,
    adventurersListVariables
  );

  const adventurersMain = adventurersMainData
    ? adventurersMainData.adventurers
    : [];

  return (
    <div className="w-1/2 flex flex-col border-4 border-terminal-green/75">
      {tournamentScores && tournamentScores.top_score_ids.length > 0 ? (
        <>
          <div className="flex flex-row items-center justify-between w-full">
            <div className="w-1/4"></div>
            <p className="w-1/2 text-4xl text-center uppercase">Scores</p>
            <div className="w-1/4 flex justify-end">
              {tournamentScores &&
                tournamentScores.top_score_ids.length > 5 && (
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
                <th className="text-left">Prizes</th>
              </tr>
            </thead>
            <tbody>
              {tournamentScores &&
                tournamentScores.top_score_ids.length > 0 &&
                pagedScores.map((gameId: any, index: any) => {
                  const adventurer = isMainnet
                    ? adventurersMain?.find(
                        (adventurer: any) => adventurer.id === gameId
                      )
                    : adventurersData.find(
                        (entity: any) =>
                          Number(
                            entity.models[nameSpace].AdventurerModel
                              .adventurer_id
                          ) === gameId
                      );
                  const prizesForPosition = Object.values(prizes).find(
                    (prize) =>
                      prize.payout_position ===
                      String(index + (currentPage - 1) * 5 + 1)
                  );
                  return (
                    <ScoreRow
                      key={index}
                      rank={index + (currentPage - 1) * 5 + 1}
                      adventurer={adventurer}
                      prizes={prizesForPosition}
                    />
                  );
                })}
            </tbody>
          </table>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl uppercase">
            Tournament has no scores submitted
          </p>
        </div>
      )}
    </div>
  );
};

export default ScoreTable;
