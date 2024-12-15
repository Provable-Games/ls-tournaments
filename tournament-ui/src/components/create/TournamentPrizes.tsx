import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import { ChangeEvent, useState } from "react";
import { TrophyIcon } from "@/components/Icons";
import { Distribution } from "@/lib/types";

const TournamentPrizes = () => {
  const { formData, setFormData } = useUIStore();
  const [prizesDisabled, setPrizesDisabled] = useState(true);
  const [distributions, setDistributions] = useState<Distribution[]>([
    { position: 0, percentage: 0 },
  ]);
  const [selectedScoreboardIndex, setSelectedScoreboardIndex] =
    useState<number>(0);

  const handleChangeAmount =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const newDistributions = [...distributions];
      newDistributions[index].position = parseInt(value);
      setDistributions(newDistributions);
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
        <div className="flex flex-row border border-terminal-green/75 h-10">
          <Button className="!h-full" disabled={prizesDisabled}>
            <p className="text-lg">Prizes</p>
          </Button>
          <div className="py-1 px-2 leading-none text-terminal-green/75">
            <p>
              Add bonus prizes to your tournament. Prizes can be added throught
              the tournament Period.
            </p>
          </div>
        </div>
        <div className="flex flex-row px-5 gap-5">
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">Token</p>
            <Button
              variant="token"
              className="border-terminal-green/75"
              disabled={prizesDisabled}
            >
              <p className="text-terminal-green/75 whitespace-nowrap">
                Select Token
              </p>
            </Button>
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">Amount</p>
            <div className="flex flex-row items-center gap-2">
              <Button
                variant={formData.scoreboardSize === 1 ? "default" : "token"}
                onClick={() => setFormData({ ...formData, scoreboardSize: 1 })}
                className="!text-xl text-terminal-green/75 border-terminal-green/75 !p-2"
                disabled={prizesDisabled}
              >
                $5
              </Button>
              <Button
                variant={formData.scoreboardSize === 2 ? "default" : "token"}
                onClick={() => setFormData({ ...formData, scoreboardSize: 2 })}
                className="!text-xl text-terminal-green/75 border-terminal-green/75 !p-2"
                disabled={prizesDisabled}
              >
                $10
              </Button>
              <Button
                variant={formData.scoreboardSize === 3 ? "default" : "token"}
                onClick={() => setFormData({ ...formData, scoreboardSize: 3 })}
                className="!text-xl text-terminal-green/75 border-terminal-green/75 !p-2"
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
                  onChange={handleChangeAmount(0)}
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
              <input
                type="range"
                name="scoreboardSize"
                min={1}
                max={100}
                value={formData.scoreboardSize}
                onChange={(e) =>
                  handleChangePositionDistribution(selectedScoreboardIndex, e)
                }
                className="w-40 mx-2 h-2 appearance-none cursor-pointer custom-range-input outline"
                disabled={prizesDisabled}
              />
              <div className="flex flex-row gap-1 w-full overflow-x-auto">
                {Array.from({ length: scoreboardSize }, (_, index) => (
                  <Button
                    variant="token"
                    className="border-terminal-green/75 !p-2 !h-8"
                    disabled={prizesDisabled}
                    onClick={() => setSelectedScoreboardIndex(index)}
                  >
                    <div className="flex flex-row items-center gap-1">
                      <span className="w-4 h-4 text-terminal-gold">
                        <TrophyIcon />
                      </span>
                      <p>70%</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          <div className="flex justify-center items-center">
            <Button variant="token" disabled={prizesDisabled}>
              <p className="text-terminal-green/75">Add</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPrizes;
