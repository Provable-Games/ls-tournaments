import { useState, useEffect } from "react";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { useProvider } from "@starknet-react/core";

export const useLordsCost = () => {
  const [lordsCost, setLordsCost] = useState<bigint>();
  const [isLoading, setIsLoading] = useState(true);
  const { lootSurvivor } = useTournamentContracts();
  const { provider } = useProvider();

  useEffect(() => {
    if (!lootSurvivor || !provider) {
      return;
    }

    const fetchVRFCost = async () => {
      try {
        const result = await provider.callContract({
          contractAddress: lootSurvivor,
          entrypoint: "get_cost_to_play",
          calldata: [],
        });

        if (result && Array.isArray(result) && result[0]) {
          setLordsCost(BigInt(result[0]));
        }
      } catch (error) {
        console.error("Error fetching VRF cost:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVRFCost();
  }, [lootSurvivor, provider]); // Include both dependencies

  return {
    lordsCost,
    isLoading,
  };
};
