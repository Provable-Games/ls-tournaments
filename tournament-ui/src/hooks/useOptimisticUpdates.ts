import { BigNumberish, CairoOption } from "starknet";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "@/hooks/useDojoStore";
import { v4 as uuidv4 } from "uuid";
import { useDojo } from "@/DojoContext";
import {
  GatedTypeEnum,
  Premium,
  TokenDataTypeEnum,
  TournamentPrize,
} from "@/generated/models.gen";
import { Token } from "@/lib/types";

const applyModelUpdate = <T extends { [key: string]: any }>(
  draft: any,
  entityId: string,
  nameSpace: string,
  modelName: string,
  data: T
) => {
  if (!draft.entities[entityId]) {
    // Case 1: Entity doesn't exist
    draft.entities[entityId] = {
      entityId,
      models: {
        [nameSpace]: {
          [modelName]: data,
        },
      },
    };
  } else if (!draft.entities[entityId]?.models?.[nameSpace]?.[modelName]) {
    // Case 2: Model doesn't exist in entity
    draft.entities[entityId].models[nameSpace] = {
      ...draft.entities[entityId].models[nameSpace],
      [modelName]: data,
    };
  } else {
    // Case 3: Model exists, update it
    draft.entities[entityId].models[nameSpace][modelName] = {
      ...draft.entities[entityId].models[nameSpace][modelName],
      ...data,
    };
  }
};

