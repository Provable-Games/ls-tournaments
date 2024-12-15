import { useMemo } from "react";
import { Button } from "@/components/buttons/Button";
import { useSystemCalls } from "@/useSystemCalls";
import { feltToString } from "@/lib/utils";
import {
  TournamentPrizeKeysModel,
  TournamentModel,
  PrizesModel,
} from "@/generated/models.gen";

interface ClaimPrizesProps {
  tournamentPrizeKeys: TournamentPrizeKeysModel;
  tournamentModel: TournamentModel;
  prizesData: any;
}

const ClaimPrizes = ({
  tournamentPrizeKeys,
  tournamentModel,
  prizesData,
}: ClaimPrizesProps) => {
  const { distributePrizes } = useSystemCalls();

  const handleDistributeAllPrizes = async () => {
    const prizeKeys = tournamentPrizeKeys?.prize_keys;
    await distributePrizes(
      tournamentModel?.tournament_id!,
      feltToString(tournamentModel?.name!),
      prizeKeys
    );
  };

  const unclaimedPrizes = useMemo<PrizesModel[]>(() => {
    return (
      prizesData
        ?.filter((entity: any) => {
          const prizeModel = entity.models.tournament.PrizesModel;
          return (
            !prizeModel.claimed &&
            tournamentPrizeKeys?.prize_keys?.includes(prizeModel.prize_key)
          );
        })
        .map(
          (entity: any) => entity.models.tournament.PrizesModel as PrizesModel
        ) ?? []
    );
  }, [prizesData, tournamentPrizeKeys?.prize_keys]);

  return (
    <>
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Claim Prizes</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      <div className="flex flex-row gap-5">
        <Button
          onClick={handleDistributeAllPrizes}
          disabled={!tournamentPrizeKeys || unclaimedPrizes.length === 0}
        >
          Distribute Prizes
        </Button>
      </div>
    </>
  );
};

export default ClaimPrizes;
