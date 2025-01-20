import { useDojo } from "@/DojoContext";
import { TrophyIcon } from "@/components/Icons";
import { displayAddress } from "@/lib/utils";
import { ChainId } from "@/config";

// First, define the props interface
interface ScoreRowProps {
  rank: number;
  adventurer: any;
  prizes:
    | {
        payout_position: string;
        tokens: Record<
          string,
          {
            type: "erc20" | "erc721";
            values: string[];
          }
        >;
      }
    | undefined;
}

const ScoreRow = ({ rank, adventurer, prizes }: ScoreRowProps) => {
  const { selectedChainConfig, nameSpace } = useDojo();
  if (!adventurer) return null;
  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;
  const formattedAdventurer = isMainnet
    ? adventurer
    : adventurer.models[nameSpace].AdventurerModel.adventurer;
  return (
    <tr className="h-6 border border-terminal-green/50">
      <td className="px-2">
        <div className="flex items-center justify-center">
          {rank === 1 ? (
            <span className="flex w-4 h-6 text-terminal-gold">
              <TrophyIcon />
            </span>
          ) : rank === 2 ? (
            <span className="flex w-4 h-6 text-terminal-silver">
              <TrophyIcon />
            </span>
          ) : rank === 3 ? (
            <span className="flex w-4 h-6 text-terminal-bronze">
              <TrophyIcon />
            </span>
          ) : (
            rank
          )}
        </div>
      </td>
      <td>{formattedAdventurer.name ?? "-"}</td>
      <td>{displayAddress(formattedAdventurer.owner) ?? "-"}</td>
      <td>{formattedAdventurer.id ?? "-"}</td>
      <td>{formattedAdventurer.level ?? "-"}</td>
      <td>{formattedAdventurer.xp ?? "-"}</td>
      <td>
        <span className="flex flex-row gap-2">
          {prizes
            ? Object.entries(prizes.tokens).map(
                ([tokenSymbol, tokenData], tokenIndex) => (
                  <span className="flex flex-row gap-2" key={tokenIndex}>
                    {tokenIndex > 0 && <span>|</span>}
                    <span>
                      {" "}
                      {
                        tokenData.type === "erc20"
                          ? tokenData.values[0] // For ERC20, show the amount
                          : tokenData.values.length // For ERC721, show token IDs
                      }
                    </span>
                    <span>{tokenSymbol}</span>
                  </span>
                )
              )
            : "-"}
        </span>
      </td>
    </tr>
  );
};

export default ScoreRow;
