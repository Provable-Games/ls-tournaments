import { useDojo } from "@/DojoContext";
import { TrophyIcon } from "@/components/Icons";
import { displayAddress } from "@/lib/utils";
import { ChainId } from "@/config";

// First, define the props interface
interface GameRowProps {
  rank: number;
  adventurer: any;
}

const GameRow = ({ rank, adventurer }: GameRowProps) => {
  const { selectedChainConfig, nameSpace } = useDojo();
  if (!adventurer) return null;
  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;
  const formattedAdventurer = isMainnet
    ? adventurer
    : adventurer.models[nameSpace].AdventurerModel.adventurer;
  return (
    <tr className="h-8 border border-terminal-green/50">
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
      <td>{formattedAdventurer.health ?? "-"}</td>
    </tr>
  );
};

export default GameRow;
