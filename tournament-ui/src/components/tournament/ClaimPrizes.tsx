import { useMemo } from "react";
import { Button } from "@/components/buttons/Button";
import { useSystemCalls } from "@/useSystemCalls";
import { feltToString } from "@/lib/utils";
import { Tournament, TournamentPrize } from "@/generated/models.gen";
import { SchemaType } from "@/generated/models.gen";
import { ParsedEntity } from "@dojoengine/sdk";
import { useDojo } from "@/DojoContext";

interface ClaimPrizesProps {
  tournamentPrizes: ParsedEntity<SchemaType>[];
  tournamentModel: Tournament;
  prizesData: any;
}

const ClaimPrizes = ({
  tournamentPrizes,
  tournamentModel,
  prizesData,
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
      prizesData
        ?.filter((entity: any) => {
          const prizeModel = entity.models[nameSpace].PrizesModel;
          return !prizeModel.claimed;
        })
        .map(
          (entity: any) =>
            entity.models[nameSpace].PrizesModel as TournamentPrize
        ) ?? []
    );
  }, [prizesData, tournamentPrizes]);

  return (
    <>
      {tournamentPrizes ? (
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
