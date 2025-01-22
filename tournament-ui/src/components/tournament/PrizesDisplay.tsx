import { TrophyIcon } from "@/components/Icons";
import { getOrdinalSuffix } from "@/lib/utils";
import { useDojo } from "@/DojoContext";

interface PrizesDisplayProps {
  prizes: Record<
    string,
    {
      payout_position: string;
      tokens: Record<
        string,
        {
          type: "erc20" | "erc721";
          values: string[];
        }
      >;
    }
  >;
}

const PrizesDisplay = ({ prizes }: PrizesDisplayProps) => {
  const { selectedChainConfig } = useDojo();
  return (
    <div className="flex flex-col gap-2 h-full overflow-scroll item-scroll">
      {Object.entries(prizes).map(([position, prize], index) => (
        <div
          key={index}
          className="flex flex-row items-center no-text-shadow gap-2"
        >
          {BigInt(position) <= 3n ? (
            <span
              className={`w-4 h-4 ${
                BigInt(position) === 1n
                  ? "text-terminal-gold"
                  : BigInt(position) === 2n
                  ? "text-terminal-silver"
                  : "text-terminal-bronze"
              }`}
            >
              <TrophyIcon />
            </span>
          ) : (
            <span className="text-terminal-green/50 text-md no-text-shadow">
              {BigInt(prize.payout_position).toString()}
              <sup>{getOrdinalSuffix(Number(prize.payout_position))}</sup>
            </span>
          )}
          {Object.entries(prize.tokens).map(
            ([tokenSymbol, tokenData], tokenIndex) => (
              <div
                className="flex flex-row items-center gap-2"
                key={tokenSymbol}
              >
                {tokenIndex > 0 && <span>|</span>}
                <span className="text-sm font-bold">
                  {
                    tokenData.type === "erc20"
                      ? tokenData.values[0] // For ERC20, show the amount
                      : tokenData.values.length // For ERC721, show token IDs
                  }
                </span>
                <span
                  className="text-terminal-green cursor-pointer"
                  onClick={() => {
                    window.open(
                      `${selectedChainConfig.blockExplorerUrl}/nft-contract/${tokenData.values[0]}`,
                      "_blank"
                    );
                  }}
                >
                  {tokenSymbol}
                </span>
                {/* {tokenData.type === "erc721" && (
                  <span className="text-sm text-terminal-green/75">
                    {tokenData.values.join(",")}
                  </span>
                )} */}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default PrizesDisplay;
