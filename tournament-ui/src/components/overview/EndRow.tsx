import { feltToString, bigintToHex } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useGetTournamentDetailsQuery } from "@/hooks/useSdkQueries";
import { addAddressPadding } from "starknet";
import { TournamentPrize } from "@/generated/models.gen";
import TablePrizes from "../table/Prizes";

interface EndRowProps {
  tournamentId?: any;
  name?: any;
  winnersCount?: any;
  endTime?: any;
  submissionPeriod?: any;
}

const EndRow = ({
  tournamentId,
  name,
  winnersCount,
  endTime,
  submissionPeriod,
}: EndRowProps) => {
  const navigate = useNavigate();
  const endTimestamp = Number(endTime) * 1000;
  const endDate = new Date(endTimestamp);
  const submissionEndDate = new Date(
    (Number(endTime) + Number(submissionPeriod)) * 1000
  );

  const ended = Boolean(endTime && endDate.getTime() <= Date.now());
  const submissionEnded = Boolean(
    submissionPeriod && submissionEndDate.getTime() <= Date.now()
  );

  const isSubmissionLive = ended && !submissionEnded;

  const status = isSubmissionLive ? "Submitting" : "Closed";

  const { entities: tournamentDetails } = useGetTournamentDetailsQuery(
    addAddressPadding(bigintToHex(tournamentId ?? 0))
  );

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
      {/* <td>{`${gamesPlayed} / ${entries}`}</td> */}
      <td>0/0</td>
      <td>{winnersCount}</td>
      <td>{status}</td>
      <td>
        <TablePrizes prizes={prizes} />
      </td>
    </tr>
  );
};

export default EndRow;
