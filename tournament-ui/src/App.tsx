import { useEffect, useMemo, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
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
} from "@/hooks/useSdkQueries";
import { useSystemCalls } from "@/useSystemCalls";
import { useDojo } from "@/DojoContext";
import { Toaster } from "@/components/ui/toaster";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { useConfig } from "@/hooks/useConfig";

function App() {
  const {
    setup: { selectedChainConfig },
  } = useDojo();
  const { account } = useAccount();
  useConfig();
  const { tournament, eth, lords } = useTournamentContracts();
  const { getERC20BalanceGeneral } = useSystemCalls();
  const [tokenBalance, setTokenBalance] = useState<Record<string, bigint>>({});

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  // Getters
  useGetTournamentCountsQuery(tournament);
  useGetTokensQuery();

  // Subscriptions
  useSubscribeTournamentCountsQuery(tournament);

  const { inputDialog } = useUIStore();

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

  // Memoize these functions to prevent recreating on every render
  const getBalances = useCallback(async () => {
    if (!account?.address) return;

    const [ethBalance, lordsBalance] = await Promise.all([
      getERC20BalanceGeneral(eth),
      getERC20BalanceGeneral(lords),
    ]);

    setTokenBalance((prev) => ({
      ...prev,
      eth: ethBalance as bigint,
      lords: lordsBalance as bigint,
    }));
  }, [account?.address, getERC20BalanceGeneral]);

  useEffect(() => {
    if (account && eth && lords) {
      getBalances();
    }
  }, [account, eth, lords]);

  // const getTokenBalances = async () => {
  //   const balances = await sdk.getTokenBalances(
  //     [account?.address!],
  //     [addAddressPadding(eth_mock?.contractAddress!)]
  //   );
  //   console.log(balances);
  // };

  // useEffect(() => {
  //   if (account) {
  //     getTokenBalances();
  //   }
  // }, [account]);

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
        <Header
          ethBalance={tokenBalance.eth}
          lordsBalance={tokenBalance.lords}
        />
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
