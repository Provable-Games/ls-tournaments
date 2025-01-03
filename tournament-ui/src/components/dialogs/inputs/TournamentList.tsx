import useUIStore from "@/hooks/useUIStore";
import { DialogWrapper } from "@/components/dialogs/inputs/DialogWrapper";
import { BigNumberish } from "starknet";

interface TournamentListProps {
  tournamentIds: BigNumberish[];
}

const TournamentList = ({ tournamentIds }: TournamentListProps) => {
  const { setInputDialog } = useUIStore();

  return (
    <DialogWrapper
      title="Tournament Gating"
      onClose={() => setInputDialog(null)}
    >
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-col gap-2 w-full items-center max-h-[400px] overflow-y-auto">
          {tournamentIds?.map((_, index) => (
            <div className="px-10 w-full flex flex-row items-center justify-between">
              <p className="uppercase text-xl">Address {index + 1}:</p>
            </div>
          ))}
        </div>
      </div>
    </DialogWrapper>
  );
};

export default TournamentList;
