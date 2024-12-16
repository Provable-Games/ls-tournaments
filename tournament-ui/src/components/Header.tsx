import { useState } from "react";
import { Button } from "./buttons/Button";
import { CartridgeIcon, ETH, LORDS, LOGO } from "./Icons";
import {
  displayAddress,
  formatNumber,
  indexAddress,
  formatEth,
} from "@/lib/utils";
import { useAccount, useConnect } from "@starknet-react/core";
import { checkCartridgeConnector } from "../lib/connectors";
import { useDojo } from "../DojoContext";
import { useConnectToSelectedChain } from "@/lib/dojo/hooks/useChain";
import {
  useControllerMenu,
  useControllerUsername,
} from "@/hooks/useController";
import useUIStore from "@/hooks/useUIStore";

export default function Header() {
  const { account } = useAccount();
  const { connector } = useConnect();
  const { connect } = useConnectToSelectedChain();
  const { openMenu } = useControllerMenu();
  const { username } = useControllerUsername();
  const {
    setup: { selectedChainConfig },
  } = useDojo();
  const { tokenBalance } = useUIStore();

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  // const displayCart = useUIStore((state) => state.displayCart);
  // const setDisplayCart = useUIStore((state) => state.setDisplayCart);
  // const displayCartButtonRef = useRef<HTMLButtonElement>(null);

  // const calls = useTransactionCartStore((state) => state.calls);
  // const txInCart = calls.length > 0;

  // const { play: clickPlay } = useUiSounds(soundSelector.click);

  const [showLordsBuy, setShowLordsBuy] = useState(false);

  const checkCartridge = checkCartridgeConnector(connector);

  return (
    <div className="flex flex-row justify-between px-1 h-10 ">
      <div className="flex flex-row items-center gap-2 sm:gap-5 fill-current w-24 md:w-32 xl:w-40 2xl:w-60 2xl:mb-5">
        <LOGO />
      </div>
      <div className="flex flex-row items-center self-end sm:gap-1 self-center">
        <div className="hidden sm:flex flex-row">
          <Button
            size={"xs"}
            variant={"outline"}
            className="self-center xl:px-5"
          >
            <span className="flex flex-row items-center">
              <span className="flex h-5 w-5">
                <ETH />
              </span>
              <p className="text-xl">
                {formatEth(
                  parseInt((tokenBalance.eth ?? 0).toString()) / 10 ** 18
                )}
              </p>
            </span>
          </Button>
          <Button
            size={"xs"}
            variant={"outline"}
            className={`self-center xl:px-5 ${
              isMainnet ? "hover:bg-terminal-green" : ""
            }`}
            onClick={async () => {
              if (isMainnet) {
                const avnuLords = `https://app.avnu.fi/en?tokenFrom=${indexAddress(
                  selectedChainConfig.ethAddress ?? ""
                )}&tokenTo=${indexAddress(
                  selectedChainConfig.lordsAddress ?? ""
                )}&amount=0.001`;
                window.open(avnuLords, "_blank");
              }
            }}
            onMouseEnter={() => isMainnet && setShowLordsBuy(true)}
            onMouseLeave={() => isMainnet && setShowLordsBuy(false)}
          >
            <span className="flex flex-row gap-1 items-center">
              {!showLordsBuy ? (
                <>
                  <span className="flex h-5 w-5 fill-current">
                    <LORDS />
                  </span>
                  <p className="text-xl">
                    {formatNumber(
                      parseInt((tokenBalance.lords ?? 0).toString()) / 10 ** 18
                    )}
                  </p>
                </>
              ) : (
                <p className="text-black">{"Buy Lords"}</p>
              )}
            </span>
          </Button>
          <Button variant="outline">
            <div className="flex flex-row items-center gap-1">
              <span className="relative h-5 w-5">
                <img src="/golden-token.png" alt="golden-token" />
              </span>
              <p className="text-xl">/</p>
              <span className="relative h-5 w-5">
                <img src="/blobert.png" alt="blobert" />
              </span>
              <p className="text-xl">
                {(tokenBalance.goldenToken + tokenBalance.blobert).toString()}
              </p>
            </div>
          </Button>
        </div>
        <span className="sm:hidden flex flex-row gap-2 items-center">
          <div className="relative">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                if (account) {
                  openMenu();
                } else {
                  connect();
                }
              }}
              className="xl:px-5 p-0"
            >
              {account ? (
                username ? (
                  <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">
                    {username}
                  </span>
                ) : (
                  displayAddress(account.address)
                )
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        </span>
        <div className="hidden sm:block sm:flex sm:flex-row sm:items-center sm:gap-1">
          <div className="relative">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                if (account) {
                  openMenu();
                } else {
                  connect();
                }
              }}
              className="xl:px-5"
            >
              {account ? (
                username ? (
                  <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">
                    {username}
                  </span>
                ) : (
                  displayAddress(account.address)
                )
              ) : (
                "Connect"
              )}
            </Button>
            {checkCartridge && (
              <div className="absolute top-0 right-0 w-5 h-5 fill-current text-lg">
                <CartridgeIcon />
              </div>
            )}
          </div>
          <Button variant="outline">
            <span className="text-xl">
              {selectedChainConfig.chainId === "WP_LS_TOURNAMENTS_KATANA"
                ? "Katana"
                : selectedChainConfig.chainId === "SN_MAINNET"
                ? "Mainnet"
                : "Testnet"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
