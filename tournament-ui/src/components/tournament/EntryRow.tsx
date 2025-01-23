import { displayAddress } from "@/lib/utils";
import { useStarkName } from "@starknet-react/core";

// First, define the props interface
interface EntryRowProps {
  address: string;
  entryCount: any;
  username?: string;
}

const EntryRow = ({ address, username, entryCount }: EntryRowProps) => {
  const { data: starkName } = useStarkName({
    address: address as `0x${string}`,
  });
  return (
    <tr className="h-8 hover:bg-terminal-green/50 hover:cursor-pointer border border-terminal-green/50">
      <td className="px-2 text-lg uppercase">
        {username ? username : starkName ? starkName : displayAddress(address)}
      </td>
      <td className="text-lg">{BigInt(entryCount).toString() ?? "-"}</td>
    </tr>
  );
};

export default EntryRow;
