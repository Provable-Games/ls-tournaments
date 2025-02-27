import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Connector,
  useAccount,
  useConnect,
  useNetwork,
} from "@starknet-react/core";
import {
  SwitchStarknetChainParameters,
  AddStarknetChainParameters,
} from "get-starknet-core";
import {
  useAddStarknetChain,
  useSwitchStarknetChain,
} from "@/lib/dojo/hooks/useWalletRequest";
import { ChainId, getDojoChainConfig, isChainIdSupported } from "@/config";
import { feltToString } from "@/lib/utils";
import { BigNumberish, Provider } from "starknet";
import { useDojo } from "@/DojoContext";

export const useChainConfig = (chain_id: ChainId | BigNumberish) => {
  const chainId = useMemo<ChainId>(
    () =>
      (typeof chain_id === "string" && !chain_id.startsWith("0x")
        ? chain_id
        : feltToString(chain_id ?? 0n)) as ChainId,
    [chain_id]
  );
  const isSupported = useMemo(() => isChainIdSupported(chainId), [chainId]);
  const chainConfig = useMemo(
    () => getDojoChainConfig(chainId) ?? null,
    [chainId]
  );
  const chainName = useMemo(() => chainConfig?.name ?? null, [chainConfig]);
  return {
    chainId,
    isSupported,
    chainName,
    chainConfig,
  };
};

export const useChainConfigProvider = (
  chain_id: ChainId | BigNumberish
): Provider | null => {
  const { chainConfig } = useChainConfig(chain_id);
  const provider = useMemo(
    () =>
      chainConfig?.rpcUrl
        ? new Provider({ nodeUrl: chainConfig.rpcUrl })
        : null,
    [chainConfig]
  );
  return provider;
};

export const useSelectedChain = () => {
  const { selectedChainConfig } = useDojo();
  const { isConnecting, isConnected, account, connector } = useAccount();
  const { chain } = useNetwork();

  const { chainId: selectedChainId, chainName: selectedChainName } =
    useChainConfig(selectedChainConfig?.chain?.id ?? 0n);
  const { chainId: connectedChainId, chainName: connectedChainName } =
    useChainConfig(chain.id);

  const isCorrectChain = useMemo(() => {
    const result = isConnected && connectedChainId == selectedChainId;
    if (isConnected && !result) {
      console.warn(
        `Connected to [${connectedChainId}], want [${selectedChainId}]`
      );
    }
    return result;
  }, [isConnected, connectedChainId, selectedChainId]);

  return {
    account,
    connector,
    isConnecting,
    isConnected,
    isCorrectChain,
    connectedChainId,
    connectedChainName,
    selectedChainId,
    selectedChainName,
    selectedChainConfig,
  };
};

export const useConnectToSelectedChain = (onConnect?: () => void) => {
  const { connect, connectors } = useConnect();
  const { isConnected, isConnecting } = useAccount();
  const { selectedChainConfig } = useDojo();

  const [requestedConnect, setRequestedConnect] = useState(false);
  useEffect(() => {
    if (requestedConnect && isConnected) {
      onConnect?.();
    }
  }, [requestedConnect, isConnected]);

  let _connect = useCallback(() => {
    if (isConnected) {
      onConnect?.();
    } else if (!isConnecting) {
      // get 1st supported connector on this chain
      const connector = selectedChainConfig?.connectorIds?.reduce(
        (acc: Connector | undefined, id: string) => {
          return acc ?? connectors.find((connector) => connector.id == id);
        },
        undefined as Connector | undefined
      );
      if (connector) {
        console.log(`>> Connecting with [${connector.id}]...`);
        setRequestedConnect(true);
        connect({ connector });
      } else {
        setRequestedConnect(false);
        console.warn(`NO CONNECTOR!`);
      }
    }
  }, [connectors, isConnected, isConnecting]);

  return {
    connect: _connect,
    isConnected,
    isConnecting,
  };
};

//-----------------------------
// Chain switch callbacks
//
interface AddStarknetChainParametersImpl extends AddStarknetChainParameters {
  // accountImplementation: string, // ArgentX class hash (BUGGED)
  accountClassHash: string; // ???
  classHash: string; // ???
  rpcUrl: string;
}
export const useChainSwitchCallbacks = () => {
  const { selectedChainId, selectedChainConfig } = useSelectedChain();

  const switch_params = useMemo(() => {
    const params: SwitchStarknetChainParameters = {
      chainId: selectedChainId,
    };
    return params;
  }, [selectedChainId]);
  const { switch_starknet_chain } = useSwitchStarknetChain(switch_params);

  const add_params = useMemo(() => {
    const params: AddStarknetChainParametersImpl = {
      id: selectedChainId,
      chain_id: selectedChainId,
      chain_name: selectedChainConfig?.name!,
      rpcUrl: selectedChainConfig?.rpcUrl!,
      rpc_urls: [selectedChainConfig?.rpcUrl!],
      native_currency: {
        type: "ERC20",
        options: selectedChainConfig?.chain?.nativeCurrency!,
      },
      accountClassHash: selectedChainConfig?.accountClassHash!,
      classHash: selectedChainConfig?.accountClassHash!,
    };
    return params;
  }, [selectedChainId, selectedChainConfig]);
  const { add_starknet_chain } = useAddStarknetChain(add_params);

  return {
    switch_starknet_chain,
    add_starknet_chain,
  };
};
