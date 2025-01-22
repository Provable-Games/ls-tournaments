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
  const { approveAndAddPrize } = useSystemCalls();

  const handleSubmit = async (prize: TournamentPrize) => {
    let prizeKey = currentPrizeCount;
    await approveAndAddPrize(
      tournamentId,
      tournamentName,
      prize,
      addAddressPadding(bigintToHex(prizeKey)),
      true
    );
    setInputDialog(null);
  };

  return (
    <DialogWrapper title="Edit Prize" onClose={() => setInputDialog(null)}>
      <PrizeDialog onSubmit={handleSubmit} />
    </DialogWrapper>
  );
};

export default AddPrizeDialog;
