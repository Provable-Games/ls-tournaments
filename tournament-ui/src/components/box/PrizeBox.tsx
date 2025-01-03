import { TrophyIcon, CloseIcon } from "../Icons";
import useUIStore from "@/hooks/useUIStore";
import { TournamentPrize } from "@/generated/models.gen";
import { useDojoStore } from "@/hooks/useDojoStore";
import { formatBalance } from "@/lib/utils";
import { useDojo } from "@/DojoContext";

interface PrizeBoxProps {
  token: string;
  variant: "erc20" | "erc721";
  prizes: TournamentPrize[];
  totalAmount: number | null;
  form?: boolean;
}

export default function PrizeBox({
  token,
  variant,
  prizes,
  totalAmount,
  form,
}: PrizeBoxProps) {
  const { createTournamentData, setCreateTournamentData } = useUIStore();
  const { nameSpace } = useDojo();
  const state = useDojoStore((state) => state);
  const tokens = state.getEntitiesByModel(nameSpace, "Token");
  const tokenModel = tokens.find(
    (t) => t.models[nameSpace].Token?.token === token
  )?.models[nameSpace].Token;

  return (
    <>
      <div className="relative flex flex-row gap-2 p-2 text-terminal-green border border-terminal-green">
        {form && (
          <span
            className="absolute top-1 right-1 w-2 h-2 cursor-pointer"
            onClick={() =>
              setCreateTournamentData({
                ...createTournamentData,
                prizes: createTournamentData.prizes.filter(
                  (p) => p.token !== token
                ),
              })
            }
          >
            <CloseIcon />
          </span>
        )}
        <span className="flex flex-col items-center">
          <span className="flex flex-row gap-1">
            <span>{formatBalance(totalAmount!)}</span>
            <span>{tokenModel?.symbol}</span>
          </span>
          <span className="text-terminal-green/50 text-md uppercase">
            {variant}
          </span>
        </span>
        <div className="flex flex-col overflow-scroll">
          {prizes.map((prize, index) => {
            const isERC20 = variant === "erc20";
            const tokenValue = Number(
              isERC20
                ? prize.token_data_type.variant.erc20?.token_amount
                : prize.token_data_type.variant.erc721?.token_id
            );
            let value = "";
            if (isERC20) {
              value = `${((tokenValue / totalAmount!) * 100).toFixed(0)}%`;
            } else {
              value = tokenValue.toString();
            }

            return (
              <span key={index} className="flex flex-row items-center gap-1">
                {BigInt(prize.payout_position) <= 3n ? (
                  <span
                    className={`w-4 h-4 ${
                      BigInt(prize.payout_position) === 1n
                        ? "text-terminal-gold"
                        : BigInt(prize.payout_position) === 2n
                        ? "text-terminal-silver"
                        : "text-terminal-bronze"
                    }`}
                  >
                    <TrophyIcon />
                  </span>
                ) : (
                  <span className="text-terminal-green/50 text-md">
                    {BigInt(prize.payout_position).toString()}
                  </span>
                )}
                <span className="text-terminal-green">{value}</span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
