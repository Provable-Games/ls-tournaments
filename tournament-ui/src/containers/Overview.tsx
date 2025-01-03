import UpcomingTable from "@/components/overview/UpcomingTable";
import LiveTable from "@/components/overview/LiveTable";
import EndTable from "@/components/overview/EndTable";
import { useDojoStore } from "@/hooks/useDojoStore";
import { ParsedEntity } from "@dojoengine/sdk";
import { SchemaType } from "@/generated/models.gen";
import { feltToString } from "@/lib/utils";
import { useDojo } from "@/DojoContext";

const Overview = () => {
  const { nameSpace } = useDojo();
  const state = useDojoStore((state) => state);
  const tournamentTotals = state.getEntitiesByModel(
    nameSpace,
    "TournamentTotals"
  );
  const tournaments = state.getEntitiesByModel(nameSpace, "Tournament");
  const tournamentCount =
    tournamentTotals[0]?.models?.[nameSpace]?.TournamentTotals
      ?.total_tournaments;
  const nextTournament = tournaments.reduce(
    (earliest: ParsedEntity<SchemaType> | null, current) => {
      if (!earliest) return current;
      return earliest?.models?.[nameSpace]?.Tournament?.start_time! <
        current?.models?.[nameSpace]?.Tournament?.start_time!
        ? earliest
        : current;
    },
    null
  );
  const nextTournamentName =
    nextTournament?.models?.[nameSpace]?.Tournament?.name;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-5 w-full py-4 uppercase h-[525px]">
        <div className="w-3/5 flex flex-col gap-5">
          <div className="w-full h-1/2">
            <div className="flex flex-row gap-5 justify-center">
              <div className="flex flex-col items-center p-2 uppercase">
                <p className="text-terminal-green/75 no-text-shadow text-lg">
                  Total Tournaments
                </p>
                <p className="text-4xl">
                  {Number(tournamentCount ?? 0).toString()}
                </p>
              </div>
              <div className="flex flex-col items-center p-2 uppercase">
                <p className="text-terminal-green/75 no-text-shadow text-lg">
                  Up Next
                </p>
                <p className="text-4xl">
                  {nextTournamentName
                    ? feltToString(BigInt(nextTournamentName))
                    : "None"}
                </p>
              </div>
            </div>
          </div>
          <UpcomingTable />
        </div>
        <div className="w-2/5 flex flex-col gap-5">
          <LiveTable />
          <EndTable />
        </div>
      </div>
    </div>
  );
};

export default Overview;
