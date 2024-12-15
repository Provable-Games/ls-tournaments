import { useState } from "react";
import { Button } from "@/components/buttons/Button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import useUIStore from "@/hooks/useUIStore";
import { ClockIcon } from "@/components/Icons";
import { formatTime } from "@/lib/utils";

const TournamentType = () => {
  const { formData, setFormData } = useUIStore();
  const [tournamentType, setTournamentType] = useState(0);

  // const [_, setOverMaxSubmission] = useState(false);

  // const handleChangeSubmissionPeriod = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   const submissionPeriodSeconds = parseInt(value) * 60 * 60;
  //   setFormData({
  //     ...formData,
  //     [name]: submissionPeriodSeconds,
  //   });
  //   if (parseInt(value) > 336) {
  //     setOverMaxSubmission(true);
  //   } else {
  //     setOverMaxSubmission(false);
  //   }
  // };

  const sectionDisabled = !formData.tournamentName;

  return (
    <div className="flex flex-col">
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
        <div className="flex flex-col gap-2 py-2">
          <div className="px-5 flex flex-row items-center gap-5">
            <div className="flex flex-col items-center w-2/5">
              <p className="text-xl text-center uppercase text-terminal-green/90">
                Start
              </p>
              <DateTimePicker
                className="w-full bg-terminal-black border border-terminal-green/75 text-terminal-green/75 rounded-none hover:bg-terminal-green animate-none uppercase"
                granularity="minute"
                value={formData.startTime}
                showOutsideDays={false}
                onChange={(value) => {
                  if (tournamentType === 0) {
                    setFormData({
                      ...formData,
                      // delay by the min start time delay
                      registrationStartTime: undefined,
                      startTime: value,
                    });
                  } else {
                    setFormData({
                      ...formData,
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
                value={formData.endTime}
                showOutsideDays={false}
                onChange={(value) => {
                  if (tournamentType === 0) {
                    setFormData({
                      ...formData,
                      registrationEndTime: formData.startTime,
                      endTime: value,
                    });
                  } else {
                    setFormData({
                      ...formData,
                      registrationEndTime: value,
                      endTime: value,
                    });
                  }
                }}
                disabled={sectionDisabled || !formData.startTime}
              />
            </div>
            {formData.startTime && formData.endTime && (
              <div className="flex flex-row items-center gap-2 uppercase">
                <span className="w-5 h-5 text-terminal-green">
                  <ClockIcon />
                </span>
                <p className="text-xl">
                  {formatTime(
                    (formData.endTime.getTime() -
                      formData.startTime.getTime()) /
                      1000
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="w-full bg-terminal-green/50 h-0.5" />
          <div className="px-5 flex flex-col">
            <p className="text-xl uppercase text-terminal-green/90">
              Submission Period
            </p>
            <div className="flex flex-row items-center gap-5">
              <div className="flex flex-row items-center gap-10">
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant={
                      formData.submissionPeriod === 86400 ? "default" : "token"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        submissionPeriod: 86400,
                      })
                    }
                    className={`border-terminal-green/75 w-14 !p-2 ${
                      formData.submissionPeriod === 86400
                        ? "text-terminal-black"
                        : "text-terminal-green/75"
                    }`}
                    disabled={sectionDisabled}
                  >
                    <p>1 DAY</p>
                  </Button>
                  <Button
                    variant={
                      formData.submissionPeriod === 259200 ? "default" : "token"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        submissionPeriod: 259200,
                      })
                    }
                    className={`border-terminal-green/75 w-14 !p-2 ${
                      formData.submissionPeriod === 259200
                        ? "text-terminal-black"
                        : "text-terminal-green/75"
                    }`}
                    disabled={sectionDisabled}
                  >
                    <p>3 DAYS</p>
                  </Button>
                  <Button
                    variant={
                      formData.submissionPeriod === 604800 ? "default" : "token"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        submissionPeriod: 604800,
                      })
                    }
                    className={`border-terminal-green/75 w-14 !p-2 ${
                      formData.submissionPeriod === 604800
                        ? "text-terminal-black"
                        : "text-terminal-green/75"
                    }`}
                    disabled={sectionDisabled}
                  >
                    <p>1 WEEK</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentType;
