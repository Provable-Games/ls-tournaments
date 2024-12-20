import { useState } from "react";
import useUIStore from "@/hooks/useUIStore";
import { DialogWrapper } from "@/components/dialogs/inputs/DialogWrapper";
import { useDojoStore } from "@/hooks/useDojoStore";
import { displayAddress } from "@/lib/utils";
import { InputToken } from "@/generated/models.gen";
import { Button } from "@/components/buttons/Button";
import { useDojo } from "@/DojoContext";

interface TokenDialogProps {
  selectedToken: InputToken;
  setSelectedToken: React.Dispatch<React.SetStateAction<InputToken | null>>;
  type?: "erc20" | "erc721";
}

const Token = ({ selectedToken, setSelectedToken, type }: TokenDialogProps) => {
  const { setInputDialog } = useUIStore();
  const { nameSpace } = useDojo();
  const state = useDojoStore();
  const [selectedType, setSelectedType] = useState<"erc20" | "erc721">("erc20");

  const tokens = state.getEntitiesByModel(nameSpace, "Token");

  const filteredTokens = tokens.filter((token) => {
    if (type) {
      return (
        (token.models.tournament.Token
          ?.token_data_type as unknown as string) === type
      );
    }
    return true;
  });
  return (
    <DialogWrapper title="Select Token" onClose={() => setInputDialog(null)}>
      <div className="w-full bg-terminal-green/50 h-0.5" />
      {!type && (
        <div className="flex flex-row">
          <Button
            className="text-xl"
            onClick={() => setSelectedType("erc20")}
            variant={selectedType === "erc20" ? "default" : "outline"}
          >
            ERC20
          </Button>
          <Button
            className="text-xl"
            onClick={() => setSelectedType("erc721")}
            variant={selectedType === "erc721" ? "default" : "outline"}
          >
            ERC721
          </Button>
        </div>
      )}
      <div className="w-full bg-terminal-green/50 h-0.5" />
      <div className="flex flex-col h-5/6 overflow-scroll">
        {filteredTokens
          .filter((token) => {
            if (!type) {
              return (
                (token.models[nameSpace].Token
                  ?.token_data_type as unknown as string) === selectedType
              );
            }
            return true;
          })
          .map((token) => {
            const tokenModel = token.models[nameSpace].Token!;
            return (
              <div
                className={`w-full flex flex-col hover:bg-terminal-green/10 hover:cursor-pointer px-5 py-2 ${
                  selectedToken?.token === tokenModel?.token
                    ? "bg-terminal-green/75 text-terminal-black"
                    : ""
                }`}
                key={token.entityId}
                onClick={() => {
                  setSelectedToken(tokenModel as InputToken);
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
