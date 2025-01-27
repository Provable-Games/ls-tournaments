import { useMemo } from "react";
import { useAccount } from "@starknet-react/core";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "@/hooks/useDojoStore";
import { useDojo } from "@/DojoContext";
import { addAddressPadding, BigNumberish } from "starknet";
import {
  TournamentEntriesAddress,
  Tournament,
  TournamentScores,
  TournamentGame,
} from "@/generated/models.gen";
import { Button } from "@/components/buttons/Button";
import { useSystemCalls } from "@/useSystemCalls";
import { feltToString, bigintToHex } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ChainId } from "@/config";
import { useLSQuery } from "@/hooks/useLSQuery";
import { getAdventurersInList } from "@/hooks/graphql/queries.ts";

interface SubmitScoresProps {
  tournamentModel: Tournament;
  tournamentEntriesAddress: TournamentEntriesAddress;
  tournamentScores: TournamentScores;
  currentAddressStartCount: BigNumberish;
  tournamentGames: TournamentGame[];
  adventurersData: any;
}

const SubmitScores = ({
  tournamentModel,
  tournamentEntriesAddress,
  tournamentScores,
  currentAddressStartCount,
  tournamentGames,
  adventurersData,
}: SubmitScoresProps) => {
  const { address } = useAccount();
  const { selectedChainConfig, nameSpace } = useDojo();
  const state = useDojoStore((state) => state);
  const navigate = useNavigate();
  const { submitScores } = useSystemCalls();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  const totalGameIds = tournamentGames?.map((game: any) =>
    Number(game.game_id)
  );

  const topScoreGameIds = tournamentScores?.top_score_ids.map((id: any) =>
    Number(id)
  );

  const topScoreAdventurersListVariables = useMemo(() => {
    return {
      ids: topScoreGameIds,
    };
  }, [topScoreGameIds]);

  const { data: topScoresAdventurerMainData } = useLSQuery(
    getAdventurersInList,
    topScoreAdventurersListVariables
  );

  const topScoresAdventurerData = isMainnet
    ? topScoresAdventurerMainData?.adventurers
    : adventurersData
        ?.filter((adventurer: any) =>
          topScoreGameIds?.includes(
            Number(adventurer.models[nameSpace].AdventurerModel.adventurer_id)
          )
        )
        .map((adventurer: any) => adventurer.models[nameSpace].AdventurerModel);

  console.log(topScoresAdventurerData, topScoresAdventurerMainData);

  const testScores =
    totalGameIds?.reduce((acc: any, id: any) => {
      const adventurerEntityId = getEntityIdFromKeys([BigInt(id!)]);
      const adventurerModel =
        state.getEntity(adventurerEntityId)?.models?.[nameSpace]
          ?.AdventurerModel;
      if (adventurerModel) {
        acc.push(adventurerModel);
      }
      return acc;
    }, []) ?? [];

  const sortedTopGameIds = useMemo(() => {
    const winnersCount = tournamentModel?.winners_count;

    // Helper function to sort and slice scores
    const getTopScores = (scores: any[], isMainnet: boolean) => {
      const sorted = scores.sort((a, b) => {
        const xpA = isMainnet ? BigInt(a.xp) : BigInt(a.adventurer?.xp);
        const xpB = isMainnet ? BigInt(b.xp) : BigInt(b.adventurer?.xp);
        return Number(xpB - xpA);
      });

      return sorted
        .map((score) =>
          isMainnet ? Number(score.id) : Number(score.adventurer_id)
        )
        .slice(0, Number(winnersCount));
    };

    const currentScores = isMainnet ? adventurersData : testScores;
    const totalScores = tournamentScores
      ? [...(topScoresAdventurerData ?? []), ...(currentScores ?? [])]
      : currentScores;

    const uniqueTotalScores = Array.from(
      new Map(
        totalScores?.map((score: any) => [
          Number(isMainnet ? score.id : score.adventurer_id),
          score,
        ])
      ).values()
    );

    return getTopScores(uniqueTotalScores, isMainnet);
  }, [
    isMainnet,
    tournamentScores,
    testScores,
    adventurersData,
    topScoresAdventurerData,
    tournamentModel?.winners_count,
  ]);

  console.log(sortedTopGameIds, topScoreGameIds);

  const submittableScores = useMemo(() => {
    if (!tournamentScores) return sortedTopGameIds;

    const arraysAreEqual =
      sortedTopGameIds.length === topScoreGameIds.length &&
      sortedTopGameIds.every((id, index) => id === topScoreGameIds[index]);

    return arraysAreEqual ? [] : sortedTopGameIds;
  }, [tournamentScores, sortedTopGameIds, topScoreGameIds]);

  const addressGames = tournamentGames?.filter(
    (game: TournamentGame) =>
      game.address === addAddressPadding(address ?? "0x0")
  );

  const submittableGamesCount =
    addressGames?.reduce((count, game) => {
      const gameId = addAddressPadding(bigintToHex(BigInt(game.game_id)));
      return submittableScores.includes(Number(gameId)) ? count + 1 : count;
    }, 0) ?? 0;

  const handleSubmitScores = async () => {
    await submitScores(
      tournamentModel?.tournament_id!,
      feltToString(tournamentModel?.name!),
      submittableScores
    );
  };

  const noSubmittableScores = submittableScores.length === 0;

  const addressGameIds = tournamentGames
    ?.filter(
      (game: any) => game.address === addAddressPadding(address ?? "0x0")
    )
    .map((game: any) => Number(game.game_id));

  const addressGameIdsInTopScores =
    addressGameIds?.filter((id) => sortedTopGameIds.includes(id)).length ?? 0;

  return (
    <>
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Submit Scores</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      {address ? (
        addressGameIds.length > 0 ? (
          <div className="flex flex-row p-5 h-full items-center justify-between">
            {tournamentEntriesAddress ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <p className="whitespace-nowrap uppercase text-xl text-terminal-green/75 no-text-shadow">
                    Games Played
                  </p>
                  <p className="no-text-shadow uppercase text-2xl">
                    {BigInt(currentAddressStartCount).toString()}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <p className="whitespace-nowrap uppercase text-xl text-terminal-green/75 no-text-shadow">
                    My Top Scores
                  </p>
                  <p className="no-text-shadow uppercase text-2xl">
                    {addressGameIdsInTopScores}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <p className="whitespace-nowrap uppercase text-xl text-terminal-green/75 no-text-shadow">
                    Unsubmitted Top Scores
                  </p>
                  <p className="no-text-shadow uppercase text-2xl">
                    {submittableGamesCount}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-terminal-green/75 no-text-shadow uppercase">
                You have no entries
              </p>
            )}
            <div className="flex flex-row items-center gap-2">
              {submittableGamesCount === 0 && (
                <p className="text-terminal-green/75 no-text-shadow uppercase">
                  All scores submitted
                </p>
              )}
              <Button
                size="lg"
                onClick={handleSubmitScores}
                disabled={noSubmittableScores}
              >
                Submit Scores
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
            <p className="text-xl text-center uppercase">
              You have not started any games in this tournament. Find one to
              enter on the overview page.
            </p>
            <Button onClick={() => navigate("/")}>Go to Overview</Button>
          </div>
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center p-5">
          <p className="text-xl uppercase text-terminal-yellow no-text-shadow">
            To submit please connect your wallet
          </p>
        </div>
      )}
    </>
  );
};

export default SubmitScores;
