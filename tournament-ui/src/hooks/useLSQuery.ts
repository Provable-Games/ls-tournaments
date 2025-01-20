import { useDojo } from "@/DojoContext";
import { useQuery, DocumentNode } from "@apollo/client";
import { ChainId } from "@/config";

type Variables = Record<
  string,
  string | number | number[] | boolean | null | undefined | Date
>;

export const useLSQuery = (query: DocumentNode, variables?: Variables) => {
  const { selectedChainConfig } = useDojo();
  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  const { data, loading, error, refetch } = useQuery(query, {
    variables,
    skip: !isMainnet,
  });

  return {
    data: isMainnet ? data : null,
    loading,
    error,
    isMainnet,
    refetch,
  };
};
