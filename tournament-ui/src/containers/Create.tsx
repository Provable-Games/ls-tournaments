import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/buttons/Button";
import { InputTournament, Models } from "@/generated/models.gen";
import useUIStore from "@/hooks/useUIStore";
import { useSystemCalls } from "@/useSystemCalls";
import { stringToFelt, bigintToHex, feltToString } from "@/lib/utils";
import { addAddressPadding } from "starknet";
import { useSubscribeTournamentsQuery } from "@/hooks/useSdkQueries";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import useModel from "@/useModel.ts";
import TournamentDetails from "@/components/create/TournamentDetails";
import TournamentType from "@/components/create/TournamentType";
import TournamentGating from "@/components/create/TournamentGating";
import TournamentEntryFee from "@/components/create/TournamentEntryFee";
import TournamentPrizes from "@/components/create/TournamentPrizes";
import { useConfig } from "@/hooks/useConfig";

const Create = () => {
  const { account } = useAccount();
  const { createTournamentData } = useUIStore();
  const { testMode } = useConfig();

  const { tournament } = useTournamentContracts();

  useSubscribeTournamentsQuery();

  // states
  const contractEntityId = getEntityIdFromKeys([BigInt(tournament)]);
  const tournamentTotals = useModel(contractEntityId, Models.TournamentTotals);
  const tournamentCount = tournamentTotals?.total_tournaments ?? 0n;

  const {
    createTournament,
    addPrize,
    approveERC20General,
    approveERC721General,
  } = useSystemCalls();

  const handleCreateTournament = async () => {
    const currentTime = Number(BigInt(new Date().getTime()) / 1000n + 60n);
    const tournament: InputTournament = {
      tournament_id: addAddressPadding(
        bigintToHex(BigInt(tournamentCount) + 1n)
      ),
      creator: addAddressPadding(account?.address!),
      name: addAddressPadding(
        bigintToHex(stringToFelt(createTournamentData.tournamentName))
      ),
      description: createTournamentData.tournamentDescription,
      start_time: addAddressPadding(
        bigintToHex(
          createTournamentData.startTime
            ? Math.floor(
                createTournamentData.startTime.getTime() / 1000 -
                  createTournamentData.startTime.getTimezoneOffset() * 60
              )
            : 0
        )
      ),
      registration_start_time: addAddressPadding(
        bigintToHex(
          createTournamentData.registrationStartTime
            ? Math.floor(
                createTournamentData.registrationStartTime.getTime() / 1000 -
                  createTournamentData.registrationStartTime.getTimezoneOffset() *
                    60
              )
            : Math.floor(currentTime - new Date().getTimezoneOffset() * 60)
        )
      ),
      registration_end_time: addAddressPadding(
        bigintToHex(
          createTournamentData.registrationEndTime
            ? Math.floor(
                createTournamentData.registrationEndTime.getTime() / 1000 -
                  createTournamentData.registrationEndTime.getTimezoneOffset() *
                    60
              )
            : 0
        )
      ),
      end_time: addAddressPadding(
        bigintToHex(
          createTournamentData.endTime
            ? Math.floor(
                createTournamentData.endTime.getTime() / 1000 -
                  createTournamentData.endTime.getTimezoneOffset() * 60
              )
            : 0
        )
      ),
      submission_period: addAddressPadding(
        bigintToHex(createTournamentData.submissionPeriod)
      ),
      winners_count: createTournamentData.scoreboardSize,
      gated_type: createTournamentData.gatedType,
      entry_premium: createTournamentData.entryFee,
    };
    await createTournament(tournament);
    // Add prizes sequentially
    let prizeKey = 0;
    for (const prize of createTournamentData.prizes) {
      // approve tokens to be added
      if (prize.tokenDataType.activeVariant() === "erc20") {
        await approveERC20General(prize);
      } else {
        await approveERC721General(prize);
      }
      await addPrize(
        BigInt(tournamentCount) + 1n,
        feltToString(createTournamentData.tournamentName),
        prize,
        addAddressPadding(bigintToHex(prizeKey)),
        false
      );
      prizeKey++;
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full no-text-shadow p-5">
      <div className="flex flex-row gap-20">
        <div className="w-1/2 flex flex-col gap-5">
          <TournamentDetails />
          <TournamentType testMode={testMode} />
        </div>
        <div className="w-1/2 flex flex-col gap-5">
          <TournamentGating />
          <TournamentEntryFee />
          <TournamentPrizes tournamentCount={tournamentCount} />
        </div>
      </div>
      <div className="hidden sm:flex items-center justify-center">
        <Button
          size={"md"}
          onClick={() => handleCreateTournament()}
          disabled={
            !createTournamentData.tournamentName ||
            !createTournamentData.startTime ||
            !createTournamentData.endTime ||
            !createTournamentData.submissionPeriod ||
            !createTournamentData.scoreboardSize ||
            !account
          }
        >
          {account ? "Create Tournament" : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
};

export default Create;
