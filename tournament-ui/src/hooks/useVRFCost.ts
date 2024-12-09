import { CairoCustomEnum } from "starknet";
import { useState, useEffect } from "react";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { useProvider } from "@starknet-react/core";

export const useVRFCost = () => {
  const [dollarPrice, setDollarPrice] = useState<bigint>();
  const [isLoading, setIsLoading] = useState(true);
  const { oracle } = useTournamentContracts();
  const { provider } = useProvider();

  useEffect(() => {
    if (!oracle || !provider) {
      return;
    }

    const fetchVRFCost = async () => {
      try {
        const spotEntry = new CairoCustomEnum({
          SpotEntry: "19514442401534788",
          tournament: undefined,
          address: undefined,
        });

        const result = await provider.callContract({
          contractAddress: oracle,
          entrypoint: "get_data_median",
          calldata: [spotEntry],
        });

        if (result && Array.isArray(result) && result[0]) {
          const dollarToWei = BigInt(5) * BigInt(10) ** BigInt(17);
          const ethToWei = BigInt(result[0]) / BigInt(10) ** BigInt(8);
          const price = dollarToWei / ethToWei;
          setDollarPrice(price);
        }
      } catch (error) {
        console.error("Error fetching VRF cost:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVRFCost();
  }, [oracle, provider]); // Include both dependencies

  return {
    dollarPrice,
    isLoading,
  };
};
