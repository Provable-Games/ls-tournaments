import { useDojo } from "@/DojoContext";
import { useQuery, DocumentNode } from "@apollo/client";

type Variables = Record<
  string,
  string | number | number[] | boolean | null | undefined | Date
>;

export const useLSQuery = (query: DocumentNode, variables?: Variables) => {
  const { selectedChainConfig } = useDojo();
  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

  const { data, loading, error } = useQuery(query, {
    variables,
    skip: !isMainnet,
  });

  return {
    data: isMainnet ? data : null,
    loading,
    error,
    isMainnet,
  };
};
