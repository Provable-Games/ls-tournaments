import { useState } from "react";
import { BigNumberish, addAddressPadding } from "starknet";
import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/buttons/Button";
import { useGetAdventurersQuery } from "@/hooks/useSdkQueries";
import { useDojoStore } from "@/hooks/useDojoStore";
import { useSystemCalls } from "@/useSystemCalls";
import { bigintToHex, removeFieldOrder } from "@/lib/utils";
import { useDojo } from "@/DojoContext";

const LootSurvivor = () => {
  const { nameSpace } = useDojo();
  const { setAdventurer } = useSystemCalls();
  const { address } = useAccount();
  useGetAdventurersQuery(address ?? "0x0");
  const state = useDojoStore((state) => state);
  const [scores, setScores] = useState<Record<string, number>>({});

  const adventurers = state.getEntitiesByModel(nameSpace, "AdventurerModel");
  const gameIdsModel = state.getEntitiesByModel(nameSpace, "TournamentGame");
  const gameIds =
    gameIdsModel.map(
      (model) => model?.models?.[nameSpace].TournamentGame?.game_id || "0"
    ) ?? [];

  const handleScoreChange = (id: string, value: string) => {
    setScores((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleSetAdventurer = (adventurerId: BigNumberish) => {
    const adventurer = removeFieldOrder({
      fieldOrder: [],
      health: 0,
      xp: scores[adventurerId.toString()] || 0,
      gold: 0,
      beast_health: 0,
      stat_upgrades_available: 0,
      stats: {
        fieldOrder: [],
        strength: 0,
        dexterity: 0,
        vitality: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        luck: 0,
      },
      equipment: {
        fieldOrder: [],
        weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      },
      battle_action_count: 0,
      mutated: false,
      awaiting_item_specials: false,
    });
    setAdventurer(addAddressPadding(bigintToHex(adventurerId)), adventurer);
  };

  return (
    <div className="flex flex-col gap-5 w-full p-4 uppercase text-terminal-green/75 no-text-shadow">
      <h1 className="2xl:text-5xl text-center">Loot Survivor</h1>
      <div className="flex flex-col items-center gap-5">
        <p className="text-2xl">Adventurers</p>
        {gameIds.map((id) => {
          const adventurer = adventurers.find(
            (adventurer) =>
              adventurer.models?.[nameSpace].AdventurerModel?.adventurer_id ===
              id
          );
          const adventurerHealth =
            adventurer?.models?.[nameSpace].AdventurerModel?.adventurer?.health;
          const adventurerScore =
            adventurer?.models?.[nameSpace].AdventurerModel?.adventurer?.xp;
          return (
            <div
              key={id}
              className="flex flex-row gap-10 w-full justify-center"
            >
              <div className="flex flex-row items-center gap-5">
                <p className="text-2xl">Adventurer ID:</p>
                <p className="text-2xl">{BigInt(id).toString()}</p>
              </div>
              <div className="flex flex-row items-center gap-5">
                <p className="text-2xl">Score (XP):</p>
                {adventurerHealth !== 0 ? (
                  <input
                    type="number"
                    value={scores[BigInt(id).toString()] || ""}
                    onChange={(e) =>
                      handleScoreChange(BigInt(id).toString(), e.target.value)
                    }
                    className="px-2 h-8 w-20 2xl:text-2xl bg-terminal-black border border-terminal-green transform"
                  />
                ) : (
                  <p className="text-2xl">{adventurerScore?.toString()}</p>
                )}
              </div>
              <Button
                onClick={() => handleSetAdventurer(BigInt(id).toString())}
                disabled={adventurerHealth === 0}
              >
                Play
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LootSurvivor;
