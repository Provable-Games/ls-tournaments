import PrizeDialog from "./Prize";
import { DialogWrapper } from "./DialogWrapper";
import useUIStore from "@/hooks/useUIStore";
import { TournamentPrize } from "@/generated/models.gen";

const CreatePrizeDialog = () => {
  const { createTournamentData, setCreateTournamentData, setInputDialog } =
    useUIStore();

  const handleSubmit = (prizes: TournamentPrize[]) => {
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
