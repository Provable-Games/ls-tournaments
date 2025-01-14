import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "@/hooks/useDojoStore";
import { useDojo } from "@/DojoContext";
import { addAddressPadding, BigNumberish } from "starknet";
import {
  TournamentEntriesAddress,
  Tournament,
  AdventurerModel,
  TournamentScores,
} from "@/generated/models.gen";
import { Button } from "@/components/buttons/Button";
import { useSystemCalls } from "@/useSystemCalls";
import { feltToString, bigintToHex } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ChainId } from "@/config";

interface SubmitScoresProps {
  tournamentModel: Tournament;
  tournamentEntriesAddress: TournamentEntriesAddress;
  tournamentScores: TournamentScores;
  currentAddressStartCount: BigNumberish;
  addressGameIds: BigNumberish[];
  adventurersData: any;
}

const SubmitScores = ({
  tournamentModel,
  tournamentEntriesAddress,
  tournamentScores,
  currentAddressStartCount,
  addressGameIds,
  adventurersData,
}: SubmitScoresProps) => {
  const { selectedChainConfig, nameSpace } = useDojo();
  const state = useDojoStore((state) => state);
  const navigate = useNavigate();
  const { submitScores } = useSystemCalls();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  const scores =
    addressGameIds?.reduce((acc: any, id: any) => {
      const adventurerEntityId = getEntityIdFromKeys([BigInt(id!)]);
      const adventurerModel =
        state.getEntity(adventurerEntityId)?.models?.[nameSpace]
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
          return Number(BigInt(b.xp) - BigInt(a.xp)); // switched a and b
        });
        const winnersCount = tournamentModel?.winners_count;
        const adventurerIds = sortedScores.map((score: any) =>
          addAddressPadding(bigintToHex(BigInt(score.id)))
        );
        console.log(sortedScores);
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
      {addressGameIds.length > 0 ? (
        <>
          <div className="flex flex-col gap-2 p-5">
            <h3 className="text-xl uppercase">Scores Submitted</h3>
            {tournamentEntriesAddress ? (
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
            {/* TODO: Add your top score */}
            {/* TODO: Show qualifying scores */}
          </div>
          <div className="flex flex-row gap-5">
            <Button onClick={handleSubmitScores}>Submit Scores</Button>
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
