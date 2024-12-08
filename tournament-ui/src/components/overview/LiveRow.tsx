import { feltToString, formatTime } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LiveRowProps {
  tournamentId?: any;
  name?: any;
  endTime?: any;
  winnersCount?: any;
}

const LiveRow = ({
  tournamentId,
  name,
  endTime,
  winnersCount,
}: LiveRowProps) => {
  const navigate = useNavigate();
  const currentTime = BigInt(new Date().getTime()) / 1000n;
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
      {/* <td>{prizes}</td> */}
      <td>0</td>
      <td>{formatTime(Number(endTime) - Number(currentTime))}</td>
    </tr>
  );
};

export default LiveRow;
