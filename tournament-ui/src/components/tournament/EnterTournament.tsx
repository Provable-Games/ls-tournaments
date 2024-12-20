import { Button } from "@/components/buttons/Button";
import { formatNumber } from "@/lib/utils";
import { useLordsCost } from "@/hooks/useLordsCost";
import { Tournament, TournamentEntriesAddress } from "@/generated/models.gen";
import { useSystemCalls } from "@/useSystemCalls";
import { bigintToHex, feltToString } from "@/lib/utils";
import {
  addAddressPadding,
  CairoOption,
  CairoOptionVariant,
  BigNumberish,
} from "starknet";

interface EnterTournamentProps {
  tournamentModel: Tournament;
  tournamentEntriesAddressModel: TournamentEntriesAddress;
  entryCount: BigNumberish;
  entryAddressCount: BigNumberish;
}

const EnterTournament = ({
  tournamentModel,
  tournamentEntriesAddressModel,
  entryCount,
  entryAddressCount,
}: EnterTournamentProps) => {
  const { lordsCost } = useLordsCost();
  const { enterTournament } = useSystemCalls();
  const currentTime = new Date().getTime() / 1000;

  const handleEnterTournament = async () => {
    await enterTournament(
      tournamentModel?.tournament_id!,
      feltToString(tournamentModel?.name!),
      addAddressPadding(bigintToHex(BigInt(entryCount) + 1n)),
      addAddressPadding(bigintToHex(BigInt(entryAddressCount) + 1n)),
      new CairoOption(CairoOptionVariant.None)
    );
  };

  if (Number(tournamentModel?.registration_start_time) > currentTime) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-xl uppercase">
          Tournament has not began registration
        </p>
      </div>
    );
  }

  // TODO: Handle approvals when entr fees are visible

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Enter Tournament</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      <div className="flex flex-col h-full">
        <div className="flex flex-row p-5">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row items-center gap-2">
              <p className="whitespace-nowrap uppercase text-xl text-terminal-green/75 no-text-shadow">
                Entry Fee
              </p>
              <p className="text-lg">100 LORDS</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="whitespace-nowrap text-terminal-green/75 no-text-shadow uppercase text-xl">
                Entry Requirements
              </p>
              <p className="text-lg">1 LSVR</p>
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                Game Cost
              </p>
              <p className="text-xl">
                {formatNumber(
                  lordsCost ? Number(lordsCost / BigInt(10) ** BigInt(18)) : 0
                )}{" "}
                LORDS
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                VRF Cost
              </p>
              <p className="text-xl">$0.50</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-terminal-green/50 h-0.5" />
        <div className="flex flex-row h-full items-center gap-20 p-5">
          <div className="flex flex-row items-center gap-2">
            <h3 className="text-xl uppercase text-terminal-green/75 no-text-shadow ">
              My Entries
            </h3>
            {tournamentEntriesAddressModel ? (
              <p className="uppercase text-2xl">
                {BigInt(tournamentEntriesAddressModel?.entry_count).toString()}
              </p>
            ) : (
              <p className="uppercase">You have no entries</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <Button onClick={handleEnterTournament} size="md">
              Enter Tournament
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterTournament;
