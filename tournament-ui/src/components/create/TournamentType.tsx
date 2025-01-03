import { useState, ChangeEvent } from "react";
import { Button } from "@/components/buttons/Button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import useUIStore from "@/hooks/useUIStore";
import { ClockIcon } from "@/components/Icons";
import { formatTime } from "@/lib/utils";
import { TrophyIcon } from "@/components/Icons";

interface TournamentTypeProps {
  testMode: boolean;
}

const TournamentType = ({ testMode }: TournamentTypeProps) => {
  const { createTournamentData, setCreateTournamentData } = useUIStore();
  const [tournamentType, setTournamentType] = useState(0);

  const handleChangeSubmissionPeriod = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateTournamentData({
      ...createTournamentData,
      [name]: value,
    });
  };

  const sectionDisabled = !createTournamentData.tournamentName;

  return (
    <div className="flex flex-col w-full">
      <p
        className={`text-xl uppercase text-terminal-green ${
          sectionDisabled ? "opacity-50" : ""
        }`}
      >
        Tournament type
      </p>
      <div
        className={`flex flex-col border-2 border-terminal-green/75 ${
          sectionDisabled ? "opacity-50" : ""
        }`}
      >
        <div className="flex flex-row border border-terminal-green/75 h-10">
          <Button
            className={`!h-full ${
              tournamentType === 0 ? "bg-terminal-green/75" : ""
            }`}
            variant={tournamentType === 0 ? "default" : "ghost"}
            onClick={() => setTournamentType(0)}
            disabled={sectionDisabled}
          >
            <p className="text-lg">Classic</p>
          </Button>
          <Button
            className={`!h-full ${
              tournamentType === 1 ? "bg-terminal-green/75" : ""
            }`}
            variant={tournamentType === 1 ? "default" : "ghost"}
            onClick={() => setTournamentType(1)}
            disabled={sectionDisabled}
          >
            <p className="text-lg">Season</p>
          </Button>
          <div className="py-1 px-2 leading-none text-terminal-green/75">
            <p>
              {tournamentType === 0
                ? "Tournament with a fixed registration period. Registration period starts now until the tournament starts."
                : "Tournament that allows entries throughout its duration. This type is most similar to a Season."}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="px-5 flex flex-row items-center gap-5 py-2">
            <div className="flex flex-col items-center w-2/5">
              <p className="text-xl text-center uppercase text-terminal-green/90">
                Start
              </p>
              <DateTimePicker
                className="w-full bg-terminal-black border border-terminal-green/75 text-terminal-green/75 rounded-none hover:bg-terminal-green animate-none uppercase"
                granularity="minute"
                value={createTournamentData.startTime}
                showOutsideDays={false}
                onChange={(value) => {
                  if (tournamentType === 0) {
                    setCreateTournamentData({
                      ...createTournamentData,
                      // delay by the min start time delay
                      registrationStartTime: undefined,
                      startTime: value,
                    });
                  } else {
                    setCreateTournamentData({
                      ...createTournamentData,
                      registrationStartTime: value,
                      startTime: value,
                    });
                  }
                }}
                disabled={sectionDisabled}
              />
            </div>
            <div className="flex flex-col items-center w-2/5">
              <p className="text-xl text-center uppercase text-terminal-green/90">
                End
              </p>
              <DateTimePicker
                className="w-full bg-terminal-black border border-terminal-green/75 text-terminal-green/75 rounded-none hover:bg-terminal-green animate-none uppercase"
                granularity="minute"
                value={createTournamentData.endTime}
                showOutsideDays={false}
                onChange={(value) => {
                  if (tournamentType === 0) {
                    setCreateTournamentData({
                      ...createTournamentData,
                      registrationEndTime: createTournamentData.startTime,
                      endTime: value,
                    });
                  } else {
                    setCreateTournamentData({
                      ...createTournamentData,
                      registrationEndTime: value,
                      endTime: value,
                    });
                  }
                }}
                disabled={sectionDisabled || !createTournamentData.startTime}
              />
            </div>
            {createTournamentData.startTime && createTournamentData.endTime && (
              <div className="flex flex-row items-center gap-2 uppercase">
                <span className="w-5 h-5 text-terminal-green">
                  <ClockIcon />
                </span>
                <p className="text-lg">
                  {formatTime(
                    (createTournamentData.endTime.getTime() -
                      createTournamentData.startTime.getTime()) /
                      1000
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="w-full bg-terminal-green/50 h-0.5" />
          <div className="flex flex-row">
            <div className="px-5 flex flex-col py-2">
              <p className="text-xl uppercase text-terminal-green/90">
                Submission Period
              </p>
              <div className="flex flex-row items-center gap-5">
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant={
                      createTournamentData.submissionPeriod === 86400
                        ? "default"
                        : "token"
                    }
                    onClick={() =>
                      setCreateTournamentData({
                        ...createTournamentData,
                        submissionPeriod: 86400,
                      })
                    }
                    className={`border-terminal-green/75 w-14 !p-2 ${
                      createTournamentData.submissionPeriod === 86400
                        ? "text-terminal-black"
                        : "text-terminal-green/75"
                    }`}
                    disabled={sectionDisabled}
                  >
                    <p>1 DAY</p>
                  </Button>
                  <Button
                    variant={
                      createTournamentData.submissionPeriod === 259200
                        ? "default"
                        : "token"
                    }
                    onClick={() =>
                      setCreateTournamentData({
                        ...createTournamentData,
                        submissionPeriod: 259200,
                      })
                    }
                    className={`border-terminal-green/75 w-14 !p-2 ${
                      createTournamentData.submissionPeriod === 259200
                        ? "text-terminal-black"
                        : "text-terminal-green/75"
                    }`}
                    disabled={sectionDisabled}
                  >
                    <p>3 DAYS</p>
                  </Button>
                  <Button
                    variant={
                      createTournamentData.submissionPeriod === 604800
                        ? "default"
                        : "token"
                    }
                    onClick={() =>
                      setCreateTournamentData({
                        ...createTournamentData,
                        submissionPeriod: 604800,
                      })
                    }
                    className={`border-terminal-green/75 w-14 !p-2 ${
                      createTournamentData.submissionPeriod === 604800
                        ? "text-terminal-black"
                        : "text-terminal-green/75"
                    }`}
                    disabled={sectionDisabled}
                  >
                    <p>1 WEEK</p>
                  </Button>
                </div>
                {testMode && (
                  <input
                    type="number"
                    name="submissionPeriod"
                    onChange={handleChangeSubmissionPeriod}
                    className="text-lg p-1 w-16 h-8 bg-terminal-black border border-terminal-green"
                    disabled={sectionDisabled}
                  />
                )}
              </div>
            </div>
            <div className="h-full w-0.5 bg-terminal-green/50" />
            <div className="px-5 flex flex-col py-2">
              <p className="text-xl uppercase text-terminal-green/90">
                Top Scores
              </p>
              <div className="flex flex-row w-full items-center gap-2">
                <Button
                  variant={
                    createTournamentData.scoreboardSize === 1
                      ? "default"
                      : "token"
                  }
                  onClick={() =>
                    setCreateTournamentData({
                      ...createTournamentData,
                      scoreboardSize: 1,
                    })
                  }
                  className={`border-terminal-green/75 ${
                    createTournamentData.scoreboardSize === 1
                      ? "text-terminal-black"
                      : "text-terminal-green/75"
                  }`}
                  disabled={sectionDisabled}
                >
                  1
                </Button>
                <Button
                  variant={
                    createTournamentData.scoreboardSize === 3
                      ? "default"
                      : "token"
                  }
                  onClick={() =>
                    setCreateTournamentData({
                      ...createTournamentData,
                      scoreboardSize: 3,
                    })
                  }
                  className={`border-terminal-green/75 ${
                    createTournamentData.scoreboardSize === 3
                      ? "text-terminal-black"
                      : "text-terminal-green/75"
                  }`}
                  disabled={sectionDisabled}
                >
                  3
                </Button>
                <Button
                  variant={
                    createTournamentData.scoreboardSize === 10
                      ? "default"
                      : "token"
                  }
                  onClick={() =>
                    setCreateTournamentData({
                      ...createTournamentData,
                      scoreboardSize: 10,
                    })
                  }
                  className={`border-terminal-green/75 ${
                    createTournamentData.scoreboardSize === 10
                      ? "text-terminal-black"
                      : "text-terminal-green/75"
                  }`}
                  disabled={sectionDisabled}
                >
                  10
                </Button>
                {createTournamentData.scoreboardSize > 0 && (
                  <span className="flex flex-row items-center gap-2">
                    <span className="w-5 h-5 text-terminal-green">
                      <TrophyIcon />
                    </span>
                    <p className="text-2xl">
                      {createTournamentData.scoreboardSize}
                    </p>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentType;
