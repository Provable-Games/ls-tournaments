import { useNavigate } from "react-router-dom";
import { feltToString, formatTime } from "@/lib/utils";
import { useGetTournamentDetailsQuery } from "@/hooks/useSdkQueries.ts";
import { bigintToHex } from "@/lib/utils";
import { addAddressPadding, BigNumberish, CairoOption } from "starknet";
import { TournamentPrize, Premium } from "@/generated/models.gen";
import TablePrizes from "@/components/table/Prizes";

interface UpcomingRowProps {
  tournamentId?: BigNumberish;
  name?: BigNumberish;
  registrationStartTime?: BigNumberish;
  registrationEndTime?: BigNumberish;
  startTime?: BigNumberish;
  endTime?: BigNumberish;
  entryPremium?: CairoOption<Premium>;
}

const UpcomingRow = ({
  tournamentId,
  name,
  registrationStartTime,
  registrationEndTime,
  startTime,
  endTime,
  entryPremium,
}: UpcomingRowProps) => {
  const navigate = useNavigate();
  const currentTime = new Date().getTime();
  const registrationStartTimestamp = Number(registrationStartTime) * 1000;
  const registrationEndTimestamp = Number(registrationEndTime) * 1000;
  const startTimestamp = Number(startTime) * 1000;
  const startDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(startTimestamp));
  const { entities: tournamentDetails } = useGetTournamentDetailsQuery(
    addAddressPadding(bigintToHex(tournamentId ?? 0))
  );
  const entryIndex =
    tournamentDetails?.findIndex((detail) => detail.TournamentEntries) ?? -1;
  const tournamentEntries =
    tournamentDetails && entryIndex !== -1
      ? tournamentDetails[entryIndex].TournamentEntries
      : { entry_count: 0 };

  const status =
    registrationStartTimestamp > currentTime
      ? "Not Started"
      : registrationEndTimestamp < currentTime
      ? "Closed"
      : "Open";

  const prizes: TournamentPrize[] = (tournamentDetails
    ?.filter((detail) => detail.TournamentPrize)
    .map((detail) => detail.TournamentPrize) ??
    []) as unknown as TournamentPrize[];

  return (
    <tr
      className="h-8 hover:bg-terminal-green/50 hover:cursor-pointer border border-terminal-green/50"
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
      <td>{startDate}</td>
      <td>{status}</td>
      <td>{formatTime(Number(endTime) - Number(startTime))}</td>
      <td>
        {entryPremium?.isNone
          ? "-"
          : BigInt(entryPremium?.Some?.token_amount ?? 0).toString()}
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

export default UpcomingRow;
