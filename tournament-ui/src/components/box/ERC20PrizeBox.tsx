import { useMemo } from "react";
import { TrophyIcon, CloseIcon } from "../Icons";
import useUIStore from "@/hooks/useUIStore";
import { TournamentPrize } from "@/generated/models.gen";
import { useDojoStore } from "@/hooks/useDojoStore";
import { formatBalance } from "@/lib/utils";
import { useDojo } from "@/DojoContext";

interface ERC20PrizeBoxProps {
  token: string;
  prizes: TournamentPrize[];
  totalAmount: number | null;
  form?: boolean;
}

export default function ERC20PrizeBox({
  token,
  prizes,
  totalAmount,
  form,
}: ERC20PrizeBoxProps) {
  const { createTournamentData, setCreateTournamentData } = useUIStore();
  const { nameSpace } = useDojo();
  const state = useDojoStore((state) => state);
  const tokens = state.getEntitiesByModel(nameSpace, "Token");
  const tokenModel = tokens.find(
    (t) => t.models[nameSpace].Token?.token === token
  )?.models[nameSpace].Token;

  // Group prizes by position and sum their amounts
  const groupedPrizes = useMemo(() => {
    return prizes.reduce((acc, prize) => {
      const position = prize.payout_position.toString(); // Convert bigint to string
      if (!acc[position]) {
        acc[position] = {
          payout_position: position,
          amount: 0n,
        };
      }
      acc[position].amount += BigInt(
        prize.token_data_type.variant.erc20?.token_amount || 0
      );
      return acc;
    }, {} as Record<string, { payout_position: string; amount: bigint }>);
  }, [prizes]);

  return (
    <>
      <div className="relative flex flex-col gap-2 p-2 w-40 text-terminal-green border border-terminal-green">
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
        <span className="flex flex-row items-center justify-between">
          <span className="flex flex-row gap-1">
            <span>{formatBalance(totalAmount!)}</span>
            <span>{tokenModel?.symbol}</span>
          </span>
          <span className="text-terminal-green/50 text-md uppercase">
            ERC20
          </span>
        </span>
        <div className="flex flex-row h-full gap-2 overflow-x-scroll item-scroll">
          {Object.values(groupedPrizes).map((prize) => {
            let value = `${(
              (Number(prize.amount) / Number(totalAmount!)) *
              100
            ).toFixed(0)}%`;
            return (
              <span
                key={prize.payout_position}
                className="flex flex-row items-center gap-1"
              >
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
