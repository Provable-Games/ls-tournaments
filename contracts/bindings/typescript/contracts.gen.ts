import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {

	const LSTournament_totalTournaments = async () => {
		try {
			return await provider.call("tournament", {
				contractName: "LSTournament",
				entrypoint: "total_tournaments",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_tournament = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("tournament", {
				contractName: "LSTournament",
				entrypoint: "tournament",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_tournamentEntries = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("tournament", {
				contractName: "LSTournament",
				entrypoint: "tournament_entries",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_tournamentPrizeKeys = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("tournament", {
				contractName: "LSTournament",
				entrypoint: "tournament_prize_keys",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_topScores = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("tournament", {
				contractName: "LSTournament",
				entrypoint: "top_scores",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_isTokenRegistered = async (token: string) => {
		try {
			return await provider.call("tournament", {
				contractName: "LSTournament",
				entrypoint: "is_token_registered",
				calldata: [token],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_registerTokens = async (snAccount: Account | AccountInterface, tokens: Array<Token>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "register_tokens",
					calldata: [tokens],
				},
				"tournament",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_createTournament = async (snAccount: Account | AccountInterface, name: BigNumberish, description: string, startTime: BigNumberish, endTime: BigNumberish, submissionPeriod: BigNumberish, winnersCount: BigNumberish, gatedType: models.CairoOption<GatedType>, entryPremium: models.CairoOption<GatedType>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "create_tournament",
					calldata: [name, description, startTime, endTime, submissionPeriod, winnersCount, gatedType, entryPremium],
				},
				"tournament",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_enterTournament = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, gatedSubmissionType: models.CairoOption<GatedType>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "enter_tournament",
					calldata: [tournamentId, gatedSubmissionType],
				},
				"tournament",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_startTournament = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, startAll: boolean, startCount: models.CairoOption<GatedType>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "start_tournament",
					calldata: [tournamentId, startAll, startCount],
				},
				"tournament",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_submitScores = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, gameIds: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "submit_scores",
					calldata: [tournamentId, gameIds],
				},
				"tournament",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_addPrize = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, token: string, tokenDataType: models.TokenDataTypeEnum, position: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "add_prize",
					calldata: [tournamentId, token, tokenDataType, position],
				},
				"tournament",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_distributePrizes = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, prizeKeys: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "distribute_prizes",
					calldata: [tournamentId, prizeKeys],
				},
				"tournament",
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		LSTournament: {
			totalTournaments: LSTournament_totalTournaments,
			tournament: LSTournament_tournament,
			tournamentEntries: LSTournament_tournamentEntries,
			tournamentPrizeKeys: LSTournament_tournamentPrizeKeys,
			topScores: LSTournament_topScores,
			isTokenRegistered: LSTournament_isTokenRegistered,
			registerTokens: LSTournament_registerTokens,
			createTournament: LSTournament_createTournament,
			enterTournament: LSTournament_enterTournament,
			startTournament: LSTournament_startTournament,
			submitScores: LSTournament_submitScores,
			addPrize: LSTournament_addPrize,
			distributePrizes: LSTournament_distributePrizes,
		},
	};
}