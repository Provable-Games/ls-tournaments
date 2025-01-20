import { useState, useMemo, useEffect } from "react";
import useUIStore from "@/hooks/useUIStore";
import { useAccount, useProvider } from "@starknet-react/core";
import { indexAddress } from "@/lib/utils";
import { useDojo } from "@/DojoContext";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { getOwnerTokens } from "@/hooks/graphql/queries";
import { useLSQuery } from "@/hooks/useLSQuery";
import { ChainId } from "@/config";

const useFreeGames = () => {
  const { selectedChainConfig } = useDojo();
  const { account } = useAccount();
  const { tokenBalance } = useUIStore();
  const { provider } = useProvider();
  const { goldenToken, blobert, lootSurvivor } = useTournamentContracts();
  const [usableGoldenTokens, setUsableGoldenTokens] = useState<string[]>([]);
  const [usableBlobertTokens, setUsableBlobertTokens] = useState<string[]>([]);

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  const getGoldenTokens = async (
    owner: string,
    goldenTokenAddress: string
  ): Promise<number[]> => {
    const recursiveFetch: any = async (
      goldenTokens: any[],
      nextPageKey: string | null
    ) => {
      let url = `${
        selectedChainConfig.blastRpc
      }/builder/getWalletNFTs?contractAddress=${goldenTokenAddress}&walletAddress=${indexAddress(
        owner
      ).toLowerCase()}&pageSize=100`;

      if (nextPageKey) {
        url += `&pageKey=${nextPageKey}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        goldenTokens = goldenTokens.concat(
          data?.nfts?.map((goldenToken: any) => {
            const tokenId = JSON.parse(goldenToken.tokenId);
            return Number(tokenId);
          })
        );

        if (data.nextPageKey) {
          return recursiveFetch(goldenTokens, data.nextPageKey);
        }
      } catch (ex) {
        console.log("error fetching golden tokens", ex);
      }

      return goldenTokens;
    };

    let goldenTokenData = await recursiveFetch([], null);

    return goldenTokenData;
  };

  const blobertTokenVariables = useMemo(() => {
    return {
      token: indexAddress(blobert ?? ""),
      owner: indexAddress(account?.address ?? "").toLowerCase(),
    };
  }, [account?.address]);

  const { data: blobertsData } = useLSQuery(
    getOwnerTokens,
    blobertTokenVariables
  );

  const getUsableBlobertToken = async (bloberts: any[]) => {
    const usableTokens: string[] = [];
    for (let blobert of bloberts) {
      const canPlay = await provider.callContract({
        contractAddress: lootSurvivor,
        entrypoint: "free_game_available",
        calldata: ["1", blobert.tokenId.toString()],
      });
      if ((canPlay[0] as unknown as string) !== "0x0") {
        usableTokens.push(blobert.tokenId.toString());
      }
    }
    setUsableBlobertTokens(usableTokens);
  };

  const getUsableGoldenToken = async (tokenIds: number[]) => {
    const usableTokens: string[] = [];
    for (let tokenId of tokenIds) {
      const canPlay = await provider.callContract({
        contractAddress: lootSurvivor,
        entrypoint: "free_game_available",
        calldata: ["0", tokenId.toString()],
      });
      if ((canPlay[0] as unknown as string) !== "0x0") {
        usableTokens.push(tokenId.toString());
      }
    }
    setUsableGoldenTokens(usableTokens);
  };

  useEffect(() => {
    if (isMainnet) {
      if (account?.address && tokenBalance.goldenToken) {
        getGoldenTokens(account.address, goldenToken).then(
          getUsableGoldenToken
        );
      }
    } else {
      setUsableGoldenTokens([]);
    }
  }, [account?.address, tokenBalance.goldenToken, isMainnet]);

  useEffect(() => {
    if (isMainnet) {
      if (blobertsData) {
        getUsableBlobertToken(blobertsData.tokens);
      }
    } else {
      setUsableBlobertTokens([]);
    }
  }, [blobertsData, isMainnet]);

  return {
    usableGoldenTokens,
    usableBlobertTokens,
  };
};

export default useFreeGames;
