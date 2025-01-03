import { TournamentPrize } from "@/generated/models.gen";
import PrizeBox from "@/components/box/PrizeBox";
import { getPrizesByToken } from "@/lib/utils";

interface PrizeBoxesProps {
  prizes: TournamentPrize[];
  form?: boolean;
}

const PrizeBoxes = ({ prizes, form }: PrizeBoxesProps) => {
  console.log(prizes);
  return (
    <>
      {getPrizesByToken(prizes).map(([token, prizes], index) => {
        const variant = prizes[0].token_data_type.activeVariant() as
          | "erc20"
          | "erc721";
        const isERC20 = variant === "erc20";
        const totalAmount = isERC20
          ? prizes.reduce(
              (sum, prize) =>
                sum + Number(prize.token_data_type.variant.erc20?.token_amount),
              0
            )
          : null; // Return null for ERC721 since we don't want to sum them
        return (
          <PrizeBox
            key={index}
            token={token}
            variant={variant}
            prizes={prizes}
            totalAmount={totalAmount}
            form={form}
          />
        );
      })}
    </>
  );
};

export default PrizeBoxes;
