import { Button } from "@/components/buttons/Button";
import useUIStore from "@/hooks/useUIStore";
import { InputToken } from "@/generated/models.gen";

interface SelectTokenProps {
  selectedToken: InputToken | null;
  setSelectedToken: (token: InputToken | null) => void;
  disabled: boolean;
  type?: "erc20" | "erc721";
}

const SelectToken = ({
  selectedToken,
  setSelectedToken,
  disabled,
  type,
}: SelectTokenProps) => {
  const { setInputDialog } = useUIStore();
  return (
    <Button
      className={`${
        selectedToken ? "bg-terminal-green/90" : "bg-terminal-black"
      } border-terminal-green/75 w-24`}
      disabled={disabled}
      onClick={() =>
        setInputDialog({
          type: "token",
          props: {
            selectedToken: selectedToken,
            setSelectedToken: setSelectedToken,
            type: type,
          },
        })
      }
    >
      {selectedToken ? (
        <div className="relative flex">
          <span>{selectedToken?.name}</span>
          <span className="absolute bottom-[-10px] text-xs uppercase text-terminal-black">
            {selectedToken?.symbol}
          </span>
        </div>
      ) : (
        <p className="text-terminal-green/75 whitespace-nowrap">Select Token</p>
      )}
    </Button>
  );
};

export default SelectToken;
