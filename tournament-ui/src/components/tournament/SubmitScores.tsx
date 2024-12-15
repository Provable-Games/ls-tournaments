import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "@/hooks/useDojoStore";
import { useDojo } from "@/DojoContext";
import { addAddressPadding, BigNumberish } from "starknet";
import {
  TournamentEntriesAddressModel,
  TournamentModel,
  AdventurerModel,
  TournamentStartIdsModel,
  TournamentScoresModel,
} from "@/generated/models.gen";
import { Button } from "@/components/buttons/Button";
import { useSystemCalls } from "@/useSystemCalls";
import { feltToString, bigintToHex } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface SubmitScoresProps {
  tournamentModel: TournamentModel;
  tournamentEntriesAddressModel: TournamentEntriesAddressModel;
  tournamentStartIdsModel: TournamentStartIdsModel;
  tournamentScores: TournamentScoresModel;
  currentAddressStartCount: BigNumberish;
  adventurersData: any;
}

const SubmitScores = ({
  tournamentModel,
  tournamentEntriesAddressModel,
  tournamentStartIdsModel,
  tournamentScores,
  currentAddressStartCount,
  adventurersData,
}: SubmitScoresProps) => {
  const {
    setup: { selectedChainConfig },
  } = useDojo();
  const state = useDojoStore((state) => state);
  const navigate = useNavigate();
  const { submitScores } = useSystemCalls();

  const addressGameIds = tournamentStartIdsModel?.game_ids;

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  const scores =
    addressGameIds?.reduce((acc: any, id: any) => {
      const adventurerEntityId = getEntityIdFromKeys([BigInt(id!)]);
      const adventurerModel =
        state.getEntity(adventurerEntityId)?.models?.tournament
          ?.AdventurerModel;
      if (adventurerModel) {
        acc.push(adventurerModel);
      }
      return acc;
    }, []) ?? [];

  const getSubmitableScores = () => {
    if (!isMainnet) {
      if (!tournamentScores) {
        const sortedScores = scores.sort(
          (a: AdventurerModel, b: AdventurerModel) => {
            return BigInt(a.adventurer?.xp) - BigInt(b.adventurer?.xp);
          }
        );
        const winnersCount = tournamentModel?.winners_count;
        const adventurerIds = sortedScores.map(
          (score: AdventurerModel) => score.adventurer_id
        );
        return winnersCount
          ? adventurerIds.slice(0, winnersCount)
          : adventurerIds;
      }
    } else {
      if (adventurersData) {
        const sortedScores = adventurersData.sort((a: any, b: any) => {
          return BigInt(a.xp) - BigInt(b.xp);
        });
        const winnersCount = tournamentModel?.winners_count;
        const adventurerIds = sortedScores.map((score: any) =>
          addAddressPadding(bigintToHex(BigInt(score.id)))
        );
        return winnersCount
          ? adventurerIds.slice(0, winnersCount)
          : adventurerIds;
      }
    }
    // TODO: Account for already submitted scores and add to the game ids submission
    return [];
  };

  const handleSubmitScores = async () => {
    const submitableScores = getSubmitableScores();
    await submitScores(
      tournamentModel?.tournament_id!,
      feltToString(tournamentModel?.name!),
      submitableScores
    );
  };
  return (
    <>
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Submit Scores</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      {tournamentStartIdsModel ? (
        <>
          <div className="flex flex-col gap-2 p-2 h-10">
            <h3 className="text-xl uppercase">Scores Submitted</h3>
            {tournamentEntriesAddressModel ? (
              <div className="flex flex-row items-center justify-between px-5">
                <p className="text-terminal-green/75 no-text-shadow uppercase text-2xl">
                  {`${tournamentScores?.top_score_ids.length ?? 0} / ${BigInt(
                    currentAddressStartCount
                  ).toString()}`}
                </p>
              </div>
            ) : (
              <p className="text-terminal-green/75 no-text-shadow uppercase">
                You have no entries
              </p>
            )}
          </div>
          <div className="flex flex-row gap-5">
            <Button onClick={handleSubmitScores} disabled={!!tournamentScores}>
              Submit Scores
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
          <p className="text-xl text-center uppercase">
            You have not started any games in this tournament. Find one to enter
            on the overview page.
          </p>
          <Button onClick={() => navigate("/")}>Go to Overview</Button>
        </div>
      )}
    </>
  );
};

export default SubmitScores;
