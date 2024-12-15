import { ChangeEvent, useState } from "react";
import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import { TrophyIcon } from "@/components/Icons";
import { Distribution } from "@/lib/types";

const TournamentEntryFee = () => {
  const { formData } = useUIStore();
  const [entryFeeDisabled, setEntryFeeDisabled] = useState(true);
  // const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [creatorFee, setCreatorFee] = useState<number>(0);
  const [distributions, setDistributions] = useState<Distribution[]>([
    { position: 0, percentage: 0 },
  ]);
  const [selectedScoreboardIndex, setSelectedScoreboardIndex] =
    useState<number>(0);

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAmount(parseInt(value));
  };

  const handleChangeCreatorFee = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCreatorFee(parseInt(value));
  };

  const handleChangePositionDistribution = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const newDistributions = [...distributions];
    newDistributions[index].percentage = parseInt(value);
    setDistributions(newDistributions);
  };

  // const totalPercentage = distributions
  //   .filter((dist) => dist.position !== 0 && dist.percentage !== 0)
  //   .reduce((sum, dist) => sum + dist.percentage, 0);

  // const tokens = state.getEntitiesByModel("tournament", "TokenModel");

  // const percentageArray = distributions
  //   .filter((dist) => dist.position !== 0 && dist.percentage !== 0)
  //   .sort((a, b) => a.position - b.position)
  //   .map((dist) => dist.percentage);

  const scoreboardSize = formData.scoreboardSize;

  const sectionDisabled =
    !formData.tournamentName ||
    !formData.startTime ||
    !formData.endTime ||
    !formData.submissionPeriod ||
    !formData.scoreboardSize;

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
        <div className="flex flex-row border border-terminal-green/75 h-10">
          <Button
            className="!h-full bg-terminal-green/75"
            disabled={entryFeeDisabled}
          >
            <p className="text-lg">Entry Fee</p>
          </Button>
          <div className="py-1 px-2 leading-none text-terminal-green/75">
            <p>Set an entry fee for your tournament.</p>
          </div>
        </div>
        <div className="flex flex-row px-2 gap-2">
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">Token</p>
            <Button
              variant="token"
              className="border-terminal-green/75"
              disabled={entryFeeDisabled}
            >
              <p className="text-terminal-green/75 whitespace-nowrap">
                Select Token
              </p>
            </Button>
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
            <div className="flex flex-col gap-2">
              <input
                type="range"
                name="scoreboardSize"
                min={1}
                max={100}
                value={formData.scoreboardSize}
                onChange={(e) =>
                  handleChangePositionDistribution(selectedScoreboardIndex, e)
                }
                className="w-40 ml-auto mr-2 h-2 appearance-none cursor-pointer custom-range-input outline"
                disabled={entryFeeDisabled}
              />
              <div className="flex flex-row gap-1 overflow-x-auto w-full">
                {Array.from({ length: scoreboardSize }, (_, index) => (
                  <Button
                    variant="token"
                    className="border-terminal-green/75 !p-2 !h-8"
                    disabled={entryFeeDisabled}
                    onClick={() => setSelectedScoreboardIndex(index)}
                  >
                    <div className="flex flex-row items-center gap-1">
                      <span className={`w-4 h-4 $ text-terminal-gold`}>
                        <TrophyIcon />
                      </span>
                      <p>70%</p>
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
