import { useEffect, useMemo, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { useDojo } from "@/DojoContext";
import Header from "@/components/Header";
import ScreenMenu from "@/components/ScreenMenu";
import useUIStore, { ScreenPage } from "@/hooks/useUIStore";
import { Menu } from "@/lib//types";
import Overview from "@/containers/Overview";
import MyTournaments from "@/containers/MyTournaments";
import Create from "@/containers/Create";
import RegisterToken from "@/containers/RegisterToken";
import Tournament from "@/containers/Tournament";
import Guide from "@/containers/Guide";
import LootSurvivor from "@/containers/LootSurvivor";
import InputDialog from "@/components/dialogs/inputs/InputDialog";
import {
  useGetTournamentCountsQuery,
  useGetTokensQuery,
  useSubscribeTournamentCountsQuery,
  useGetConfigQuery,
} from "@/hooks/useSdkQueries";
import { useSystemCalls } from "@/useSystemCalls";
import { Toaster } from "@/components/ui/toaster";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { useConfig } from "@/hooks/useConfig";
import { ChainId } from "./config";

function App() {
  const { account } = useAccount();
  const { selectedChainConfig } = useDojo();
  const { tournament, eth, lords, goldenToken, blobert } =
    useTournamentContracts();
  const { getBalanceGeneral } = useSystemCalls();
  const { inputDialog, setTokenBalance } = useUIStore();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  // Getters
  useGetTournamentCountsQuery(tournament);
  useGetTokensQuery();
  useGetConfigQuery(tournament);
  useConfig();

  // // Subscriptions
  useSubscribeTournamentCountsQuery(tournament);

  const testMenuItems: Menu[] = useMemo(
    () => [
      {
        id: 1,
        label: "Overview",
        screen: "overview" as ScreenPage,
        path: "/",
        disabled: false,
      },
      {
        id: 2,
        label: "My Tournaments",
        screen: "my tournaments" as ScreenPage,
        path: "/my-tournaments",
        disabled: false,
      },
      {
        id: 3,
        label: "Create",
        screen: "create" as ScreenPage,
        path: "/create",
        disabled: false,
      },
      {
        id: 4,
        label: "Register Token",
        screen: "register token" as ScreenPage,
        path: "/register-token",
        disabled: false,
      },
      {
        id: 5,
        label: "Guide",
        screen: "guide" as ScreenPage,
        path: "/guide",
        disabled: false,
      },
      {
        id: 6,
        label: "Loot Survivor",
        screen: "loot survivor" as ScreenPage,
        path: "/loot-survivor",
        disabled: false,
      },
    ],
    []
  );

  const mainMenuItems: Menu[] = useMemo(
    () => [
      {
        id: 1,
        label: "Overview",
        screen: "overview" as ScreenPage,
        path: "/",
        disabled: false,
      },
      {
        id: 2,
        label: "My Tournaments",
        screen: "my tournaments" as ScreenPage,
        path: "/my-tournaments",
        disabled: false,
      },
      {
        id: 3,
        label: "Create",
        screen: "create" as ScreenPage,
        path: "/create",
        disabled: false,
      },
      {
        id: 4,
        label: "Guide",
        screen: "guide" as ScreenPage,
        path: "/guide",
        disabled: false,
      },
    ],
    []
  );

  const testMenuDisabled = useMemo(
    () => [false, false, false, false, false, false],
    []
  );

  const mainMenuDisabled = useMemo(
    () => [false, false, false, false, false],
    []
  );

  const menuItems = useMemo(() => {
    return isMainnet ? mainMenuItems : testMenuItems;
  }, [isMainnet]);

  const menuDisabled = useMemo(() => {
    return isMainnet ? mainMenuDisabled : testMenuDisabled;
  }, [isMainnet]);

  const getBalances = useCallback(async () => {
    if (!account?.address) return;

    const [ethBalance, lordsBalance, goldenTokenBalance, blobertBalance] =
      await Promise.all([
        getBalanceGeneral(eth),
        getBalanceGeneral(lords),
        getBalanceGeneral(goldenToken),
        getBalanceGeneral(blobert),
      ]);

    setTokenBalance({
      eth: ethBalance as bigint,
      lords: lordsBalance as bigint,
      goldenToken: goldenTokenBalance as bigint,
      blobert: blobertBalance as bigint,
    });
  }, [account?.address, getBalanceGeneral]);

  useEffect(() => {
    if (account && eth && lords) {
      getBalances();
    }
  }, [account, eth, lords]);

  return (
    <div
      suppressHydrationWarning={false}
      className="min-h-screen overflow-hidden text-terminal-green bg-terminal-black bezel-container w-full"
    >
      <img
        src="/crt_green_mask.png"
        alt="crt green mask"
        className="absolute w-full pointer-events-none crt-frame hidden sm:block"
      />
      <div
        className={`min-h-screen container mx-auto flex flex-col sm:pt-8 sm:p-8 lg:p-10 2xl:p-20 `}
      >
        <Header />
        <div className="w-full h-1 sm:h-6 sm:my-2 bg-terminal-green text-terminal-black px-4" />
        <ScreenMenu buttonsData={menuItems} disabled={menuDisabled} />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/my-tournaments" element={<MyTournaments />} />
          <Route path="/create" element={<Create />} />
          <Route path="/register-token" element={<RegisterToken />} />
          <Route path="/tournament/:id" element={<Tournament />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/loot-survivor" element={<LootSurvivor />} />
        </Routes>
        {inputDialog && <InputDialog />}
        <Toaster />
      </div>
    </div>
  );
}

export default App;
