import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import useModel from "@/useModel.ts";
import { Models } from "@/generated/models.gen";
import { feltToString, formatTime, bigintToHex } from "@/lib/utils";
import { Button } from "@/components/buttons/Button.tsx";
import { addAddressPadding, CairoCustomEnum } from "starknet";
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
import PrizesDisplay from "@/components/tournament/PrizesDisplay";
import { TournamentPrize, TokenDataTypeEnum } from "@/generated/models.gen";
import { ChainId } from "@/config";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const { address } = useAccount();
  const { nameSpace, selectedChainConfig } = useDojo();
  const { setInputDialog } = useUIStore();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;
  const isDsTournament = import.meta.env.VITE_DS_TOURNAMENT === "true";

  const state = useDojoStore((state) => state);
  const { tournament } = useTournamentContracts();

  // Data fetching
  const { entities: tournamentDetails } = useGetTournamentDetailsQuery(
    addAddressPadding(bigintToHex(id!))
  );
  useSubscribeTournamentDetailsQuery(addAddressPadding(bigintToHex(id!)));
  useSubscribeTournamentDetailsAddressQuery(
    addAddressPadding(bigintToHex(id!)),
    addAddressPadding(address ?? "0x0")
  );
  useGetAdventurersQuery(address ?? "0x0");

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
    () => getEntityIdFromKeys([BigInt(id!), BigInt(address ?? "0x0")]),
    [id, address]
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
  console.log(tournamentAddressEntityId);
  const tournamentStartsAddressModel = useModel(
    tournamentAddressEntityId,
    Models.TournamentStartsAddress
  );
  console.log(tournamentStartsAddressModel);
  const tournamentAllEntriesEntities = state.getEntitiesByModel(
    nameSpace,
    "TournamentEntriesAddress"
  );
  const tournamentGames = state.getEntitiesByModel(nameSpace, "TournamentGame");
  console.log(tournamentGames);
  const adventurersTestEntities = state.getEntitiesByModel(
    nameSpace,
    "AdventurerModel"
  );
  const tokens = state.getEntitiesByModel(nameSpace, "Token");
  const allTournamentEntries = tournamentAllEntriesEntities.filter(
    (entry: any) =>
      entry.models[nameSpace].TournamentEntriesAddress.tournament_id ===
      tournamentModel?.tournament_id
  );

  // Handle get adventurer scores fir account
  const tournamentGameModels = tournamentGames
    ?.filter(
      (game: any) =>
        game.models[nameSpace].TournamentGame.tournament_id ===
        tournamentModel?.tournament_id
    )
    .map((game: any) => game.models[nameSpace].TournamentGame);
  const formattedGameIds = tournamentGameModels?.map((game: any) =>
    Number(game.game_id)
  );

  console.log(formattedGameIds);

  const adventurersListVariables = useMemo(() => {
    return {
      ids: formattedGameIds,
    };
  }, [formattedGameIds]);

  console.log(adventurersListVariables);

  const { data: adventurersMainData, refetch } = useLSQuery(
    getAdventurersInList,
    adventurersListVariables
  );

  useEffect(() => {
    refetch();
  }, [adventurersListVariables, refetch]);

  // todo need to pull the data when tournament games is updated
  const adventurersData = isMainnet
    ? adventurersMainData?.adventurers
    : adventurersTestEntities;

  // Calculate dates
  const registrationEndDate = new Date(
    Number(tournamentModel?.registration_end_time) * 1000
  );
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

  const prizes: TournamentPrize[] = (tournamentDetails
    ?.filter((detail) => detail.TournamentPrize)
    .map((detail) => detail.TournamentPrize) ??
    []) as unknown as TournamentPrize[];

  const hasEntryPremium = tournamentModel?.entry_premium.isSome();

  const premiumPrizes = useMemo(() => {
    if (!hasEntryPremium) return [];

    const entryPremium = tournamentModel?.entry_premium.unwrap();

    const totalPremiumAmount =
      BigInt(entryPremium?.token_amount!) * BigInt(entryCount);

    if (totalPremiumAmount === 0n) return [];

    return entryPremium?.token_distribution
      .map((distribution, index) => {
        if (distribution === 0) return null;
        const tokenDataType = new CairoCustomEnum({
          erc20: {
            token_amount: addAddressPadding(
              bigintToHex((totalPremiumAmount * BigInt(distribution)) / 100n)
            ),
          },
          erc721: undefined,
        }) as TokenDataTypeEnum;
        return {
          tournament_id: tournamentModel.tournament_id,
          payout_position: index + 1,
          prize_key: "",
          claimed: false,
          token: entryPremium.token,
          token_data_type: tokenDataType,
        };
      })
      .filter((prize): prize is NonNullable<typeof prize> => prize !== null);
  }, [hasEntryPremium, tournamentModel, entryCount]);

  const allPrizes = useMemo(() => {
    // Create a map using a unique key combination to identify duplicates
    const uniquePrizes = new Map(
      [...prizes, ...(premiumPrizes || [])].map((prize) => [
        // Use combination of relevant properties as key
        `${prize.payout_position}-${prize.token}-${JSON.stringify(
          prize.token_data_type
        )}`,
        prize,
      ])
    );

    return Array.from(uniquePrizes.values());
  }, [prizes, premiumPrizes]);

  const groupedPrizes = useMemo(() => {
    return allPrizes.reduce(
      (acc, prize) => {
        const position = prize.payout_position.toString();
        if (!acc[position]) {
          acc[position] = {
            payout_position: position,
            tokens: {} as Record<
              string,
              {
                type: "erc20" | "erc721";
                values: string[];
                address: string;
              }
            >,
          };
        }

        const tokenModel = tokens.find(
          (t) => t.models[nameSpace].Token?.token === prize.token
        )?.models[nameSpace].Token;

        const tokenSymbol = tokenModel?.symbol!;
        if (!acc[position].tokens[tokenSymbol]) {
          acc[position].tokens[tokenSymbol] = {
            type: prize.token_data_type.variant.erc721 ? "erc721" : "erc20",
            values: [],
            address: prize.token,
          };
        }

        if (prize.token_data_type.variant.erc721) {
          acc[position].tokens[tokenSymbol].values.push(
            `#${Number(
              prize.token_data_type.variant.erc721.token_id!
            ).toString()}`
          );
        } else if (prize.token_data_type.variant.erc20) {
          acc[position].tokens[tokenSymbol].values.push(
            (
              BigInt(prize.token_data_type.variant.erc20.token_amount) /
              10n ** 18n
            ).toString()
          );
        }

        return acc;
      },
      {} as Record<
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
      >
    );
  }, [allPrizes]);

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
          <div className="w-1/4 flex border border-2 border-terminal-green/75 items-center justify-end h-[70px] p-2 pt-4">
            {!started && !isSeason ? (
              <div className="w-full flex flex-row items-center gap-5">
                {!countDownExpired ? (
                  <>
                    <h2 className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                      Registration Ends
                    </h2>
                    <Countdown
                      targetTime={registrationEndDate.getTime()}
                      countDownExpired={() => setCountDownExpired(true)}
                    />
                  </>
                ) : (
                  <h2 className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                    Registration Closed
                  </h2>
                )}
              </div>
            ) : isLive ? (
              <div className="flex flex-row gap-5">
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
              <div className="flex flex-row gap-5">
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
              <h2 className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                Submission Ended
              </h2>
            )}
          </div>
        </div>
        <div className="relative flex flex-row gap-2 border-4 border-terminal-green/75 h-[200px] p-2">
          <div className="flex flex-col gap-1 w-1/3">
            <div className="flex flex-col gap-1">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Description
              </p>
              <p className="text-lg h-10 overflow-scroll item-scroll">
                {tournamentModel?.description}
              </p>
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
            <div className="flex flex-col h-full gap-2">
              <p className="text-xl text-terminal-green/75 no-text-shadow uppercase">
                Prizes
              </p>
              {prizes && prizes.length > 0 ? (
                <PrizesDisplay prizes={groupedPrizes} />
              ) : (
                <p className="text-lg uppercase">No Prizes Added</p>
              )}
            </div>
          </div>
          {!ended && !isDsTournament && (
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
        {isLive && (
          <GameTable
            adventurersData={adventurersData}
            tournamentGames={tournamentGameModels}
          />
        )}
        {ended && (
          <ScoreTable
            tournamentScores={tournamentScores}
            adventurersData={adventurersData}
            prizes={groupedPrizes}
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
              isSeason={isSeason}
            />
          ) : isSubmissionLive ? (
            <SubmitScores
              tournamentModel={tournamentModel}
              tournamentEntriesAddress={tournamentEntriesAddressModel}
              currentAddressStartCount={currentAddressStartCount}
              tournamentScores={tournamentScores}
              tournamentGames={tournamentGameModels}
              adventurersData={adventurersData}
            />
          ) : (
            <ClaimPrizes
              tournamentPrizes={prizes}
              tournamentModel={tournamentModel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tournament;
