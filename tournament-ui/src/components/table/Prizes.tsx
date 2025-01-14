import { getTokenNameOrIcon, getPrizesByToken } from "@/lib/utils";
import { TournamentPrize } from "@/generated/models.gen";
import { useDojo } from "@/DojoContext";
import { useDojoStore } from "@/hooks/useDojoStore";

interface TablePrizesProps {
  prizes: TournamentPrize[];
}

const TablePrizes = ({ prizes }: TablePrizesProps) => {
  const { nameSpace } = useDojo();
  const state = useDojoStore();
  const prizesByToken = getPrizesByToken(prizes);

  const tokens = state.getEntitiesByModel(nameSpace, "Token");
  if (prizes.length === 0) return <span className="text-center">-</span>;
  return (
    <div className="flex flex-row gap-2 overflow-auto px-2 item-scroll">
      {prizesByToken?.map(([token, prizes], index) => {
        const variant = prizes[0].token_data_type.activeVariant() as
          | "erc20"
          | "erc721";
        const isERC20 = variant === "erc20";
        const totalAmount = isERC20
          ? prizes.reduce(
              (sum, prize) =>
                sum +
                Number(prize.token_data_type.variant.erc20?.token_amount) /
                  10 ** 18,
              0
            )
          : null; // Return null for ERC721 since we don't want to sum them
        return (
          <div className="flex flex-row items-center gap-1" key={index}>
            <div>{totalAmount}</div>
            <span className="w-4 h-4 fill-current">
              {getTokenNameOrIcon(nameSpace, token, tokens)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TablePrizes;
