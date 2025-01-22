import useUIStore from "@/hooks/useUIStore";
import AddPrizeDialog from "@/components/dialogs/inputs/AddPrize";
import GatedTokenDialog from "@/components/dialogs/inputs/GatedToken";
import GatedAddressesDialog from "@/components/dialogs/inputs/GatedAddresses";
import GatedTournamentsDialog from "@/components/dialogs/inputs/GatedTournament";
import EntryFeeDialog from "@/components/dialogs/inputs/EntryFee";
import TokenDialog from "@/components/dialogs/inputs/Token";
import Addresses from "@/components/dialogs/inputs/Addresses";
import TournamentList from "@/components/dialogs/inputs/TournamentList";

const InputDialog = () => {
  const { inputDialog } = useUIStore();

  if (!inputDialog) return null;

  // Map dialog types to their components
  const dialogComponents: Record<string, React.FC<any>> = {
    "add-prize": AddPrizeDialog,
    "gated-token": GatedTokenDialog,
    "gated-addresses": GatedAddressesDialog,
    "gated-tournaments": GatedTournamentsDialog,
    "entry-fee": EntryFeeDialog,
    token: TokenDialog,
    addresses: Addresses,
    "tournament-list": TournamentList,
    // ... other dialogs
  };

  const DialogComponent = dialogComponents[inputDialog.type];
  if (!DialogComponent) return null;

  return <DialogComponent {...(inputDialog.props || {})} />;
};

export default InputDialog;
