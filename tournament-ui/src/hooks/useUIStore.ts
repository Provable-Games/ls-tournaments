import { create } from "zustand";
import { CreateTournamentData, StartTournamentData } from "../lib/types";
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
  createTournamentData: CreateTournamentData;
  setCreateTournamentData: (value: CreateTournamentData) => void;
  resetCreateTournamentData: () => void;
  startTournamentData: StartTournamentData;
  setStartTournamentData: (value: StartTournamentData) => void;
  tokenBalance: Record<string, bigint>;
  setTokenBalance: (value: Record<string, bigint>) => void;
};

const initialCreateTournamentData: CreateTournamentData = {
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

const initialStartTournamentData: StartTournamentData = {
  name: "",
  weapon: "",
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
  createTournamentData: initialCreateTournamentData,
  setCreateTournamentData: (value: CreateTournamentData) =>
    set({ createTournamentData: value }),
  resetCreateTournamentData: () =>
    set({ createTournamentData: initialCreateTournamentData }),
  startTournamentData: initialStartTournamentData,
  setStartTournamentData: (value: StartTournamentData) =>
    set({ startTournamentData: value }),
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
