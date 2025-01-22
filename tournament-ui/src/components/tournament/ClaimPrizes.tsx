import { useMemo } from "react";
import { Button } from "@/components/buttons/Button";
import { useSystemCalls } from "@/useSystemCalls";
import { feltToString } from "@/lib/utils";
import { Tournament, TournamentPrize } from "@/generated/models.gen";

interface ClaimPrizesProps {
  tournamentPrizes: TournamentPrize[];
  tournamentModel: Tournament;
}

const ClaimPrizes = ({
  tournamentPrizes,
  tournamentModel,
}: ClaimPrizesProps) => {
  const { distributePrizes } = useSystemCalls();

  const handleDistributeAllPrizes = async () => {
    // const prizeKeys = tournamentPrizes?.map((prize: any) => prize.prize_key);
    const prizeKeys = [1, 2, 3, 4, 5, 6, 7];
    await distributePrizes(
      tournamentModel?.tournament_id!,
      feltToString(tournamentModel?.name!),
      prizeKeys
    );
  };

  console.log(tournamentPrizes);

  const unclaimedPrizes = useMemo<TournamentPrize[]>(() => {
    return tournamentPrizes?.filter((prize: any) => {
      return !prize.claimed;
    });
  }, [tournamentPrizes]);

  return (
    <>
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Prizes</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      {tournamentPrizes && tournamentPrizes.length > 0 ? (
        unclaimedPrizes.length > 0 ? (
          <div className="flex flex-row items-center justify-center w-full h-full gap-5">
            <Button
              size="lg"
              onClick={handleDistributeAllPrizes}
              disabled={!tournamentPrizes || unclaimedPrizes.length === 0}
            >
              Distribute Prizes
            </Button>
          </div>
        ) : (
          <div className="flex w-full h-full justify-center items-center">
            <p className="text-xl uppercase">
              All prizes have been distributed
            </p>
          </div>
        )
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <p className="text-xl uppercase">There are no prizes to distribute</p>
        </div>
      )}
    </>
  );
};

export default ClaimPrizes;
