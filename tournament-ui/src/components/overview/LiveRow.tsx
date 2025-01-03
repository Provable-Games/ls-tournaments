import { feltToString, formatTime, bigintToHex } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { addAddressPadding, BigNumberish } from "starknet";
import { TournamentPrize } from "@/generated/models.gen";
import { useGetTournamentDetailsQuery } from "@/hooks/useSdkQueries";
import TablePrizes from "../table/Prizes";

interface LiveRowProps {
  tournamentId?: BigNumberish;
  name?: BigNumberish;
  endTime?: BigNumberish;
}

const LiveRow = ({ tournamentId, name, endTime }: LiveRowProps) => {
  const navigate = useNavigate();
  const currentTime = BigInt(new Date().getTime()) / 1000n;

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
      <td className="max-w-40">
        <TablePrizes prizes={prizes} />
      </td>
      <td>{formatTime(Number(endTime) - Number(currentTime))}</td>
    </tr>
  );
};

export default LiveRow;
