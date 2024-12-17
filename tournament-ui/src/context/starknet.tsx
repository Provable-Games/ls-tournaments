"use client";
import { useMemo } from "react";
import { Chain } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig } from "@starknet-react/core";
import React from "react";
import { useChainConnectors } from "../lib/connectors";
import {
  DojoAppConfig,
  dojoContextConfig,
  getDojoChainConfig,
} from "../config";
import { getStarknetProviderChains } from "@/config";

export function StarknetProvider({
  children,
  dojoAppConfig,
}: {
  children: React.ReactNode;
  dojoAppConfig: DojoAppConfig;
}) {
  function rpc(chain: Chain) {
    const nodeUrl = chain.rpcUrls.default.http[0];
    return {
      nodeUrl,
    };
  }
  const provider = jsonRpcProvider({ rpc });

  const chains: Chain[] = useMemo(
    () => getStarknetProviderChains(dojoAppConfig.supportedChainIds),
    [dojoAppConfig]
  );

  const selectedChainId = useMemo(
    () => dojoAppConfig.initialChainId,
    [dojoAppConfig]
  );

  const selectedChainConfig = useMemo(
    () => getDojoChainConfig(selectedChainId),
    [dojoContextConfig, selectedChainId]
  );

  console.log(selectedChainConfig);

  const chainConnectors = useChainConnectors(
    dojoAppConfig,
    selectedChainConfig!
  );

  return (
    <StarknetConfig
      autoConnect={true}
      chains={chains}
      connectors={chainConnectors}
      provider={() => provider(selectedChainConfig?.chain!)}
    >
      {children}
    </StarknetConfig>
  );
}
