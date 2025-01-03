import { useDojoStore } from "./hooks/useDojoStore";
import { SchemaType, ModelTypes } from "./generated/models.gen";

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
function useModel<
  N extends keyof SchemaType,
  M extends keyof SchemaType[N] & keyof ModelTypes[N] & string
>(entityId: string, model: `${N}-${M}`): ModelTypes[N][M] {
  const [namespace, modelName] = model.split("-") as [N, M];

  // Select only the specific model data for the given entityId
  const modelData = useDojoStore(
    (state) =>
      state.entities[entityId]?.models?.[namespace]?.[
        modelName
      ] as unknown as SchemaType[N][M] as unknown as ModelTypes[N][M]
  );

  return modelData;
}

export default useModel;
