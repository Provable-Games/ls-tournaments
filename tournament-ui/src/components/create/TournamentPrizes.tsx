import { ChangeEvent, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import { TrophyIcon } from "@/components/Icons";
import {
  Token,
  TokenDataTypeEnum,
  TournamentPrize,
} from "@/generated/models.gen";
import SelectToken from "@/components/buttons/SelectToken";
import { BigNumberish, CairoCustomEnum } from "starknet";
import { calculatePayouts } from "@/lib/utils";
import PrizeBoxes from "@/components/box/PrizeBoxes";

interface TournamentPrizesProps {
  tournamentCount: BigNumberish;
}

const TournamentPrizes = ({ tournamentCount }: TournamentPrizesProps) => {
  const { createTournamentData, setCreateTournamentData } = useUIStore();
  const [prizesDisabled, setPrizesDisabled] = useState(true);
  const [prizeIndex, setPrizeIndex] = useState<number>(0);
  const [prizesList, setPrizesList] = useState<
    Record<
      number,
      {
        selectedToken: Token | null;
        amount: number;
        distributionWeight: number;
        position: number;
      }
    >
  >({
    0: {
      selectedToken: null,
      amount: 0,
      distributionWeight: 0,
      position: 0,
    },
  });

  // Update handlers to modify prizesList
  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrizesList((prev) => ({
      ...prev,
      [prizeIndex]: {
        ...prev[prizeIndex],
        amount: parseInt(e.target.value),
      },
    }));
  };

  const handleChangeDistributionWeight = (e: ChangeEvent<HTMLInputElement>) => {
    setPrizesList((prev) => ({
      ...prev,
      [prizeIndex]: {
        ...prev[prizeIndex],
        distributionWeight: Number(e.target.value),
      },
    }));
  };
  const scoreboardSize = createTournamentData.scoreboardSize;
  const currentPrize = prizesList[prizeIndex];

  const payouts = useMemo(
    () => calculatePayouts(scoreboardSize, currentPrize.distributionWeight),
    [scoreboardSize, currentPrize.distributionWeight]
  );

  const formattedERC20Prizes: TournamentPrize[] = useMemo(
    () =>
      payouts.map((dist, index) => {
        const tokenDataType = new CairoCustomEnum({
          erc20: {
            token_amount: (currentPrize.amount * 10 ** 18 * dist) / 100,
          },
          erc721: undefined,
        }) as TokenDataTypeEnum;

        return {
          tournament_id: Number(BigInt(tournamentCount) + 1n),
          token: currentPrize.selectedToken?.token!,
          payout_position: index + 1,
          token_data_type: tokenDataType,
          prize_key: "",
          claimed: false,
        };
      }),
    [payouts, currentPrize]
  );

  const formattedERC721Prizes: TournamentPrize[] = useMemo(() => {
    const tokenDataType = new CairoCustomEnum({
      erc20: undefined,
      erc721: {
        token_id: currentPrize.amount,
      },
    }) as TokenDataTypeEnum;
    return [
      {
        tournament_id: Number(BigInt(tournamentCount) + 1n),
        token: currentPrize.selectedToken?.token!,
        payout_position: currentPrize.position,
        token_data_type: tokenDataType,
        prize_key: "",
        claimed: false,
      },
    ];
  }, [currentPrize]);

  const sectionDisabled =
    !createTournamentData.tournamentName ||
    !createTournamentData.startTime ||
    !createTournamentData.endTime ||
    !createTournamentData.submissionPeriod ||
    !createTournamentData.scoreboardSize;

  useEffect(() => {
    if (prizesDisabled) {
      setPrizesList({
        0: {
          selectedToken: null,
          amount: 0,
          distributionWeight: 0,
          position: 0,
        },
      });
      setPrizeIndex(0);
    }
  }, [prizesDisabled]);

  return (
    <div className="relative flex flex-col w-full">
      <div className="flex flex-row items-center gap-5">
        <p
          className={`text-xl uppercase text-terminal-green ${
            sectionDisabled ? "opacity-50" : ""
          }`}
        >
          Bonus Prizes
        </p>
        <div className="flex flex-row items-center">
          <Button
            className="!h-6"
            variant={prizesDisabled ? "default" : "ghost"}
            onClick={() => setPrizesDisabled(true)}
            disabled={sectionDisabled}
          >
            No
          </Button>
          <Button
            className="!h-6"
            variant={prizesDisabled ? "ghost" : "default"}
            onClick={() => setPrizesDisabled(false)}
            disabled={sectionDisabled}
          >
            Yes
          </Button>
        </div>
      </div>
      <div
        className={`flex flex-col border-2 border-terminal-green/75 ${
          prizesDisabled ? "opacity-50" : ""
        }`}
      >
        <div className="flex flex-row px-5 gap-5">
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">Token</p>
            <SelectToken
              selectedToken={prizesList[prizeIndex].selectedToken}
              setSelectedToken={(token) =>
                setPrizesList((prev) => ({
                  ...prev,
                  [prizeIndex]: {
                    ...prev[prizeIndex],
                    selectedToken: token,
                  },
                }))
              }
              disabled={prizesDisabled}
            />
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          {currentPrize.selectedToken && (
            <>
              {currentPrize.selectedToken.token_data_type.activeVariant() ===
              "erc20" ? (
                <>
                  <div className="flex flex-col py-2">
                    <p className="text-xl uppercase text-terminal-green/75">
                      Amount
                    </p>
                    <div className="flex flex-row items-center gap-2">
                      <Button
                        variant={
                          currentPrize.amount === 5 ? "default" : "token"
                        }
                        onClick={() =>
                          setPrizesList((prev) => ({
                            ...prev,
                            [prizeIndex]: {
                              ...prev[prizeIndex],
                              amount: 5,
                            },
                          }))
                        }
                        className={`!text-lg border-terminal-green/75 !p-2 ${
                          currentPrize.amount === 5
                            ? "text-terminal-black"
                            : "text-terminal-green/75"
                        }`}
                        disabled={prizesDisabled}
                      >
                        $5
                      </Button>
                      <Button
                        variant={
                          currentPrize.amount === 10 ? "default" : "token"
                        }
                        onClick={() =>
                          setPrizesList((prev) => ({
                            ...prev,
                            [prizeIndex]: {
                              ...prev[prizeIndex],
                              amount: 10,
                            },
                          }))
                        }
                        className={`!text-lg border-terminal-green/75 !p-2 ${
                          currentPrize.amount === 10
                            ? "text-terminal-black"
                            : "text-terminal-green/75"
                        }`}
                        disabled={prizesDisabled}
                      >
                        $10
                      </Button>
                      <Button
                        variant={
                          currentPrize.amount === 100 ? "default" : "token"
                        }
                        onClick={() =>
                          setPrizesList((prev) => ({
                            ...prev,
                            [prizeIndex]: {
                              ...prev[prizeIndex],
                              amount: 100,
                            },
                          }))
                        }
                        className={`!text-lg border-terminal-green/75 !p-2 ${
                          currentPrize.amount === 100
                            ? "text-terminal-black"
                            : "text-terminal-green/75"
                        }`}
                        disabled={prizesDisabled}
                      >
                        $100
                      </Button>
                      <div className="relative flex flex-col items-center">
                        <p className="absolute top-[-30px] text-lg uppercase text-terminal-green/50">
                          Custom
                        </p>
                        <input
                          type="number"
                          name="submissionPeriod"
                          onChange={handleChangeAmount}
                          className="text-lg p-1 w-16 h-10 bg-terminal-black border border-terminal-green"
                          disabled={prizesDisabled}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-0.5 bg-terminal-green/50" />
                  <div className="flex flex-col py-2 overflow-hidden">
                    <p className="text-xl uppercase text-terminal-green/75 w-full">
                      Split
                    </p>
                    <div className="flex flex-col gap-2">
                      {scoreboardSize > 1 && (
                        <input
                          type="range"
                          min={0}
                          max={8}
                          step={0.1}
                          value={currentPrize.distributionWeight}
                          onChange={handleChangeDistributionWeight}
                          className="w-40 mx-2 h-2 appearance-none cursor-pointer custom-range-input outline"
                          disabled={prizesDisabled}
                        />
                      )}
                      <div className="flex flex-row gap-1 w-full overflow-x-auto">
                        {Array.from({ length: scoreboardSize }, (_, index) => (
                          <Button
                            variant="token"
                            className="border-terminal-green/75 !p-2 !h-8"
                            disabled={prizesDisabled}
                          >
                            <div className="flex flex-row items-center gap-1">
                              <span
                                className={`flex items-center w-4 h-4 text-xl ${
                                  index === 0
                                    ? "text-terminal-gold"
                                    : index === 1
                                    ? "text-terminal-silver"
                                    : index === 2
                                    ? "text-terminal-bronze"
                                    : "text-terminal-green"
                                }`}
                              >
                                {index <= 2 ? <TrophyIcon /> : index + 1}
                              </span>
                              <p>{payouts[index]}%</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-0.5 bg-terminal-green/50" />
                  <div className="flex justify-center items-center">
                    <Button
                      variant="token"
                      disabled={prizesDisabled}
                      onClick={() => {
                        const newIndex = Object.keys(prizesList).length;
                        setPrizesList((prev) => ({
                          ...prev,
                          [newIndex]: {
                            selectedToken: null,
                            amount: 0,
                            distributionWeight: 0,
                            position: 0,
                          },
                        }));
                        setPrizeIndex(newIndex);
                        setCreateTournamentData({
                          ...createTournamentData,
                          prizes: [
                            ...createTournamentData.prizes,
                            ...formattedERC20Prizes,
                          ],
                        });
                      }}
                    >
                      <p className="text-terminal-green/75">Add</p>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col py-2">
                    <p className="text-xl uppercase text-terminal-green/75">
                      Token ID
                    </p>
                    <div className="flex flex-row items-center gap-2">
                      <div className="relative flex flex-col items-center">
                        <input
                          type="number"
                          name="submissionPeriod"
                          onChange={handleChangeAmount}
                          className="text-lg p-1 w-16 h-10 bg-terminal-black border border-terminal-green"
                          disabled={prizesDisabled}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-0.5 bg-terminal-green/50" />
                  <div className="flex flex-col py-2 overflow-hidden w-60">
                    <p className="text-xl uppercase text-terminal-green/75 w-full">
                      Position
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-1 w-full overflow-x-auto">
                        {Array.from({ length: scoreboardSize }, (_, index) => (
                          <Button
                            variant={"token"}
                            className={`border-terminal-green/75 !p-2 !h-8  ${
                              currentPrize.position === index + 1
                                ? "bg-terminal-green/50 text-terminal-black"
                                : ""
                            }`}
                            disabled={prizesDisabled}
                            onClick={() => {
                              setPrizesList((prev) => ({
                                ...prev,
                                [prizeIndex]: {
                                  ...prev[prizeIndex],
                                  position: index + 1,
                                },
                              }));
                            }}
                            key={index}
                          >
                            <span
                              className={`flex items-center w-4 h-4 text-xl ${
                                index === 0
                                  ? "text-terminal-gold"
                                  : index === 1
                                  ? "text-terminal-silver"
                                  : index === 2
                                  ? "text-terminal-bronze"
                                  : ""
                              }`}
                            >
                              {index <= 2 ? <TrophyIcon /> : index + 1}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-0.5 bg-terminal-green/50" />
                  <div className="flex justify-center items-center">
                    <Button
                      variant="token"
                      disabled={prizesDisabled}
                      onClick={() => {
                        const newIndex = Object.keys(prizesList).length;
                        setPrizesList((prev) => ({
                          ...prev,
                          [newIndex]: {
                            selectedToken: null,
                            amount: 0,
                            distributionWeight: 0,
                            position: 0,
                          },
                        }));
                        setPrizeIndex(newIndex);
                        setCreateTournamentData({
                          ...createTournamentData,
                          prizes: [
                            ...createTournamentData.prizes,
                            ...formattedERC721Prizes,
                          ],
                        });
                      }}
                    >
                      <p className="text-terminal-green/75">Add</p>
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="absolute w-3/4 justify-end right-0 bottom-[-80px] h-16 flex flex-row gap-2">
        <PrizeBoxes prizes={createTournamentData.prizes} />
      </div>
    </div>
  );
};

export default TournamentPrizes;
