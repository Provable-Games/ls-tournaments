import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import {
  CairoCustomEnum,
  CairoOption,
  CairoOptionVariant,
  addAddressPadding,
} from "starknet";
import { GatedTypeEnum, Tournament } from "@/generated/models.gen";
import { DialogWrapper } from "@/components/dialogs/inputs/DialogWrapper";
import {
  useGetEndedTournamentsQuery,
  useGetTournamentDetailsQuery,
} from "@/hooks/useSdkQueries";
import { bigintToHex, feltToString } from "@/lib/utils";
import Pagination from "@/components/table/Pagination";

interface GatedTournamentProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament | null>>;
}

const GatedTournament = ({
  tournament,
  setTournament,
}: GatedTournamentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { setCreateTournamentData, setInputDialog, createTournamentData } =
    useUIStore();

  const hexTimestamp = useMemo(
    () => bigintToHex(BigInt(new Date().getTime()) / 1000n),
    []
  );
  const { entities: tournaments } = useGetEndedTournamentsQuery(hexTimestamp);

  const [tournamentID, setTournamentID] = useState<number | null>(null);

  const tournamentVariable = useMemo(() => {
    if (!tournamentID) return 0n;
    return addAddressPadding(bigintToHex(BigInt(tournamentID!.toString())));
  }, [tournamentID]);

  const { entities: selectedTournamentEntities } = useGetTournamentDetailsQuery(
    tournamentVariable!
  );

  const selectedTournament = useMemo(() => {
    if (!selectedTournamentEntities) return null;
    return selectedTournamentEntities.find((entity) => entity.Tournament);
  }, [selectedTournamentEntities]);

  const totalPages = useMemo(() => {
    if (!tournaments) return 0;
    return Math.ceil(tournaments.length / itemsPerPage);
  }, [tournaments]);

  const pagedTournaments = useMemo(() => {
    if (!tournaments) return [];
    return tournaments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [tournaments, currentPage]);

  const handleTournamentIDChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const parsedValue = parseInt(value);
    setTournamentID(parsedValue);
  };

  useEffect(() => {
    if (tournamentID) {
      setTournament(selectedTournament?.Tournament! as unknown as Tournament);
    }
  }, [tournamentID, selectedTournament]);

  return (
    <DialogWrapper
      title="Gated Tournament"
      onClose={() => setInputDialog(null)}
    >
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-row w-full items-center bg-terminal-green text-terminal-black h-10 px-5 justify-between">
          <div className="flex flex-row items-center gap-5">
            <p className="text-2xl uppercase">Select Tournament</p>
            <p>Tournaments must already be settled</p>
          </div>
        </div>
        <div className="px-10 w-full flex flex-col items-center gap-2 h-[400px]">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <table className="w-full border border-terminal-green">
            <thead className="border border-terminal-green text-lg h-10">
              <tr>
                <th className="px-2 text-left">Name</th>
                <th className="text-left">Top Scores</th>
                <th className="text-left">Start Time</th>
                <th className="text-left">End Time</th>
              </tr>
            </thead>
            <tbody>
              {pagedTournaments?.map((row, index) => {
                const tournament = row.Tournament;
                const startDate = new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(Number(tournament?.start_time) * 1000));
                const endDate = new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(Number(tournament?.end_time) * 1000));
                return (
                  <tr
                    key={index}
                    className={`h-2 border border-terminal-green hover:bg-terminal-green hover:text-terminal-black hover:cursor-pointer ${
                      tournamentID === Number(tournament?.tournament_id!)
                        ? "bg-terminal-green text-terminal-black"
                        : ""
                    }`}
                    onClick={() =>
                      setTournamentID(Number(tournament?.tournament_id!))
                    }
                  >
                    <td className="px-2">{feltToString(tournament?.name!)}</td>
                    <td>{tournament?.winners_count.toString()}</td>
                    <td>{startDate}</td>
                    <td>{endDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selectedTournament && (
            <div className="flex flex-col items-center">
              <p className="uppercase text-terminal-green/75 no-text-shadow">
                Selected Tournament
              </p>
              <div className="flex flex-row">
                <p>{tournament ? feltToString(tournament.name! ?? "") : ""}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-5">
          <p className="uppercase">Enter Tournament ID</p>
          <input
            type="number"
            name="ID"
            className="p-1 m-2 w-20 h-8 2xl:text-2xl bg-terminal-black border border-terminal-green"
            onChange={handleTournamentIDChange}
            value={tournamentID?.toString() || ""}
          />
        </div>
        <Button
          variant="token"
          size="lg"
          disabled={!tournamentID}
          onClick={() => {
            const gatedTypeEnum = new CairoCustomEnum({
              token: undefined,
              tournament: [tournamentID!], // the active variant with the tournament ID array
              address: undefined,
            }) as GatedTypeEnum;

            const someGatedType = new CairoOption(
              CairoOptionVariant.Some,
              gatedTypeEnum
            );

            setCreateTournamentData({
              ...createTournamentData,
              gatedType: someGatedType,
            });
            setTournament(
              selectedTournament?.Tournament! as unknown as Tournament
            );
            setInputDialog(null);
          }}
        >
          Add Gated Tournament
        </Button>
      </div>
    </DialogWrapper>
  );
};

export default GatedTournament;
