import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/buttons/Button";
import { InputTournamentModel, Models } from "@/generated/models.gen";
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
import TopScores from "@/components/create/TopScores";
import TournamentGating from "@/components/create/TournamentGating";
import TournamentEntryFee from "@/components/create/TournamentEntryFee";
import TournamentPrizes from "@/components/create/TournamentPrizes";

const Create = () => {
  const { account } = useAccount();
  const { formData } = useUIStore();

  const { tournament } = useTournamentContracts();

  useSubscribeTournamentsQuery();

  // states
  const contractEntityId = getEntityIdFromKeys([BigInt(tournament)]);
  const tournamentTotals = useModel(
    contractEntityId,
    Models.TournamentTotalsModel
  );
  const tournamentCount = tournamentTotals?.total_tournaments ?? 0n;

  const {
    createTournament,
    addPrize,
    approveERC20General,
    approveERC721General,
  } = useSystemCalls();

  const handleCreateTournament = async () => {
    const currentTime = Number(BigInt(new Date().getTime()) / 1000n + 60n);
    const tournament: InputTournamentModel = {
      tournament_id: addAddressPadding(
        bigintToHex(BigInt(tournamentCount) + 1n)
      ),
      creator: addAddressPadding(account?.address!),
      name: addAddressPadding(
        bigintToHex(stringToFelt(formData.tournamentName))
      ),
      description: formData.tournamentDescription,
      start_time: addAddressPadding(
        bigintToHex(
          formData.startTime
            ? Math.floor(
                formData.startTime.getTime() / 1000 -
                  formData.startTime.getTimezoneOffset() * 60
              )
            : 0
        )
      ),
      registration_start_time: addAddressPadding(
        bigintToHex(
          formData.registrationStartTime
            ? Math.floor(
                formData.registrationStartTime.getTime() / 1000 -
                  formData.registrationStartTime.getTimezoneOffset() * 60
              )
            : Math.floor(currentTime - new Date().getTimezoneOffset() * 60)
        )
      ),
      registration_end_time: addAddressPadding(
        bigintToHex(
          formData.registrationEndTime
            ? Math.floor(
                formData.registrationEndTime.getTime() / 1000 -
                  formData.registrationEndTime.getTimezoneOffset() * 60
              )
            : 0
        )
      ),
      end_time: addAddressPadding(
        bigintToHex(
          formData.endTime
            ? Math.floor(
                formData.endTime.getTime() / 1000 -
                  formData.endTime.getTimezoneOffset() * 60
              )
            : 0
        )
      ),
      submission_period: addAddressPadding(
        bigintToHex(formData.submissionPeriod)
      ),
      winners_count: formData.scoreboardSize,
      gated_type: formData.gatedType,
      entry_premium: formData.entryFee,
    };
    await createTournament(tournament);
    // Add prizes sequentially
    let prizeKey = 0;
    for (const prize of formData.prizes) {
      // approve tokens to be added
      if (prize.tokenDataType.activeVariant() === "erc20") {
        await approveERC20General(prize);
      } else {
        await approveERC721General(prize);
      }
      await addPrize(
        BigInt(tournamentCount) + 1n,
        feltToString(formData.tournamentName),
        prize,
        addAddressPadding(bigintToHex(prizeKey)),
        false
      );
      prizeKey++;
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full no-text-shadow">
      <div className="flex flex-row gap-20">
        <div className="w-1/2 flex flex-col gap-2">
          <TournamentDetails />
          <TournamentType />
          <TopScores />
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          <TournamentGating />
          <TournamentEntryFee />
          <TournamentPrizes />
        </div>
      </div>
      <div className="hidden sm:flex items-center justify-center">
        <Button
          size={"lg"}
          onClick={() => handleCreateTournament()}
          disabled={
            !formData.tournamentName ||
            !formData.startTime ||
            !formData.endTime ||
            !formData.submissionPeriod ||
            !formData.scoreboardSize ||
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
