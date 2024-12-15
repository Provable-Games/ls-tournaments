import { displayAddress } from "@/lib/utils";

// First, define the props interface
interface EntryRowProps {
  name: string;
  address: string;
  entryCount: any;
}

const EntryRow = ({ name, address, entryCount }: EntryRowProps) => {
  return (
    <tr className="h-10">
      <td className="px-2 text-xl uppercase">{name ?? "-"}</td>
      <td className="text-xl uppercase">{displayAddress(address) ?? "-"}</td>
      <td className="text-2xl">{BigInt(entryCount).toString() ?? "-"}</td>
    </tr>
  );
};

export default EntryRow;
