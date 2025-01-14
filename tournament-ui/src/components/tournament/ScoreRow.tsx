import { useDojo } from "@/DojoContext";
import { FirstIcon, SecondIcon, ThirdIcon } from "../Icons";
import { displayAddress } from "@/lib/utils";
import { ChainId } from "@/config";

// First, define the props interface
interface ScoreRowProps {
  rank: number;
  adventurer: any;
}

const ScoreRow = ({ rank, adventurer }: ScoreRowProps) => {
  const { selectedChainConfig, nameSpace } = useDojo();

  if (!adventurer) return null;
  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;
  const formattedAdventurer = isMainnet
    ? adventurer
    : adventurer.models[nameSpace].AdventurerModel.adventurer;
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
      <td>{formattedAdventurer.prizes ?? "-"}</td>
    </tr>
  );
};

export default ScoreRow;
