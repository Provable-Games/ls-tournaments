import { create } from "zustand";
import { FormData } from "../lib/types";
import { CairoOption, CairoOptionVariant } from "starknet";

export type ScreenPage =
  | "overview"
  | "my tournaments"
  | "create"
  | "register token"
  | "guide"
  | "token";

export type DialogConfig = {
  type: string;
  props?: Record<string, any>;
};

type State = {
  username: string;
  setUsername: (value: string) => void;
  showProfile: boolean;
  setShowProfile: (value: boolean) => void;
  screen: ScreenPage;
  setScreen: (value: ScreenPage) => void;
  inputDialog: DialogConfig | null;
  setInputDialog: (value: DialogConfig | null) => void;
  formData: FormData;
  setFormData: (value: FormData) => void;
  resetFormData: () => void; // Add this new type
  tokenBalance: Record<string, bigint>;
  setTokenBalance: (value: Record<string, bigint>) => void;
};

const initialFormData: FormData = {
  tournamentName: "",
  tournamentDescription: "",
  registrationStartTime: undefined,
  registrationEndTime: undefined,
  startTime: undefined,
  endTime: undefined,
  submissionPeriod: 0,
  scoreboardSize: 0,
  gatedType: new CairoOption(CairoOptionVariant.None),
  entryFee: new CairoOption(CairoOptionVariant.None),
  prizes: [],
};

const useUIStore = create<State>((set) => ({
  username: "",
  setUsername: (value: string) => set({ username: value }),
  showProfile: false,
  setShowProfile: (value: boolean) => set({ showProfile: value }),
  screen: "overview",
  setScreen: (value: ScreenPage) => set({ screen: value }),
  inputDialog: null,
  setInputDialog: (value: DialogConfig | null) => set({ inputDialog: value }),
  formData: initialFormData,
  setFormData: (value: FormData) => set({ formData: value }),
  resetFormData: () => set({ formData: initialFormData }),
  tokenBalance: {
    eth: BigInt(0),
    lords: BigInt(0),
    goldenToken: BigInt(0),
    blobert: BigInt(0),
  },
  setTokenBalance: (value: Record<string, bigint>) =>
    set({ tokenBalance: value }),
}));

export default useUIStore;
