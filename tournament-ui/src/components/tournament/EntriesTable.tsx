import { useState, useMemo } from "react";
import { useGetUsernames } from "@/hooks/useController";
import Pagination from "@/components/table/Pagination";
import EntryRow from "@/components/tournament/EntryRow";
import { indexAddress } from "@/lib/utils";
import { useDojo } from "@/DojoContext";

interface EntriesTableProps {
  tournamentEntires: any;
}

const EntriesTable = ({ tournamentEntires }: EntriesTableProps) => {
  const { nameSpace } = useDojo();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => {
    if (!tournamentEntires) return 0;
    return Math.ceil(tournamentEntires.length / 10);
  }, [tournamentEntires]);

  const pagedEntries = useMemo(() => {
    if (!tournamentEntires) return [];
    return tournamentEntires.slice((currentPage - 1) * 10, currentPage * 10);
  }, [tournamentEntires, currentPage]);

  const addresses = useMemo(
    () =>
      pagedEntries.map(
        (entry: any) => entry.models[nameSpace].TournamentEntriesAddress.address
      ),
    [pagedEntries]
  );

  const { usernames } = useGetUsernames(addresses);

  return (
    <div className="w-1/2 flex flex-col border-4 border-terminal-green/75">
      {tournamentEntires && tournamentEntires.length > 0 ? (
        <>
          <div className="flex flex-row items-center justify-between w-full">
            <div className="w-1/4"></div>
            <p className="w-1/2 text-4xl text-center uppercase">Entries</p>
            <div className="w-1/4 flex justify-end">
              {tournamentEntires && tournamentEntires.length > 10 && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-terminal-green/75 text-terminal-black text-lg h-10 uppercase">
              <tr>
                <th className="text-left px-2">Name</th>
                <th className="text-left">Address</th>
                <th className="text-left">Entries</th>
              </tr>
            </thead>
            <tbody>
              {tournamentEntires && tournamentEntires.length > 0 ? (
                pagedEntries.map((entry: any, index: any) => {
                  const entryModel =
                    entry.models[nameSpace].TournamentEntriesAddress;
                  return (
                    <EntryRow
                      key={index}
                      name={
                        usernames?.get(indexAddress(entryModel.address)) || ""
                      }
                      address={entryModel.address}
                      entryCount={entryModel.entry_count}
                    />
                  );
                })
              ) : (
                <p className="text-center">No Scores Submitted</p>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl uppercase">Tournament has no current entries</p>
        </div>
      )}
    </div>
  );
};

export default EntriesTable;
