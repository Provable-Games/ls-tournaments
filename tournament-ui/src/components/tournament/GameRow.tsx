import { useDojo } from "@/DojoContext";
import { FirstIcon, SecondIcon, ThirdIcon } from "../Icons";
import { displayAddress } from "@/lib/utils";

// First, define the props interface
interface GameRowProps {
  rank: number;
  adventurer: any;
}

const GameRow = ({ rank, adventurer }: GameRowProps) => {
  const { selectedChainConfig } = useDojo();
  if (!adventurer) return null;
  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";
  const formattedAdventurer = isMainnet ? adventurer : adventurer.adventurer;
  return (
    <tr className="h-10">
      <td className="px-2">
        <div className="flex items-center justify-center">
          {rank === 1 ? (
            <span className="flex w-4 h-8">
              <FirstIcon />
            </span>
          ) : rank === 2 ? (
            <span className="flex w-4 h-8">
              <SecondIcon />
            </span>
          ) : rank === 3 ? (
            <span className="flex w-4 h-8">
              <ThirdIcon />
            </span>
          ) : (
            rank
          )}
        </div>
      </td>
      <td>{displayAddress(formattedAdventurer.owner) ?? "-"}</td>
      <td>{formattedAdventurer.id ?? "-"}</td>
      <td>{formattedAdventurer.level ?? "-"}</td>
      <td>{formattedAdventurer.xp ?? "-"}</td>
      <td>{formattedAdventurer.health ?? "-"}</td>
    </tr>
  );
};

export default GameRow;
