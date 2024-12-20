import PrizeDialog from "./Prize";
import { DialogWrapper } from "./DialogWrapper";
import useUIStore from "@/hooks/useUIStore";
import { Prize } from "@/lib/types";

const CreatePrizeDialog = () => {
  const { createTournamentData, setCreateTournamentData, setInputDialog } =
    useUIStore();

  const handleSubmit = (prizes: Prize[]) => {
    setCreateTournamentData({
      ...createTournamentData,
      prizes: [...createTournamentData.prizes, ...prizes],
    });
    setInputDialog(null);
  };

  return (
    <DialogWrapper title="Prize" onClose={() => setInputDialog(null)}>
      <PrizeDialog onSubmit={handleSubmit} />
    </DialogWrapper>
  );
};

export default CreatePrizeDialog;
