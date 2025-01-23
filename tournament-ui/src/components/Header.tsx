import { Button } from "./buttons/Button";
import { CartridgeIcon, LOGO, LogoutIcon } from "./Icons";
import { displayAddress } from "@/lib/utils";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { checkCartridgeConnector } from "../lib/connectors";
import { useDojo } from "../DojoContext";
import { useConnectToSelectedChain } from "@/lib/dojo/hooks/useChain";
import {
  useControllerUsername,
  useControllerProfile,
  isControllerAccount,
} from "@/hooks/useController";
import useUIStore from "@/hooks/useUIStore";
import { ChainId } from "@/config";

export default function Header() {
  const { account } = useAccount();
  const { connector } = useConnect();
  const { disconnect } = useDisconnect();
  const { connect } = useConnectToSelectedChain();
  const isController = isControllerAccount();
  const { username } = useControllerUsername();
  const { openProfile } = useControllerProfile();
  const { selectedChainConfig } = useDojo();
  const { tokenBalance, setShowLoginDialog } = useUIStore();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  const checkCartridge = checkCartridgeConnector(connector);

  return (
    <div className="flex flex-row justify-between px-1 h-10 ">
      <div className="flex flex-row items-center gap-2 sm:gap-5 fill-current w-24 md:w-32 xl:w-40 2xl:w-60 2xl:mb-5">
        <LOGO />
      </div>
      <div className="flex flex-row items-center self-end sm:gap-1 self-center">
        <div className="hidden sm:flex flex-row">
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
                if (isMainnet) {
                  if (!account) {
                    setShowLoginDialog(true);
                  } else if (isController) {
                    openProfile();
                  }
                } else {
                  if (account) {
                    openProfile();
                  } else {
                    connect();
                  }
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
                if (isMainnet) {
                  if (!account) {
                    setShowLoginDialog(true);
                  } else if (isController) {
                    openProfile();
                  }
                } else {
                  if (account) {
                    openProfile();
                  } else {
                    connect();
                  }
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
          {account && (
            <Button
              variant="outline"
              onClick={() => {
                disconnect();
              }}
            >
              <span className="fill-current w-4 h-5">
                <LogoutIcon />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
