import { displayAddress } from "@/lib/utils";

// First, define the props interface
interface EntryRowProps {
  address: string;
  entryCount: any;
  username?: string;
}

const EntryRow = ({ address, username, entryCount }: EntryRowProps) => {
  return (
    <tr className="h-8 hover:bg-terminal-green/50 hover:cursor-pointer border border-terminal-green/50">
      <td className="px-2 text-lg uppercase">
        {username ? username : displayAddress(address)}
      </td>
      <td className="text-lg">{BigInt(entryCount).toString() ?? "-"}</td>
    </tr>
  );
};

export default EntryRow;
