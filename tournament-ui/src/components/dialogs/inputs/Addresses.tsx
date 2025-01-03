import useUIStore from "@/hooks/useUIStore";
import { DialogWrapper } from "@/components/dialogs/inputs/DialogWrapper";

interface AddressesProps {
  addresses: string[];
}

const Addresses = ({ addresses }: AddressesProps) => {
  const { setInputDialog } = useUIStore();

  return (
    <DialogWrapper title="Addresses" onClose={() => setInputDialog(null)}>
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-col gap-2 w-full items-center max-h-[400px] overflow-y-auto">
          {addresses?.map((_, index) => (
            <div className="px-10 w-full flex flex-row items-center justify-between">
              <p className="uppercase text-xl">Address {index + 1}:</p>
            </div>
          ))}
        </div>
      </div>
    </DialogWrapper>
  );
};

export default Addresses;
