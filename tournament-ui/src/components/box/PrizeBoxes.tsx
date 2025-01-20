import { TournamentPrize } from "@/generated/models.gen";
import ERC20PrizeBox from "@/components/box/ERC20PrizeBox";
import ERC721PrizeBox from "@/components/box/ERC721PrizeBox";
import { getPrizesByToken } from "@/lib/utils";

interface PrizeBoxesProps {
  prizes: TournamentPrize[];
  form?: boolean;
}

const PrizeBoxes = ({ prizes, form }: PrizeBoxesProps) => {
  const erc20Prizes = prizes.filter(
    (p) => p.token_data_type.activeVariant() === "erc20"
  );
  const erc721Prizes = prizes.filter(
    (p) => p.token_data_type.activeVariant() === "erc721"
  );
  return (
    <>
      {/* Group and display ERC20 prizes */}
      {getPrizesByToken(erc20Prizes).map(([token, prizes], index) => (
        <ERC20PrizeBox
          key={`erc20-${index}`}
          token={token}
          prizes={prizes}
          totalAmount={prizes.reduce(
            (sum, prize) =>
              sum + Number(prize.token_data_type.variant.erc20?.token_amount),
            0
          )}
          form={form}
        />
      ))}

      {/* Display individual ERC721 prizes */}
      {getPrizesByToken(erc721Prizes).map(([token, prizes], index) => (
        <ERC721PrizeBox
          key={`erc721-${index}`}
          token={token}
          prizes={prizes}
          form={form}
        />
      ))}
    </>
  );
};

export default PrizeBoxes;
