import { TrophyIcon, CloseIcon } from "../Icons";
import useUIStore from "@/hooks/useUIStore";
import { Premium } from "@/generated/models.gen";
import { CairoOption, CairoOptionVariant } from "starknet";
import { useDojoStore } from "@/hooks/useDojoStore";
import { useDojo } from "@/DojoContext";

interface EntryFeeBoxProps {
  premium: CairoOption<Premium>;
}

export default function EntryFeeBox({ premium }: EntryFeeBoxProps) {
  const { createTournamentData, setCreateTournamentData } = useUIStore();
  const { nameSpace } = useDojo();
  const state = useDojoStore((state) => state);
  const tokens = state.getEntitiesByModel(nameSpace, "Token");
  const token = tokens.find(
    (token) => token.models[nameSpace].Token?.token === premium.unwrap()!.token
  )?.models[nameSpace].Token;
  return (
    <div className="relative flex flex-row gap-5 p-2 text-terminal-green border border-terminal-green px-5">
      <span
        className="absolute top-1 right-1 w-4 h-4 cursor-pointer"
        onClick={() =>
          setCreateTournamentData({
            ...createTournamentData,
            entryFee: new CairoOption(CairoOptionVariant.None),
          })
        }
      >
        <CloseIcon />
      </span>
      <span className="flex flex-col items-center">
        <span className="flex flex-row gap-1 text-xl">
          <span>{BigInt(premium.unwrap()!.token_amount).toString()}</span>
          <span className="text-terminal-green/75">{token?.name}</span>
        </span>
        <span className="text-terminal-green/50 lowercase">per entry</span>
      </span>
      <span className="flex flex-col">
        <span className="uppercase">Creator Fee</span>
        <span className="text-terminal-yellow">
          {BigInt(premium.unwrap()!.creator_fee).toString()}%
        </span>
      </span>
      <span className="flex flex-col">
        <span className="uppercase">Player Split</span>
        <div className="flex flex-row gap-2">
          {premium.Some?.token_distribution.map((distribution, index) => (
            <span className="flex flex-row items-center gap-1">
              {index <= 3 ? (
                <span
                  className={`w-4 h-4 ${
                    index === 0
                      ? "text-terminal-gold"
                      : index === 1
                      ? "text-terminal-silver"
                      : "text-terminal-bronze"
                  }`}
                >
                  <TrophyIcon />
                </span>
              ) : (
                <span className="text-terminal-green/50 text-md">
                  {index + 1}
                </span>
              )}
              <span className="text-terminal-bronze">
                {BigInt(distribution).toString()}%
              </span>
            </span>
          ))}
        </div>
      </span>
    </div>
  );
}
