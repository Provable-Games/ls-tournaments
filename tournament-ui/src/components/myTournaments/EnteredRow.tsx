import { useNavigate } from "react-router-dom";
import { feltToString, getTokenNameOrIcon } from "@/lib/utils";
import useModel from "@/useModel.ts";
import { Models, TournamentPrize } from "@/generated/models.gen";
import { useGetTournamentDetailsQuery } from "@/hooks/useSdkQueries.ts";
import TablePrizes from "@/components/table/Prizes";
import { useDojoStore } from "@/hooks/useDojoStore";
import { useDojo } from "@/DojoContext";

interface EnteredRowProps {
  entityId: any;
  tournamentId?: any;
  name?: any;
  startTime?: any;
  entryPremium?: any;
  entries?: any;
}

const EnteredRow = ({
  entityId,
  tournamentId,
  name,
  startTime,
  entryPremium,
}: EnteredRowProps) => {
  const navigate = useNavigate();
  const state = useDojoStore();
  const { nameSpace } = useDojo();
  const startTimestamp = Number(startTime) * 1000;
  const startDate = new Date(startTimestamp);
  console.log(startTime);
  console.log(startDate);
  const displayStartDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(startDate);
  const { entities: tournamentDetails } =
    useGetTournamentDetailsQuery(tournamentId);
  const entryIndex =
    tournamentDetails?.findIndex((detail) => detail.TournamentEntries) ?? -1;
  const tournamentEntries =
    tournamentDetails && entryIndex !== -1
      ? tournamentDetails[entryIndex].TournamentEntries
      : { entry_count: 0 };

  const tournamentModel = useModel(entityId, Models.Tournament);

  // Calculate dates
  const endDate = new Date(Number(tournamentModel?.end_time) * 1000);
  const submissionEndDate = new Date(
    (Number(tournamentModel?.end_time) +
      Number(tournamentModel?.submission_period)) *
      1000
  );

  const started = Boolean(
    tournamentModel?.start_time && startDate.getTime() < Date.now()
  );
  const ended = Boolean(
    tournamentModel?.end_time && endDate.getTime() <= Date.now()
  );
  const submissionEnded = Boolean(
    tournamentModel?.submission_period &&
      submissionEndDate.getTime() <= Date.now()
  );

  const isLive = started && !ended;
  const isSubmissionLive = ended && !submissionEnded;
  const status = !started
    ? "Upcoming"
    : isLive
    ? "Live"
    : isSubmissionLive
    ? "Submission Live"
    : "Ended";

  const prizes: TournamentPrize[] = (tournamentDetails
    ?.filter((detail) => detail.TournamentPrize)
    .map((detail) => detail.TournamentPrize) ??
    []) as unknown as TournamentPrize[];

  const tokens = state.getEntitiesByModel(nameSpace, "Token");
  return (
    <tr
      className="h-6 hover:bg-terminal-green/50 hover:cursor-pointer border border-terminal-green/50"
      onClick={() => {
        navigate(`/tournament/${Number(tournamentId)}`);
      }}
    >
      <td className="px-2 max-w-20">
        <p className="overflow-hidden whitespace-nowrap text-ellipsis">
          {feltToString(BigInt(name!))}
        </p>
      </td>
      <td className="text-xl">
        {BigInt(tournamentEntries?.entry_count ?? 0).toString()}
      </td>
      <td>{displayStartDate}</td>
      <td>{status}</td>
      <td>
        <div className="flex flex-row gap-1">
          <span>
            {entryPremium?.isNone
              ? "-"
              : BigInt(entryPremium?.Some?.token_amount ?? 0).toString()}
          </span>
          <span>
            {getTokenNameOrIcon(
              nameSpace,
              entryPremium?.Some?.token ?? "",
              tokens
            )}
          </span>
        </div>
      </td>
      <td>
        {entryPremium?.isNone
          ? "-"
          : BigInt(entryPremium?.Some?.creator_fee ?? 0).toString()}
      </td>
      <td>
        <TablePrizes prizes={prizes} />
      </td>
    </tr>
  );
};

export default EnteredRow;
