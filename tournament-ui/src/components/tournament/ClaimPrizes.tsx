import { useMemo } from "react";
import { Button } from "@/components/buttons/Button";
import { useSystemCalls } from "@/useSystemCalls";
import { feltToString } from "@/lib/utils";
import { Tournament, TournamentPrize } from "@/generated/models.gen";
import { useDojo } from "@/DojoContext";

interface ClaimPrizesProps {
  tournamentPrizes: TournamentPrize[];
  tournamentModel: Tournament;
}

const ClaimPrizes = ({
  tournamentPrizes,
  tournamentModel,
}: ClaimPrizesProps) => {
  const { nameSpace } = useDojo();
  const { distributePrizes } = useSystemCalls();

  const handleDistributeAllPrizes = async () => {
    const prizeKeys = tournamentPrizes?.map(
      (prize: any) => prize.models[nameSpace].TournamentPrize.prize_key
    );
    await distributePrizes(
      tournamentModel?.tournament_id!,
      feltToString(tournamentModel?.name!),
      prizeKeys
    );
  };

  const unclaimedPrizes = useMemo<TournamentPrize[]>(() => {
    return (
      tournamentPrizes
        ?.filter((prize: any) => {
          const prizeModel = prize.models[nameSpace].TournamentPrize;
          return !prizeModel.claimed;
        })
        .map(
          (entity: any) =>
            entity.models[nameSpace].PrizesModel as TournamentPrize
        ) ?? []
    );
  }, [tournamentPrizes]);

  return (
    <>
      {tournamentPrizes && tournamentPrizes.length > 0 ? (
        <>
          <div className="flex flex-col">
            <p className="text-4xl text-center uppercase">Claim Prizes</p>
            <div className="w-full bg-terminal-green/50 h-0.5" />
          </div>
          <div className="flex flex-row gap-5">
            <Button
              onClick={handleDistributeAllPrizes}
              disabled={!tournamentPrizes || unclaimedPrizes.length === 0}
            >
              Distribute Prizes
            </Button>
          </div>
        </>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <p className="text-xl uppercase">There are no prizes to claim</p>
        </div>
      )}
    </>
  );
};

export default ClaimPrizes;
