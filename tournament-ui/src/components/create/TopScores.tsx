import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import { TrophyIcon } from "@/components/Icons";

const TopScores = () => {
  const { formData, setFormData } = useUIStore();

  const sectionDisabled =
    !formData.tournamentName ||
    !formData.startTime ||
    !formData.endTime ||
    !formData.submissionPeriod;

  return (
    <div className="flex flex-col">
      <p
        className={`text-xl uppercase text-terminal-green ${
          sectionDisabled ? "opacity-50" : ""
        }`}
      >
        Top Scores
      </p>
      <div
        className={`flex flex-col border-2 border-terminal-green/75 py-2 px-5 ${
          sectionDisabled ? "opacity-50" : ""
        }`}
      >
        <div className="flex flex-row w-full items-center gap-5">
          <div className="flex flex-row w-full items-center gap-2">
            <Button
              variant={formData.scoreboardSize === 1 ? "default" : "token"}
              onClick={() => setFormData({ ...formData, scoreboardSize: 1 })}
              className={`border-terminal-green/75 ${
                formData.scoreboardSize === 1
                  ? "text-terminal-black"
                  : "text-terminal-green/75"
              }`}
              disabled={sectionDisabled}
            >
              1
            </Button>
            <Button
              variant={formData.scoreboardSize === 3 ? "default" : "token"}
              onClick={() => setFormData({ ...formData, scoreboardSize: 3 })}
              className={`border-terminal-green/75 ${
                formData.scoreboardSize === 3
                  ? "text-terminal-black"
                  : "text-terminal-green/75"
              }`}
              disabled={sectionDisabled}
            >
              3
            </Button>
            <Button
              variant={formData.scoreboardSize === 10 ? "default" : "token"}
              onClick={() => setFormData({ ...formData, scoreboardSize: 10 })}
              className={`border-terminal-green/75 ${
                formData.scoreboardSize === 10
                  ? "text-terminal-black"
                  : "text-terminal-green/75"
              }`}
              disabled={sectionDisabled}
            >
              10
            </Button>
            <Button
              variant={formData.scoreboardSize === 25 ? "default" : "token"}
              onClick={() => setFormData({ ...formData, scoreboardSize: 25 })}
              className={`border-terminal-green/75 ${
                formData.scoreboardSize === 25
                  ? "text-terminal-black"
                  : "text-terminal-green/75"
              }`}
              disabled={sectionDisabled}
            >
              25
            </Button>
            {formData.scoreboardSize > 0 && (
              <span className="flex flex-row items-center gap-2">
                <span className="w-5 h-5 text-terminal-green">
                  <TrophyIcon />
                </span>
                <p className="text-2xl">{formData.scoreboardSize}</p>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopScores;