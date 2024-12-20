import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import useModel from "@/useModel.ts";
import { Models } from "@/generated/models.gen";
import { feltToString, formatTime, bigintToHex } from "@/lib/utils";
import { Button } from "@/components/buttons/Button.tsx";
import { addAddressPadding } from "starknet";
import {
  useGetAdventurersQuery,
  useGetTournamentDetailsQuery,
  useSubscribeTournamentDetailsQuery,
  useSubscribeTournamentDetailsAddressQuery,
} from "@/hooks/useSdkQueries.ts";
import { useDojoStore } from "@/hooks/useDojoStore.ts";
import { useLSQuery } from "@/hooks/useLSQuery";
import { getAdventurersInList } from "@/hooks/graphql/queries.ts";
import { useDojo } from "@/DojoContext.tsx";
import { Countdown } from "@/components/Countdown.tsx";
import useUIStore from "@/hooks/useUIStore";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import EntriesTable from "@/components/tournament/EntriesTable.tsx";
import GameTable from "@/components/tournament/GamesTable.tsx";
import ScoreTable from "@/components/tournament/ScoreTable.tsx";
import EnterTournament from "@/components/tournament/EnterTournament";
import StartTournament from "@/components/tournament/StartTournament";
import SubmitScores from "@/components/tournament/SubmitScores";
import ClaimPrizes from "@/components/tournament/ClaimPrizes";
import useFreeGames from "@/hooks/useFreeGames";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const { account } = useAccount();
  const { nameSpace, selectedChainConfig } = useDojo();
  const { setInputDialog } = useUIStore();
  const { usableGoldenTokens, usableBlobertTokens } = useFreeGames();

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  const state = useDojoStore((state) => state);
  const { tournament } = useTournamentContracts();

  // Data fetching
  useGetTournamentDetailsQuery(addAddressPadding(bigintToHex(id!)));
  useSubscribeTournamentDetailsQuery(addAddressPadding(bigintToHex(id!)));
  useSubscribeTournamentDetailsAddressQuery(
    addAddressPadding(bigintToHex(id!)),
    addAddressPadding(account?.address ?? "0x0")
  );
  useGetAdventurersQuery(account?.address ?? "0x0");

  // Get states
  const contractEntityId = useMemo(
    () => getEntityIdFromKeys([BigInt(tournament)]),
    [tournament]
  );
  const tournamentEntityId = useMemo(
    () => getEntityIdFromKeys([BigInt(id!)]),
    [id]
  );
  const tournamentAddressEntityId = useMemo(
    () => getEntityIdFromKeys([BigInt(id!), BigInt(account?.address ?? "0x0")]),
    [id, account?.address]
  );
  const totalsModel = useModel(contractEntityId, Models.TournamentTotals);
  const tournamentModel = useModel(tournamentEntityId, Models.Tournament);
  const tournamentEntries = useModel(
    tournamentEntityId,
    Models.TournamentEntries
  );
  const tournamentScores = useModel(
    tournamentEntityId,
    Models.TournamentScores
  );
  const tournamentEntriesAddressModel = useModel(
    tournamentAddressEntityId,
    Models.TournamentEntriesAddress
  );
  const tournamentStartsAddressModel = useModel(
    tournamentAddressEntityId,
    Models.TournamentStartsAddress
  );
  const tournamentAllEntriesEntities = state.getEntitiesByModel(
    nameSpace,
    "TournamentEntriesAddress"
  );
  const tournamentGames = state.getEntitiesByModel(nameSpace, "TournamentGame");
  const adventurersTestEntities = state.getEntitiesByModel(
    nameSpace,
    "AdventurerModel"
  );
  const tournamentPrizes = state.getEntitiesByModel(
    nameSpace,
    "TournamentPrize"
  );
  const prizesData = state.getEntitiesByModel(nameSpace, "TournamentPrize");
  const allTournamentEntries = tournamentAllEntriesEntities.filter(
    (entry: any) =>
      entry.models[nameSpace].TournamentEntriesAddress.tournament_id ===
      tournamentModel?.tournament_id
  );

  // Handle get adventurer scores fir account
  const addressGameIds = tournamentGames?.map(
    (game: any) => game.models[nameSpace].TournamentGame.game_id
  );
  const formattedGameIds = addressGameIds?.map((id: any) => Number(id));

  const adventurersListVariables = useMemo(() => {
    return {
      ids: formattedGameIds,
    };
  }, [formattedGameIds]);

  const { data: adventurersMainData } = useLSQuery(
    getAdventurersInList,
    adventurersListVariables
  );

  const adventurersData = isMainnet
    ? adventurersMainData?.adventurers
    : adventurersTestEntities;

  // Calculate dates
  const startDate = new Date(Number(tournamentModel?.start_time) * 1000);
  const endDate = new Date(Number(tournamentModel?.end_time) * 1000);
  const submissionEndDate = new Date(
    (Number(tournamentModel?.end_time) +
      Number(tournamentModel?.submission_period)) *
      1000
  );

  const started = Boolean(
    tournamentModel?.start_time && startDate.getTime() < Date.now()
  );
  const ended = Boolean(
    tournamentModel?.end_time && endDate.getTime() <= Date.now()
  );
  const submissionEnded = Boolean(
    tournamentModel?.submission_period &&
      submissionEndDate.getTime() <= Date.now()
  );

  const isLive = started && !ended;
  const isSubmissionLive = ended && !submissionEnded;

  // count calculations
  const entryCount = tournamentEntries?.entry_count ?? 0;
  const entryAddressCount = tournamentEntriesAddressModel?.entry_count ?? 0;
  const currentAddressStartCount =
    tournamentStartsAddressModel?.start_count ?? 0;

  const [countDownExpired, setCountDownExpired] = useState(false);

  const isSeason =
    tournamentModel?.start_time === tournamentModel?.registration_start_time;

  if (!tournamentModel?.tournament_id)
    return (
      <div className="flex flex-col gap-2 items-center w-full h-full justify-center py-2">
        <h1 className="text-5xl text-center uppercase">No Tournament Found</h1>
      </div>
    );
  return (
    <div className="flex flex-col gap-5 item-center w-full py-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="w-1/4"></div>
          <div className="w-1/2 flex flex-col">
            <p className="text-xl text-center text-terminal-green/75 no-text-shadow uppercase leading-none">
              Tournament Name
            </p>
            <h1 className="text-5xl text-center uppercase -mt-1 leading-none">
              {feltToString(tournamentModel?.name!)}
            </h1>
          </div>
          {isLive ? (
            <div className="w-1/4 flex flex-row gap-5 justify-end">
              {!countDownExpired ? (
                <>
                  <h2 className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                    Tournament Ends
                  </h2>
                  <Countdown
                    targetTime={endDate.getTime()}
                    countDownExpired={() => setCountDownExpired(true)}
                  />
                </>
              ) : (
                <h2 className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                  Tournament Ended
                </h2>
              )}
            </div>
          ) : isSubmissionLive ? (
            <div className="w-1/4 flex flex-row gap-5 justify-end">
              {!countDownExpired ? (
                <>
                  <h2 className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                    Submission Ends
                  </h2>
                  <Countdown
                    targetTime={
                      endDate.getTime() +
                      Number(tournamentModel?.submission_period) * 1000
                    }
                    countDownExpired={() => setCountDownExpired(true)}
                  />
                </>
              ) : (
                <h2 className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                  Submission Ended
                </h2>
              )}
            </div>
          ) : (
            <div className="w-1/4"></div>
          )}
        </div>
        <div className="relative flex flex-row gap-2 border-4 border-terminal-green/75 p-2">
          <div className="flex flex-col gap-1 w-1/3">
            <div className="flex flex-col gap-1">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Description
              </p>
              <p className="text-lg h-10">{tournamentModel?.description}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Type
              </p>
              <p className="text-xl uppercase">
                {isSeason ? "Season" : "Fixed Registration"}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Total Entries
              </p>
              <p className="text-xl">{BigInt(entryCount).toString()}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Scoreboard Size
              </p>
              <p className="text-lg uppercase">
                {BigInt(tournamentModel?.winners_count).toString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between w-1/3">
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Status
              </p>
              <p className="text-lg uppercase">
                {!started
                  ? "Upcoming"
                  : isLive
                  ? "Live"
                  : isSubmissionLive
                  ? "Submission Live"
                  : "Ended"}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Starts
              </p>
              <p className="text-lg">{startDate.toLocaleString()}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Ends
              </p>
              <p className="text-lg">{endDate.toLocaleString()}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Duration
              </p>
              <p className="text-lg uppercase">
                {formatTime(
                  Number(tournamentModel?.end_time) -
                    Number(tournamentModel?.start_time)
                )}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Submission Period
              </p>
              <p className="text-lg uppercase">
                {formatTime(Number(tournamentModel?.submission_period))}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between w-1/3">
            <div className="flex flex-col gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Prizes
              </p>
              {tournamentPrizes && tournamentPrizes.length > 0 ? (
                <p className="text-lg">
                  {tournamentPrizes?.map((prize: any) =>
                    feltToString(
                      prize.models.tournament.TournamentPrize.prize_key
                    )
                  )}
                </p>
              ) : (
                <p className="text-lg uppercase">No Prizes Added</p>
              )}
            </div>
          </div>
          {!started && (
            <div className="absolute top-2 right-2">
              <Button
                className="bg-terminal-green/25 text-terminal-green hover:text-terminal-black"
                onClick={() =>
                  setInputDialog({
                    type: "add-prize",
                    props: {
                      tournamentId: tournamentModel?.tournament_id,
                      tournamentName: feltToString(tournamentModel?.name!),
                      currentPrizeCount: totalsModel?.total_prizes,
                    },
                  })
                }
              >
                Add Prize
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-5 h-[250px]">
        {!started && !isSeason && (
          <EntriesTable tournamentEntires={allTournamentEntries} />
        )}
        {isLive && <GameTable adventurersData={adventurersData} />}
        {ended && (
          <ScoreTable
            tournamentScores={tournamentScores}
            adventurersData={adventurersData}
          />
        )}
        <div className="w-1/2 flex flex-col gap-2 border-4 border-terminal-green/75 h-[250px]">
          {!started ? (
            <EnterTournament
              tournamentModel={tournamentModel}
              tournamentEntriesAddressModel={tournamentEntriesAddressModel}
              entryCount={entryCount}
              entryAddressCount={entryAddressCount}
            />
          ) : isLive ? (
            <StartTournament
              tournamentEntriesAddressModel={tournamentEntriesAddressModel}
              tournamentModel={tournamentModel}
              currentAddressStartCount={currentAddressStartCount}
              entryAddressCount={entryAddressCount}
              entryCount={entryCount}
              usableGoldenTokens={usableGoldenTokens}
              usableBlobertTokens={usableBlobertTokens}
            />
          ) : isSubmissionLive ? (
            <SubmitScores
              tournamentModel={tournamentModel}
              tournamentEntriesAddress={tournamentEntriesAddressModel}
              currentAddressStartCount={currentAddressStartCount}
              tournamentScores={tournamentScores}
              addressGameIds={addressGameIds}
              adventurersData={adventurersData}
            />
          ) : (
            <ClaimPrizes
              tournamentPrizes={tournamentPrizes}
              tournamentModel={tournamentModel}
              prizesData={prizesData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tournament;
