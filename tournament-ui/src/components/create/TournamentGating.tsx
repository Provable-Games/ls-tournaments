import { ChangeEvent, useState } from "react";
import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import SelectToken from "@/components/buttons/SelectToken";
import { InputTokenModel } from "@/generated/models.gen";

const TournamentGating = () => {
  const { formData, setFormData } = useUIStore();
  const [tournamentGatingDisabled, setTournamentGatingDisabled] =
    useState(true);
  const [selectedToken, setSelectedToken] = useState<InputTokenModel | null>(
    null
  );
  const [gatedType, setGatedType] = useState<number>(0);
  const [_, setUniformEntryCount] = useState(0);
  // const [_, setEntryCriteria] = useState<
  //   {
  //     token_id: number;
  //     entry_count: number;
  //   }[]
  // >([]);

  const handleChangeUniformEntry = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUniformEntryCount(parseInt(value));
  };

  // const handleChangeEntryCriteriaToken =
  //   (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
  //     const { value } = e.target;
  //     setEntryCriteria((prev) =>
  //       prev.map((criteria, i) =>
  //         i === index ? { ...criteria, token_id: parseInt(value) } : criteria
  //       )
  //     );
  //   };

  // const handleChangeEntryCriteriaCount =
  //   (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
  //     const { value } = e.target;
  //     setEntryCriteria((prev) =>
  //       prev.map((criteria, i) =>
  //         i === index ? { ...criteria, entry_count: parseInt(value) } : criteria
  //       )
  //     );
  //   };

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
          Tournament Gating
        </p>
        <div className="flex flex-row items-center">
          <Button
            className="!h-6"
            variant={tournamentGatingDisabled ? "default" : "ghost"}
            onClick={() => setTournamentGatingDisabled(true)}
            disabled={sectionDisabled}
          >
            No
          </Button>
          <Button
            className="!h-6"
            variant={tournamentGatingDisabled ? "ghost" : "default"}
            onClick={() => setTournamentGatingDisabled(false)}
            disabled={sectionDisabled}
          >
            Yes
          </Button>
        </div>
      </div>
      <div
        className={`flex flex-col border-2 border-terminal-green/75 ${
          tournamentGatingDisabled ? "opacity-50" : ""
        }`}
      >
        <div className="flex flex-row border border-terminal-green/75 h-10">
          <Button
            className={`!h-full ${
              gatedType === 0 ? "bg-terminal-green/75" : ""
            }`}
            variant={gatedType === 0 ? "default" : "ghost"}
            onClick={() => setGatedType(0)}
            disabled={tournamentGatingDisabled}
          >
            <p className="text-lg">Token</p>
          </Button>
          <Button
            className={`!h-full ${
              gatedType === 1 ? "bg-terminal-green/75" : ""
            }`}
            variant={gatedType === 1 ? "default" : "ghost"}
            onClick={() => setGatedType(1)}
            disabled={tournamentGatingDisabled}
          >
            <p className="text-lg">Tournament</p>
          </Button>
          <Button
            className={`!h-full ${
              gatedType === 2 ? "bg-terminal-green/75" : ""
            }`}
            variant={gatedType === 2 ? "default" : "ghost"}
            onClick={() => setGatedType(2)}
            disabled={tournamentGatingDisabled}
          >
            <p className="text-lg">Addresses</p>
          </Button>
          <div className="py-1 px-2 leading-none text-terminal-green/75">
            <p>
              Gate your tournament by NFTs. Criteria allows adding different
              entry amounts for specific IDs.
            </p>
          </div>
        </div>
        <div className="flex flex-row px-5 gap-5">
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">Token</p>
            <SelectToken
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              disabled={tournamentGatingDisabled}
              type="erc721"
            />
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">
              Entries Per Token
            </p>
            <div className="flex -row">
              <Button
                variant="token"
                className="border-terminal-green/75"
                disabled={tournamentGatingDisabled}
              >
                <p className="text-terminal-green/75">Uniform</p>
              </Button>
              <Button
                variant="token"
                className="border-terminal-green/75"
                disabled={tournamentGatingDisabled}
              >
                <p className="text-terminal-green/75">Criteria</p>
              </Button>
            </div>
          </div>
          <div className="h-full w-0.5 bg-terminal-green/50" />
          <div className="flex flex-col py-2">
            <p className="text-xl uppercase text-terminal-green/75">
              Uniform Entries
            </p>
            <div className="flex flex-row w-full items-center gap-2">
              <Button
                variant={formData.scoreboardSize === 1 ? "default" : "token"}
                onClick={() => setFormData({ ...formData, scoreboardSize: 1 })}
                disabled={tournamentGatingDisabled}
              >
                1
              </Button>
              <Button
                variant={formData.scoreboardSize === 2 ? "default" : "token"}
                onClick={() => setFormData({ ...formData, scoreboardSize: 2 })}
                disabled={tournamentGatingDisabled}
              >
                2
              </Button>
              <Button
                variant={formData.scoreboardSize === 3 ? "default" : "token"}
                onClick={() => setFormData({ ...formData, scoreboardSize: 3 })}
                disabled={tournamentGatingDisabled}
              >
                3
              </Button>
              <div className="flex flex-row items-center gap-2">
                <p className="text-lg uppercase text-terminal-green/75">
                  Custom
                </p>
                <input
                  type="number"
                  name="submissionPeriod"
                  onChange={handleChangeUniformEntry}
                  className="text-lg p-1 w-10 h-8 bg-terminal-black border border-terminal-green"
                  disabled={tournamentGatingDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentGating;
