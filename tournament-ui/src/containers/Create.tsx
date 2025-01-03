import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/buttons/Button";
import { Tournament, Models } from "@/generated/models.gen";
import useUIStore from "@/hooks/useUIStore";
import { useSystemCalls } from "@/useSystemCalls";
import { stringToFelt, bigintToHex } from "@/lib/utils";
import { addAddressPadding } from "starknet";
import {
  useSubscribeTournamentsQuery,
  useSubscribePrizesQuery,
} from "@/hooks/useSdkQueries";
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
  const { createTournamentData, resetCreateTournamentData } = useUIStore();
  const { testMode } = useConfig();

  const { tournament } = useTournamentContracts();

  useSubscribeTournamentsQuery();
  useSubscribePrizesQuery();

  // states
  const contractEntityId = getEntityIdFromKeys([BigInt(tournament)]);
  const tournamentTotals = useModel(contractEntityId, Models.TournamentTotals);
  const tournamentCount = tournamentTotals?.total_tournaments ?? 0n;
  const prizeCount = tournamentTotals?.total_prizes ?? 0n;

  console.log(createTournamentData);

  const {
    createTournament,
    createTournamentAndAddPrizes,
    approveERC20Multiple,
  } = useSystemCalls();

  const handleCreateTournament = async () => {
    const currentTime = Number(BigInt(new Date().getTime()) / 1000n + 60n);
    const tournament: Tournament = {
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
    if (createTournamentData.prizes.length > 0) {
      const tokens = createTournamentData.prizes.map((prize) => {
        return {
          token: prize.token,
          tokenDataType: prize.token_data_type,
        };
      });
      const newPrizes = createTournamentData.prizes.map((prize, index) => {
        return {
          prize_key: addAddressPadding(
            bigintToHex(BigInt(prizeCount) + BigInt(index) + 1n)
          ),
          token: prize.token,
          token_data_type: prize.token_data_type,
          tournament_id: addAddressPadding(
            bigintToHex(BigInt(tournamentCount) + 1n)
          ),
          payout_position: prize.payout_position,
          claimed: prize.claimed,
        };
      });
      await approveERC20Multiple(tokens);
      await createTournamentAndAddPrizes(
        BigInt(tournamentCount) + 1n,
        tournament,
        newPrizes
      );
    } else {
      await createTournament(BigInt(tournamentCount) + 1n, tournament);
    }
    resetCreateTournamentData();
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
