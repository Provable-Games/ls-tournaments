import { useState, useMemo, useEffect } from "react";
import useUIStore from "@/hooks/useUIStore";
import { useAccount, useProvider } from "@starknet-react/core";
import { indexAddress } from "@/lib/utils";
import { useDojo } from "@/DojoContext";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { getOwnerTokens } from "@/hooks/graphql/queries";
import { useLSQuery } from "@/hooks/useLSQuery";

const useFreeGames = () => {
  const {
    setup: { selectedChainConfig },
  } = useDojo();
  const { account } = useAccount();
  const { tokenBalance } = useUIStore();
  const { provider } = useProvider();
  const { goldenToken, blobert, lootSurvivor } = useTournamentContracts();
  const [usableGoldenTokens, setUsableGoldenTokens] = useState<number[]>([]);
  const [usableBlobertTokens, setUsableBlobertTokens] = useState<number[]>([]);

  const isMainnet = selectedChainConfig.chainId === "SN_MAINNET";

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
      token: indexAddress(blobert),
      owner: indexAddress(account?.address ?? "").toLowerCase(),
    };
  }, [account?.address]);

  const { data: blobertsData } = useLSQuery(
    getOwnerTokens,
    blobertTokenVariables
  );

  const getUsableBlobertToken = async (tokenIds: number[]) => {
    for (let tokenId of tokenIds) {
      const canPlay = await provider.callContract({
        contractAddress: lootSurvivor,
        entrypoint: "free_game_available",
        calldata: ["1", tokenId.toString()],
      });
      if (canPlay) {
        setUsableBlobertTokens([...usableBlobertTokens, tokenId]);
      }
    }
  };

  const getUsableGoldenToken = async (tokenIds: number[]) => {
    for (let tokenId of tokenIds) {
      const canPlay = await provider.callContract({
        contractAddress: lootSurvivor,
        entrypoint: "free_game_available",
        calldata: ["0", tokenId.toString()],
      });
      if (canPlay) {
        setUsableGoldenTokens([...usableGoldenTokens, tokenId]);
      }
    }
  };

  useEffect(() => {
    if (isMainnet) {
      if (account?.address && tokenBalance.goldenToken) {
        getGoldenTokens(account.address, goldenToken).then(
          getUsableGoldenToken
        );
      }
    } else {
      const arr = Array.from(
        { length: Number(tokenBalance.goldenToken) },
        (_, i) => i + 1
      );
      setUsableGoldenTokens(arr);
    }
  }, [account?.address, tokenBalance.goldenToken, isMainnet]);

  useEffect(() => {
    if (isMainnet) {
      if (blobertsData) {
        getUsableBlobertToken(blobertsData);
      }
    } else {
      const arr = Array.from(
        { length: Number(tokenBalance.blobert) },
        (_, i) => i + 1
      );
      setUsableBlobertTokens(arr);
    }
  }, [blobertsData, isMainnet]);

  return {
    usableGoldenTokens,
    usableBlobertTokens,
  };
};

export default useFreeGames;
