import { useMemo } from "react";
import { useDojo } from "../DojoContext";
import { useDeployedContract } from "@/hooks/useDeployedContract";
import { getContractByName } from "@dojoengine/core";
import { Manifest } from "@dojoengine/core";

export type DojoManifest = Manifest & any;

export const useDojoSystem = (systemName: string) => {
  const { manifest, nameSpace } = useDojo();
  return useSystem(nameSpace, systemName, manifest);
};

export const useDeployedDojoSystem = (systemName: string) => {
  const { manifest, nameSpace } = useDojo();
  return useDeployedSystem(nameSpace, systemName, manifest);
};

const useSystem = (
  nameSpace: string,
  systemName: string,
  manifest: DojoManifest
) => {
  const { contractAddress, abi } = useMemo(() => {
    const contract = manifest
      ? getContractByName(manifest, nameSpace, systemName)
      : null;
    return {
      contractAddress: contract?.address ?? null,
      abi: contract?.abi ?? null,
    };
  }, [systemName, manifest]);
  return {
    contractAddress,
    abi,
  };
};

export const useDeployedSystem = (
  nameSpace: string,
  systemName: string,
  manifest: DojoManifest
) => {
  // Find Dojo Contract
  const { contractAddress, abi } = useSystem(nameSpace, systemName, manifest);

  // Check if contract exists
  const { isDeployed, cairoVersion } = useDeployedContract(
    contractAddress,
    abi
  );

  return {
    contractAddress,
    isDeployed,
    cairoVersion,
    abi,
  };
};
