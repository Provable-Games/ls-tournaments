import { ChangeEvent, useState, useEffect } from "react";
import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import SelectToken from "@/components/buttons/SelectToken";
import { Token, Tournament, GatedTypeEnum } from "@/generated/models.gen";
import { feltToString, displayAddress } from "@/lib/utils";
import { CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";

const TournamentGating = () => {
  const { createTournamentData, setCreateTournamentData, setInputDialog } =
    useUIStore();
  const [tournamentGatingDisabled, setTournamentGatingDisabled] =
    useState(true);
  const [entryType, setEntryType] = useState<"uniform" | "criteria">("uniform");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [gatedAddresses, setGatedAddresses] = useState<string[]>([]);
  const [gatedTournament, setGatedTournament] = useState<Tournament | null>(
    null
  );
  const [gatedType, setGatedType] = useState<number>(0);
  const [uniformEntryCount, setUniformEntryCount] = useState(0);
  // const [_, setEntryCriteria] = useState<
  //   {
  //     token_id: number;
  //     entry_count: number;
  //   }[]
  // >([]);

  const resetGatedData = () => {
    setGatedAddresses([]);
    setGatedTournament(null);
    setSelectedToken(null);
    setUniformEntryCount(0);
    setEntryType("uniform");
    setCreateTournamentData({
      ...createTournamentData,
      gatedType: new CairoOption(CairoOptionVariant.None),
    });
  };

  const handleChangeUniformEntry = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUniformEntryCount(parseInt(value));
  };

  const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddressInput(value);
  };

  const handleAddAddress = () => {
    if (addressInput && !gatedAddresses.includes(addressInput)) {
      setGatedAddresses([...gatedAddresses, addressInput]);
      setAddressInput(""); // Clear input after adding
    }
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

  useEffect(() => {
    if (gatedType === 0 && selectedToken && uniformEntryCount > 0) {
      const gatedTypeEnum = new CairoCustomEnum({
        token: {
          token: selectedToken.token,
          entry_type: new CairoCustomEnum({
            criteria: undefined,
            uniform: uniformEntryCount,
          }),
        },
        tournament: undefined,
        address: undefined, // the active variant with the addresses array
      }) as GatedTypeEnum;

      const someGatedType = new CairoOption(
        CairoOptionVariant.Some,
        gatedTypeEnum
      );

      setCreateTournamentData({
        ...createTournamentData,
        gatedType: someGatedType,
      });
    }
  }, [gatedType, selectedToken, uniformEntryCount]);

  useEffect(() => {
    if (gatedType === 1 && gatedTournament) {
      const gatedTypeEnum = new CairoCustomEnum({
        token: undefined,
        tournament: gatedTournament.tournament_id,
        address: undefined, // the active variant with the addresses array
      }) as GatedTypeEnum;

      const someGatedType = new CairoOption(
        CairoOptionVariant.Some,
        gatedTypeEnum
      );

      setCreateTournamentData({
        ...createTournamentData,
        gatedType: someGatedType,
      });
    }
  }, [gatedType, gatedTournament]);

  useEffect(() => {
    if (gatedType === 2 && gatedAddresses.length > 0) {
      const gatedTypeEnum = new CairoCustomEnum({
        token: undefined,
        tournament: undefined,
        address: gatedAddresses, // the active variant with the addresses array
      }) as GatedTypeEnum;

      const someGatedType = new CairoOption(
        CairoOptionVariant.Some,
        gatedTypeEnum
      );

      setCreateTournamentData({
        ...createTournamentData,
        gatedType: someGatedType,
      });
    }
  }, [gatedType, gatedAddresses]);

  const sectionDisabled =
    !createTournamentData.tournamentName ||
    !createTournamentData.startTime ||
    !createTournamentData.endTime ||
    !createTournamentData.submissionPeriod ||
    !createTournamentData.scoreboardSize;

  return (
    <div className="flex flex-col w-full h-[150px]">
      <div className="h-1/6 flex flex-row items-center gap-5">
        <p
          className={`text-xl uppercase text-terminal-green ${
            sectionDisabled ? "opacity-50" : ""
          }`}
        >
          Tournament Gating
        </p>
        <div className="h-1/6 flex flex-row items-center">
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
        className={`h-5/6 flex flex-col border-2 border-terminal-green/75 ${
          tournamentGatingDisabled ? "opacity-50" : ""
        }`}
      >
        <div className="flex flex-row border border-terminal-green/75 h-1/3">
          <Button
            className={`!h-full ${
              gatedType === 0 ? "bg-terminal-green/75" : ""
            }`}
            variant={gatedType === 0 ? "default" : "ghost"}
            onClick={() => {
              setGatedType(0);
              resetGatedData();
            }}
            disabled={tournamentGatingDisabled}
          >
            <p className="text-lg">Token</p>
          </Button>
          <Button
            className={`!h-full ${
              gatedType === 1 ? "bg-terminal-green/75" : ""
            }`}
            variant={gatedType === 1 ? "default" : "ghost"}
            onClick={() => {
              setGatedType(1);
              resetGatedData();
            }}
            disabled={tournamentGatingDisabled}
          >
            <p className="text-lg">Tournament</p>
          </Button>
          <Button
            className={`!h-full ${
              gatedType === 2 ? "bg-terminal-green/75" : ""
            }`}
            variant={gatedType === 2 ? "default" : "ghost"}
            onClick={() => {
              setGatedType(2);
              resetGatedData();
            }}
            disabled={tournamentGatingDisabled}
          >
            <p className="text-lg">Addresses</p>
          </Button>
          <div className="py-1 px-2 leading-none text-terminal-green/75">
            {gatedType === 0 ? (
              <p>
                Gate your tournament by NFTs. Criteria allows adding different
                entry amounts for specific IDs.
              </p>
            ) : gatedType === 1 ? (
              <p>
                Gate your tournament by addresses that have finished in the top
                scores of previous tournaments.
              </p>
            ) : (
              <p>Gate your tournament by whitelisting addresses.</p>
            )}
          </div>
        </div>
        {gatedType === 0 ? (
          <div className="h-2/3 flex flex-row px-5 gap-5">
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
                  variant={entryType === "uniform" ? "default" : "token"}
                  className={`border-terminal-green/75 ${
                    entryType === "uniform"
                      ? "bg-terminal-green/75 text-terminal-black"
                      : ""
                  }`}
                  disabled={tournamentGatingDisabled || !selectedToken}
                  onClick={() => {
                    setEntryType("uniform");
                  }}
                >
                  <p>Uniform</p>
                </Button>
                <Button
                  variant={entryType === "criteria" ? "default" : "token"}
                  className={`border-terminal-green/75 ${
                    entryType === "criteria"
                      ? "bg-terminal-green/75 text-terminal-black"
                      : ""
                  }`}
                  disabled={tournamentGatingDisabled || !selectedToken}
                  onClick={() => {
                    setEntryType("criteria");
                  }}
                >
                  <p>Criteria</p>
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
                  variant={uniformEntryCount === 1 ? "default" : "token"}
                  onClick={() => setUniformEntryCount(1)}
                  disabled={
                    tournamentGatingDisabled ||
                    !selectedToken ||
                    entryType !== "uniform"
                  }
                >
                  1
                </Button>
                <Button
                  variant={uniformEntryCount === 2 ? "default" : "token"}
                  onClick={() => setUniformEntryCount(2)}
                  disabled={
                    tournamentGatingDisabled ||
                    !selectedToken ||
                    entryType !== "uniform"
                  }
                >
                  2
                </Button>
                <Button
                  variant={uniformEntryCount === 3 ? "default" : "token"}
                  onClick={() => setUniformEntryCount(3)}
                  disabled={
                    tournamentGatingDisabled ||
                    !selectedToken ||
                    entryType !== "uniform"
                  }
                >
                  3
                </Button>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-lg uppercase text-terminal-green/75">
                    Custom
                  </p>
                  <input
                    type="number"
                    name="uniformEntryCount"
                    onChange={handleChangeUniformEntry}
                    className="text-lg p-1 w-10 h-8 bg-terminal-black border border-terminal-green"
                    disabled={tournamentGatingDisabled}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : gatedType === 1 ? (
          <div className="h-2/3 flex flex-row px-5 gap-5">
            <div className="flex flex-col py-2">
              <p className="text-xl uppercase text-terminal-green/75">
                Tournament
              </p>
              <Button
                variant="token"
                onClick={() => {
                  setInputDialog({
                    type: "gated-tournaments",
                    props: {
                      tournament: gatedTournament,
                      setTournament: setGatedTournament,
                    },
                  });
                }}
                disabled={tournamentGatingDisabled}
              >
                {gatedTournament ? (
                  <p>{feltToString(gatedTournament.name)}</p>
                ) : (
                  <p>Select Tournament</p>
                )}
              </Button>
            </div>
            <div className="h-full w-0.5 bg-terminal-green/50" />
            {gatedTournament && (
              <div className="flex flex-col py-2">
                <p className="text-xl uppercase text-terminal-green/75">
                  Selected Tournament
                </p>
                <div className="flex flex-col">
                  <p>{feltToString(gatedTournament?.name)}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-2/3 flex flex-row px-5 gap-5">
            <div className="flex flex-col py-2">
              <p className="text-xl uppercase text-terminal-green/75">
                Addresses
              </p>
              <div className="flex flex-row items-center gap-2">
                <p className="text-terminal-green/75 uppercase">Enter:</p>
                <input
                  type="text"
                  name="addresses"
                  onChange={handleChangeAddress}
                  className="p-1 w-72 h-8 bg-terminal-black border border-terminal-green"
                  disabled={tournamentGatingDisabled}
                  value={addressInput}
                />
                <Button
                  variant="token"
                  className="border-terminal-green/75"
                  onClick={handleAddAddress}
                >
                  <p className="text-terminal-green/75">Add</p>
                </Button>
              </div>
            </div>
            <div className="h-full w-0.5 bg-terminal-green/50" />
            <div className="flex flex-col py-2 h-full overflow-y-auto">
              {gatedAddresses.map((address, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>{index + 1}</span>
                  <span className="text-terminal-green/75">
                    {displayAddress(address)}
                  </span>
                  <span
                    onClick={() =>
                      setGatedAddresses(
                        gatedAddresses.filter((_, i) => i !== index)
                      )
                    }
                    className="!p-1 hover:cursor-pointer"
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentGating;
