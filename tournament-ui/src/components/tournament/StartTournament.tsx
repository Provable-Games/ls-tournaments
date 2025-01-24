import { useMemo, useState } from "react";
import { Button } from "@/components/buttons/Button";
import { feltToString } from "@/lib/utils";
import { useVRFCost } from "@/hooks/useVRFCost";
import { useLordsCost } from "@/hooks/useLordsCost";
import { TournamentEntriesAddress, Tournament } from "@/generated/models.gen";
import {
  CairoOption,
  CairoOptionVariant,
  CallData,
  BigNumberish,
} from "starknet";
import { useSystemCalls } from "@/useSystemCalls";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import useUIStore from "@/hooks/useUIStore";
import { useNavigate } from "react-router-dom";
import { LORDS, ETH } from "@/components/Icons";
import { WeaponSelect } from "@/components/tournament/WeaponSelect";
import { AdventurerName } from "@/components/tournament/AdventurerName";
import useFreeGames from "@/hooks/useFreeGames";

interface StartTournamentProps {
  tournamentEntriesAddressModel: TournamentEntriesAddress;
  tournamentModel: Tournament;
  currentAddressStartCount: BigNumberish;
  entryAddressCount: BigNumberish;
  isSeason: boolean;
}

const StartTournament = ({
  tournamentEntriesAddressModel,
  tournamentModel,
  currentAddressStartCount,
  entryAddressCount,
  isSeason,
}: StartTournamentProps) => {
  const { dollarPrice } = useVRFCost();
  const { lordsCost } = useLordsCost();
  const { tokenBalance, startTournamentData } = useUIStore();
  const navigate = useNavigate();
  const [showPlay, setShowPlay] = useState(false);

  const { eth, lords, goldenToken, blobert, tournament } =
    useTournamentContracts();

  const { usableGoldenTokens, usableBlobertTokens } = useFreeGames();

  const { startTournamentAndApproveTokens } = useSystemCalls();

  const hasFreeGame =
    usableBlobertTokens.length + usableGoldenTokens.length > 0;

  const enoughLordsForStart = useMemo(() => {
    return tokenBalance.lords >= lordsCost!;
  }, [tokenBalance, lordsCost]);

  const enoughEthForStart = useMemo(() => {
    return dollarPrice && tokenBalance.eth
      ? BigInt(dollarPrice) <= tokenBalance.eth
      : false;
  }, [tokenBalance, dollarPrice]);

  const handleStartTournament = async () => {
    if (dollarPrice) {
      const VRFCost = BigInt(dollarPrice);

      let calls = [];

      if (!hasFreeGame) {
        calls.push({
          contractAddress: lords,
          entrypoint: "approve",
          calldata: CallData.compile([tournament, lordsCost!, "0"]),
        });
      } else {
        if (usableGoldenTokens.length > 0) {
          calls.push({
            contractAddress: goldenToken,
            entrypoint: "approve",
            calldata: CallData.compile([
              tournament,
              usableGoldenTokens[0],
              "0",
            ]),
          });
        } else {
          calls.push({
            contractAddress: blobert,
            entrypoint: "approve",
            calldata: CallData.compile([
              tournament,
              usableBlobertTokens[0],
              "0",
            ]),
          });
        }
      }

      calls.push({
        contractAddress: eth,
        entrypoint: "approve",
        calldata: CallData.compile([tournament, VRFCost, "0"]),
      });

      await startTournamentAndApproveTokens(
        calls,
        tournamentModel?.tournament_id!,
        feltToString(tournamentModel?.name!),
        false,
        new CairoOption(CairoOptionVariant.Some, 1),
        usableGoldenTokens.length > 0
          ? [{ low: usableGoldenTokens[0], high: 0n }]
          : [],
        usableGoldenTokens.length === 0 && usableBlobertTokens.length > 0
          ? [{ low: usableBlobertTokens[0], high: 0n }]
          : [],
        Number(currentAddressStartCount) + 1,
        startTournamentData.weapon,
        startTournamentData.name
      );
      setShowPlay(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Start Tournament</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      {tournamentEntriesAddressModel || isSeason ? (
        <div className="flex flex-col h-full">
          {!showPlay ? (
            <>
              <div className="w-full flex flex-row justify-center gap-5 p-1">
                <div className="flex flex-col items-center w-1/3">
                  {!isSeason ? (
                    <>
                      <p className="text-xl uppercase text-terminal-green/75 no-text-shadow text-left">
                        My Games Played
                      </p>
                      <div className="flex flex-row items-center gap-2 px-5 uppercase text-2xl">
                        <p className="uppercase text-2xl">
                          {BigInt(currentAddressStartCount).toString()}
                        </p>
                        /<p> {BigInt(entryAddressCount).toString()}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-row items-center gap-2">
                        <p className="whitespace-nowrap uppercase text-xl text-terminal-green/75 no-text-shadow">
                          Entry Fee
                        </p>
                        <p className="text-lg">100 LORDS</p>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <p className="whitespace-nowrap text-terminal-green/75 no-text-shadow uppercase text-xl">
                          Requirements
                        </p>
                        <p className="text-lg">1 LSVR</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                    Game Cost
                  </p>
                  <div className="relative flex flex-row gap-5">
                    {hasFreeGame && (
                      <p className="absolute top-[-20px] text-terminal-yellow uppercase">
                        Free
                      </p>
                    )}
                    <div className="flex flex-row gap-2 items-center">
                      <p
                        className={`uppercase text-xl ${
                          hasFreeGame
                            ? "line-through text-terminal-green/75 no-text-shadow"
                            : ""
                        }`}
                      >
                        {Number(
                          lordsCost ? lordsCost / BigInt(10) ** BigInt(18) : 0
                        )}
                      </p>
                      <span className="flex h-5 w-5 fill-current">
                        <LORDS />
                      </span>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <p className="uppercase text-xl">
                        {`$${Number(0.5).toFixed(2)}`}
                      </p>
                      <span className="flex h-5 w-5 fill-current">
                        <ETH />
                      </span>
                    </div>
                  </div>
                </div>
                {(usableGoldenTokens.length > 0 ||
                  usableBlobertTokens.length > 0) && (
                  <div className="flex flex-col items-center w-1/3">
                    <div className="flex flex-col items-center">
                      <p className="uppercase">Using</p>
                      {usableGoldenTokens.length > 0 && (
                        <span className="relative h-5 w-5">
                          <img src="/golden-token.png" alt="golden-token" />
                        </span>
                      )}
                      {usableGoldenTokens.length === 0 &&
                        usableBlobertTokens.length > 0 && (
                          <span className="relative h-5 w-5">
                            <img src="/blobert.png" alt="blobert" />
                          </span>
                        )}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full bg-terminal-green/50 h-0.5" />
              <div className="flex flex-col h-full">
                <div className="flex flex-row">
                  <WeaponSelect />
                  <AdventurerName />
                </div>
                <div className="w-full flex flex-row items-center justify-center gap-2 p-2 h-full">
                  {!enoughEthForStart ? (
                    <p className="text-terminal-red uppercase">
                      Not enough ETH
                    </p>
                  ) : !enoughLordsForStart ? (
                    <p className="text-terminal-red uppercase">
                      Not enough LORDS
                    </p>
                  ) : entryAddressCount === currentAddressStartCount ? (
                    <p className="text-terminal-green uppercase">
                      All games minted!
                    </p>
                  ) : (
                    <></>
                  )}
                  <Button
                    disabled={
                      !tournamentEntriesAddressModel ||
                      entryAddressCount === currentAddressStartCount ||
                      !enoughEthForStart ||
                      !enoughLordsForStart ||
                      !startTournamentData.weapon ||
                      !startTournamentData.name
                    }
                    onClick={() => handleStartTournament()}
                  >
                    Start
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-5 items-center justify-center h-full">
              <p className="text-xl uppercase">
                You have started the tournament! Find your game in "Choose
                Adventurer" in Loot Survivor.
              </p>
              <Button
                className="animate-pulse"
                onClick={() =>
                  window.open("https://lootsurvivor.io/", "_blank")
                }
              >
                Play Here
              </Button>
              <Button variant="token" onClick={() => setShowPlay(false)}>
                Start Another
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
          <p className="text-xl text-center uppercase">
            You have not entered any games in this tournament. Find one to enter
            on the overview page.
          </p>
          <Button onClick={() => navigate("/")}>Go to Overview</Button>
        </div>
      )}
    </div>
  );
};

export default StartTournament;
