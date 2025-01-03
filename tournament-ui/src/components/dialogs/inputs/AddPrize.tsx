import PrizeDialog from "./Prize";
import { DialogWrapper } from "@/components/dialogs/inputs/DialogWrapper";
import useUIStore from "@/hooks/useUIStore";
import { TournamentPrize } from "@/generated/models.gen";
import { useSystemCalls } from "@/useSystemCalls";
import { bigintToHex } from "@/lib/utils";
import { addAddressPadding } from "starknet";

interface AddPrizeDialogProps {
  tournamentId: string;
  tournamentName: string;
  currentPrizeCount: number;
}

const AddPrizeDialog = ({
  tournamentId,
  tournamentName,
  currentPrizeCount,
}: AddPrizeDialogProps) => {
  const { setInputDialog } = useUIStore();
  const { addPrize, approveERC20General, approveERC721General } =
    useSystemCalls();

  const handleSubmit = async (prizes: TournamentPrize[]) => {
    let prizeKey = currentPrizeCount;
    for (const prize of prizes) {
      // approve tokens to be added
      if (prize.token_data_type.activeVariant() === "erc20") {
        await approveERC20General({
          token: prize.token,
          tokenDataType: prize.token_data_type,
        });
      } else {
        await approveERC721General({
          token: prize.token,
          tokenDataType: prize.token_data_type,
        });
      }
      await addPrize(
        tournamentId,
        tournamentName,
        prize,
        addAddressPadding(bigintToHex(prizeKey)),
        true
      );
      prizeKey++;
    }
    setInputDialog(null);
  };

  return (
    <DialogWrapper title="Edit Prize" onClose={() => setInputDialog(null)}>
      <PrizeDialog onSubmit={handleSubmit} />
    </DialogWrapper>
  );
};

export default AddPrizeDialog;
