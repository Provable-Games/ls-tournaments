import CreatedTable from "@/components/myTournaments/CreatedTable";
import EnteredTable from "@/components/myTournaments/EnteredTable";
import { useAccount } from "@starknet-react/core";

const MyTournaments = () => {
  const { account } = useAccount();
  if (!account) {
    return (
      <div className="w-full h-full flex items-center justify-center text-4xl uppercase">
        Please connect wallet
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5 w-full p-4 uppercase no-text-shadow">
      <div className="flex flex-row gap-2 w-full py-4 uppercase h-[525px]">
        <div className="flex flex-col gap-5 w-1/2"></div>
        <div className="flex flex-col gap-5 w-1/2">
          <CreatedTable />
          <EnteredTable />
        </div>
      </div>
    </div>
  );
};

export default MyTournaments;
