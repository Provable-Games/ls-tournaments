import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useNavigate } from "react-router-dom";
import { feltToString, formatTime } from "@/lib/utils";
import useModel from "@/useModel.ts";
import { Models, TournamentPrize } from "@/generated/models.gen";
import { useGetTournamentDetailsQuery } from "@/hooks/useSdkQueries.ts";

interface UpcomingRowProps {
  tournamentId?: any;
  name?: any;
  registrationStartTime?: any;
  registrationEndTime?: any;
  startTime?: any;
  endTime?: any;
  entryPremium?: any;
  prizeKeys?: any;
}

const UpcomingRow = ({
  tournamentId,
  name,
  registrationStartTime,
  registrationEndTime,
  startTime,
  endTime,
  // entryPremium,
  prizeKeys,
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
  const { entities: tournamentDetails } =
    useGetTournamentDetailsQuery(tournamentId);
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
        -
        {/* {entryPremium === "None"
          ? "-"
          : BigInt(entryPremium.Some?.token_amount).toString()} */}
      </td>
      <td>
        -
        {/* {entryPremium === "None"
          ? "-"
          : BigInt(entryPremium.Some?.creator_fee).toString()} */}
      </td>
      <td>
        <div className="flex flex-col gap-2">
          {prizeKeys ? (
            prizeKeys?.map((prizeKey: any) => {
              const entityId = getEntityIdFromKeys([BigInt(prizeKey)]);

              const prize: TournamentPrize = useModel(
                entityId,
                Models.TournamentPrize
              );
              // TODO: when token data type data is supported add the details
              return (
                <div key={prizeKey}>
                  {/* {prize?.token_data_type.variant.erc20?.token_amount} */}
                  {prize ? prize?.token_data_type.toString() : "-"}
                </div>
              );
            })
          ) : (
            <p>-</p>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UpcomingRow;
