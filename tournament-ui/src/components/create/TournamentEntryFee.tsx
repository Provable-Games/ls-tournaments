import { ChangeEvent, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import { TrophyIcon } from "@/components/Icons";
import { InputToken } from "@/generated/models.gen";
import { calculatePayouts } from "@/lib/utils";
import SelectToken from "@/components/buttons/SelectToken";
import { CairoOption, CairoOptionVariant } from "starknet";

const TournamentEntryFee = () => {
  const { createTournamentData, setCreateTournamentData } = useUIStore();
  const [entryFeeDisabled, setEntryFeeDisabled] = useState(true);
  const [selectedToken, setSelectedToken] = useState<InputToken | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [creatorFee, setCreatorFee] = useState<number>(0);
  const [distributionWeight, setDistributionWeight] = useState<number>(0);

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAmount(parseInt(value));
  };

  const handleChangeCreatorFee = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCreatorFee(parseInt(value));
  };

  const handleChangeDistributionWeight = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDistributionWeight(Number(value));
  };

  // const totalPercentage = distributions
  //   .filter((dist) => dist.position !== 0 && dist.percentage !== 0)
  //   .reduce((sum, dist) => sum + dist.percentage, 0);

  // const tokens = state.getEntitiesByModel("tournament", "TokenModel");

  // const percentageArray = distributions
  //   .filter((dist) => dist.position !== 0 && dist.percentage !== 0)
  //   .sort((a, b) => a.position - b.position)
  //   .map((dist) => dist.percentage);

  const scoreboardSize = createTournamentData.scoreboardSize;

  const sectionDisabled =
    !createTournamentData.tournamentName ||
    !createTournamentData.startTime ||
    !createTournamentData.endTime ||
    !createTournamentData.submissionPeriod ||
    !createTournamentData.scoreboardSize;

  const payouts = useMemo(
    () => calculatePayouts(scoreboardSize, distributionWeight),
    [scoreboardSize, distributionWeight]
  );

  useEffect(() => {
    if (amount && creatorFee && payouts && selectedToken) {
      const entryFeeValue = new CairoOption(CairoOptionVariant.Some, {
        token: selectedToken?.token!,
        token_amount: amount * 10 ** 18,
        token_distribution: payouts,
        creator_fee: creatorFee,
      });

      setCreateTournamentData({
        ...createTournamentData,
        entryFee: entryFeeValue,
      });
    }
  }, [amount, creatorFee, payouts, selectedToken]);

  useEffect(() => {
    if (entryFeeDisabled) {
      setSelectedToken(null);
      setAmount(0);
      setCreatorFee(0);
      setDistributionWeight(0);
    }
  }, [entryFeeDisabled]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center gap-5">
        <p
          className={`text-xl uppercase text-terminal-green ${
            sectionDisabled ? "opacity-50" : ""
          }`}
        >
          Entry Fee
        </p>
        <div className="flex flex-row items-center">
          <Button
            className="!h-6"
            variant={entryFeeDisabled ? "default" : "ghost"}
            onClick={() => setEntryFeeDisabled(true)}
            disabled={sectionDisabled}
          >
            No
          </Button>
          <Button
            className="!h-6"
            variant={entryFeeDisabled ? "ghost" : "default"}
            onClick={() => setEntryFeeDisabled(false)}
            disabled={sectionDisabled}
          >
            Yes
          </Button>
        </div>
      </div>
      <div
        className={`flex flex-col border-2 border-terminal-green/75 ${
          entryFeeDisabled ? "opacity-50" : ""
        }`}
      >
        <div className="flex flex-row px-2 gap-2">
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">Token</p>
            <SelectToken
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              disabled={entryFeeDisabled}
              type="erc20"
            />
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">Amount</p>
            <div className="flex flex-row gap-2">
              <Button
                variant={amount === 5 ? "default" : "token"}
                onClick={() => setAmount(5)}
                className={`!text-lg border-terminal-green/75 !p-2 ${
                  amount === 5
                    ? "text-terminal-black"
                    : "text-terminal-green/75"
                }`}
                disabled={entryFeeDisabled}
              >
                $5
              </Button>
              <Button
                variant={amount === 10 ? "default" : "token"}
                onClick={() => setAmount(10)}
                className={`!text-lg border-terminal-green/75 !p-2 ${
                  amount === 10
                    ? "text-terminal-black"
                    : "text-terminal-green/75"
                }`}
                disabled={entryFeeDisabled}
              >
                $10
              </Button>
              <Button
                variant={amount === 100 ? "default" : "token"}
                onClick={() => setAmount(100)}
                className={`!text-lg border-terminal-green/75 !p-2 ${
                  amount === 100
                    ? "text-terminal-black"
                    : "text-terminal-green/75"
                }`}
                disabled={entryFeeDisabled}
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
                  className="text-lg p-1 w-16 h-10 bg-terminal-black border border-terminal-green/75"
                  disabled={entryFeeDisabled}
                />
              </div>
            </div>
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75 whitespace-nowrap">
              Creator Fee
            </p>
            <div className="flex flex-row items-center gap-1">
              <p className="text-xl">%</p>
              <input
                type="number"
                min={0}
                max={100}
                value={creatorFee}
                onChange={handleChangeCreatorFee}
                className="text-lg p-1 w-16 h-10 bg-terminal-black border border-terminal-green/75"
                disabled={entryFeeDisabled}
              />
            </div>
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          <div className="flex flex-col py-2 overflow-hidden w-full">
            <p className="text-xl uppercase text-terminal-green/75">Split</p>
            <div className="flex flex-col gap-2 w-[150px]">
              {/* <p className="text-lg text-terminal-green/75">
                Distribution Weight
              </p> */}
              <input
                type="range"
                min={0}
                max={8}
                step={0.1}
                value={distributionWeight}
                onChange={handleChangeDistributionWeight}
                className="w-40 ml-auto mr-2 h-2 appearance-none cursor-pointer custom-range-input outline"
                disabled={entryFeeDisabled}
              />
              <div className="flex flex-row gap-1 overflow-x-auto w-full">
                {Array.from({ length: scoreboardSize }, (_, index) => (
                  <Button
                    variant="token"
                    className="border-terminal-green/75 !p-2 !h-8"
                    disabled={entryFeeDisabled}
                    // onClick={() => setSelectedScoreboardIndex(index)}
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
        </div>
      </div>
    </div>
  );
};

export default TournamentEntryFee;
