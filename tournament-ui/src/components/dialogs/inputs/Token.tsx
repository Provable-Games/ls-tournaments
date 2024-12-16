import useUIStore from "@/hooks/useUIStore";
import { DialogWrapper } from "@/components/dialogs/inputs/DialogWrapper";
import { useDojoStore } from "@/hooks/useDojoStore";
import { displayAddress } from "@/lib/utils";
import { InputTokenModel } from "@/generated/models.gen";

interface TokenDialogProps {
  selectedToken: InputTokenModel;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<InputTokenModel | null>
  >;
  type?: "erc20" | "erc721";
}

const Token = ({ selectedToken, setSelectedToken, type }: TokenDialogProps) => {
  const { setInputDialog } = useUIStore();
  const state = useDojoStore();

  const tokens = state.getEntitiesByModel("tournament", "TokenModel");

  const filteredTokens = tokens.filter((token) => {
    if (type) {
      return (
        (token.models.tournament.TokenModel
          ?.token_data_type as unknown as string) === type
      );
    }
    return true;
  });
  return (
    <DialogWrapper title="Select Token" onClose={() => setInputDialog(null)}>
      <div className="flex flex-col">
        {filteredTokens.map((token) => {
          const tokenModel = token.models.tournament.TokenModel!;
          return (
            <div
              className={`w-full flex flex-col hover:bg-terminal-green/10 hover:cursor-pointer px-5 py-2 ${
                selectedToken?.token === tokenModel?.token
                  ? "bg-terminal-green/75 text-terminal-black"
                  : ""
              }`}
              key={token.entityId}
              onClick={() => {
                setSelectedToken(tokenModel as InputTokenModel);
                setInputDialog(null);
              }}
            >
              <span className="uppercase text-terminal-green/75 no-text-shadow">
                {tokenModel?.symbol}
              </span>
              <span>{tokenModel?.name}</span>
              <span className="uppercase text-terminal-green/75 no-text-shadow">
                {displayAddress(tokenModel?.token!)}
              </span>
            </div>
          );
        })}
      </div>
    </DialogWrapper>
  );
};

export default Token;