export const useOptimisticUpdates = () => {
  const state = useDojoStore((state) => state);
  const { nameSpace } = useDojo();

  const applyRegisterTokensUpdate = (tokens: Token[]) => {
    const entityId = getEntityIdFromKeys([BigInt(tokens[0].token)]);

    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      for (const token of tokens) {
        applyModelUpdate(draft, entityId, nameSpace, "Token", {
          token: token.token,
          token_data_type: token.tokenDataType,
          is_registered: true,
        });
      }
    });

    const waitForEntriesEntityChange = async () => {
      // Wait for all tokens to be processed
      return await Promise.all(
        tokens.map((token) =>
          state.waitForEntityChange(entityId, (entity) => {
            return entity?.models?.[nameSpace]?.Token?.token == token.token;
          })
        )
      );
    };

    return {
      transactionId,
      wait: () => waitForEntriesEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentEntryUpdate = (
    tournamentId: BigNumberish,
    newEntryCount: BigNumberish,
    newEntryAddressCount: BigNumberish,
    accountAddress?: string
  ) => {
    const entriesEntityId = getEntityIdFromKeys([BigInt(tournamentId)]);
    const entriesAddressEntityId = getEntityIdFromKeys([
      BigInt(tournamentId),
      BigInt(accountAddress ?? "0x0"),
    ]);

    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entriesEntityId, nameSpace, "TournamentEntries", {
        tournament_id: tournamentId,
        entry_count: newEntryCount,
      });
      applyModelUpdate(
        draft,
        entriesAddressEntityId,
        nameSpace,
        "TournamentEntriesAddress",
        {
          tournament_id: tournamentId,
          address: accountAddress,
          entry_count: newEntryCount,
        }
      );
    });

    const waitForEntityChanges = async () => {
      const entriesPromise = await state.waitForEntityChange(
        entriesEntityId,
        (entity) => {
          return (
            entity?.models?.[nameSpace]?.TournamentEntries?.entry_count ==
            newEntryCount
          );
        }
      );

      const addressPromise = await state.waitForEntityChange(
        entriesAddressEntityId,
        (entity) => {
          return (
            entity?.models?.[nameSpace]?.TournamentEntriesAddress
              ?.entry_count == newEntryAddressCount
          );
        }
      );

      return await Promise.all([entriesPromise, addressPromise]);
    };

    return {
      transactionId,
      wait: () => waitForEntityChanges(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentStartUpdate = (
    tournamentId: BigNumberish,
    newAddressStartCount: BigNumberish,
    accountAddress?: string
  ) => {
    const startsAddressEntityId = getEntityIdFromKeys([
      BigInt(tournamentId),
      BigInt(accountAddress ?? "0x0"),
    ]);
    const transactionId = uuidv4();

    console.log(startsAddressEntityId, nameSpace, "TournamentStartsAddress", {
      tournament_id: tournamentId,
      address: accountAddress,
      start_count: newAddressStartCount,
    });

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(
        draft,
        startsAddressEntityId,
        nameSpace,
        "TournamentStartsAddress",
        {
          tournament_id: tournamentId,
          address: accountAddress,
          start_count: newAddressStartCount,
        }
      );
    });

    const waitForStartsEntityChange = async () => {
      return await state.waitForEntityChange(
        startsAddressEntityId,
        (entity) => {
          return (
            entity?.models?.[nameSpace]?.TournamentStartsAddress?.start_count ==
            newAddressStartCount
          );
        }
      );
    };

    return {
      transactionId,
      wait: () => waitForStartsEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentCreateUpdate = (
    tournamentId: BigNumberish,
    name: BigNumberish,
    description: string,
    creator: string,
    registration_start_time: BigNumberish,
    registration_end_time: BigNumberish,
    start_time: BigNumberish,
    end_time: BigNumberish,
    submission_period: BigNumberish,
    winners_count: BigNumberish,
    gated_type: CairoOption<GatedTypeEnum>,
    entry_premium: CairoOption<Premium>
  ) => {
    const entityId = getEntityIdFromKeys([BigInt(tournamentId)]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "Tournament", {
        tournament_id: tournamentId,
        name,
        description,
        creator,
        registration_start_time,
        registration_end_time,
        start_time,
        end_time,
        submission_period,
        winners_count,
        gated_type,
        entry_premium,
      });
    });

    const waitForPrizeEntityChange = async () => {
      return await state.waitForEntityChange(entityId, (entity) => {
        return (
          entity?.models?.[nameSpace]?.Tournament?.tournament_id == tournamentId
        );
      });
    };

    return {
      transactionId,
      wait: () => waitForPrizeEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentSubmitScoresUpdate = (
    tournamentId: BigNumberish,
    gameIds: BigNumberish[]
  ) => {
    const entityId = getEntityIdFromKeys([BigInt(tournamentId)]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "TournamentScores", {
        tournament_id: tournamentId,
        top_score_ids: gameIds,
      });
    });

    const waitForPrizeEntityChange = async () => {
      return await state.waitForEntityChange(entityId, (entity) => {
        return (
          entity?.models?.[nameSpace]?.TournamentScores?.top_score_ids ==
          gameIds
        );
      });
    };

    return {
      transactionId,
      wait: () => waitForPrizeEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentPrizeUpdate = (
    tournamentId: BigNumberish,
    prizeKey: BigNumberish,
    token: string,
    token_data_type: TokenDataTypeEnum,
    payout_position: BigNumberish
  ) => {
    const entityId = getEntityIdFromKeys([
      BigInt(tournamentId),
      BigInt(prizeKey),
    ]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "TournamentPrize", {
        tournament_id: tournamentId,
        prize_key: prizeKey,
        token,
        token_data_type,
        payout_position,
        claimed: false,
      });
    });

    const waitForPrizeEntityChange = async () => {
      return await state.waitForEntityChange(entityId, (entity) => {
        return (
          entity?.models?.[nameSpace]?.TournamentPrize?.prize_key == prizeKey
        );
      });
    };

    return {
      transactionId,
      wait: () => waitForPrizeEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentCreateAndAddPrizesUpdate = (
    tournamentId: BigNumberish,
    name: BigNumberish,
    description: string,
    creator: string,
    registration_start_time: BigNumberish,
    registration_end_time: BigNumberish,
    start_time: BigNumberish,
    end_time: BigNumberish,
    submission_period: BigNumberish,
    winners_count: BigNumberish,
    gated_type: CairoOption<GatedTypeEnum>,
    entry_premium: CairoOption<Premium>,
    prizes: TournamentPrize[]
  ) => {
    const entityId = getEntityIdFromKeys([BigInt(tournamentId)]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "Tournament", {
        tournament_id: tournamentId,
        name,
        description,
        creator,
        registration_start_time,
        registration_end_time,
        start_time,
        end_time,
        submission_period,
        winners_count,
        gated_type,
        entry_premium,
      });
      for (const prize of prizes) {
        const entityPrizeId = getEntityIdFromKeys([
          BigInt(tournamentId),
          BigInt(prize.prize_key),
        ]);
        applyModelUpdate(draft, entityPrizeId, nameSpace, "TournamentPrize", {
          tournament_id: tournamentId,
          prize_key: prize.prize_key,
          token: prize.token,
          token_data_type: prize.token_data_type,
          payout_position: prize.payout_position,
          claimed: false,
        });
      }
    });

    const waitForEntityChanges = async () => {
      const tournamentPromise = state.waitForEntityChange(
        entityId,
        (entity) => {
          return (
            entity?.models?.[nameSpace]?.Tournament?.tournament_id ==
            tournamentId
          );
        }
      );

      const prizePromises = prizes.map((prize) => {
        const prizesEntityId = getEntityIdFromKeys([
          BigInt(tournamentId),
          BigInt(prize.prize_key),
        ]);
        return state.waitForEntityChange(prizesEntityId, (entity) => {
          return (
            entity?.models?.[nameSpace]?.TournamentPrize?.prize_key ==
            prize.prize_key
          );
        });
      });

      return await Promise.all([tournamentPromise, ...prizePromises]);
    };

    return {
      transactionId,
      wait: () => waitForEntityChanges(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  return {
    applyRegisterTokensUpdate,
    applyTournamentEntryUpdate,
    applyTournamentStartUpdate,
    applyTournamentCreateUpdate,
    applyTournamentSubmitScoresUpdate,
    applyTournamentPrizeUpdate,
    applyTournamentCreateAndAddPrizesUpdate,
  };
};
