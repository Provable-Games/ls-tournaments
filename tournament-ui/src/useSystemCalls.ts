import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "./hooks/useDojoStore";
import { useDojo } from "./DojoContext";
import { v4 as uuidv4 } from "uuid";
import { Token } from "@/lib/types";
import {
  Tournament,
  Premium,
  GatedTypeEnum,
  TournamentPrize,
  GatedEntryTypeEnum,
} from "@/generated/models.gen";
import {
  Account,
  BigNumberish,
  CairoOption,
  CallData,
  Uint256,
  addAddressPadding,
} from "starknet";
import { useToast } from "@/hooks/useToast";
import { useOptimisticUpdates } from "@/hooks/useOptimisticUpdates";
import { feltToString, getRandomInt } from "@/lib/utils";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import { ChainId } from "@/config";

export function selectTournament(client: any, isMainnet: boolean): any {
  return isMainnet ? client["LSTournament"] : client["tournament_mock"];
}

export const useSystemCalls = () => {
  const state = useDojoStore((state) => state);

  const { client, selectedChainConfig } = useDojo();
  const { account, address } = useAccount();
  const { toast } = useToast();
  const {
    applyRegisterTokensUpdate,
    applyTournamentEntryUpdate,
    applyTournamentStartUpdate,
    applyTournamentCreateUpdate,
    applyTournamentSubmitScoresUpdate,
    applyTournamentPrizeUpdate,
    applyTournamentCreateAndAddPrizesUpdate,
  } = useOptimisticUpdates();
  const { tournament } = useTournamentContracts();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  // Tournament

  const registerTokens = async (tokens: Token[]) => {
    const { wait, revert, confirm } = applyRegisterTokensUpdate(tokens);

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.registerTokens(account!, tokens)
        : tournamentContract.registerTokens(account!, tokens);

      await wait();

      if (tx) {
        toast({
          title: "Registered Tokens!",
          description: `Registered tokens`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing register tokens:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const createTournament = async (
    tournamentId: BigNumberish,
    tournament: Tournament
  ) => {
    const { wait, revert, confirm } = applyTournamentCreateUpdate(
      tournamentId,
      tournament.name,
      tournament.description,
      address!,
      tournament.registration_start_time,
      tournament.registration_end_time,
      tournament.start_time,
      tournament.end_time,
      tournament.submission_period,
      tournament.winners_count,
      tournament.gated_type as CairoOption<GatedTypeEnum>,
      tournament.entry_premium as CairoOption<Premium>
    );

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.createTournament(
            account!,
            tournament.name,
            tournament.description,
            tournament.registration_start_time,
            tournament.registration_end_time,
            tournament.start_time,
            tournament.end_time,
            tournament.submission_period,
            tournament.winners_count,
            tournament.gated_type as CairoOption<GatedTypeEnum>,
            tournament.entry_premium as CairoOption<Premium>
          )
        : tournamentContract.createTournament(
            account!,
            tournament.name,
            tournament.description,
            tournament.registration_start_time,
            tournament.registration_end_time,
            tournament.start_time,
            tournament.end_time,
            tournament.submission_period,
            tournament.winners_count,
            tournament.gated_type as CairoOption<GatedTypeEnum>,
            tournament.entry_premium as CairoOption<Premium>
          );

      await wait();

      if (tx) {
        toast({
          title: "Created Tournament!",
          description: `Created tournament ${feltToString(tournament.name)}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing create tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const enterTournament = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    newEntryCount: BigNumberish,
    newEntryAddressCount: BigNumberish,
    gatedSubmissionType: CairoOption<GatedEntryTypeEnum>
  ) => {
    const { wait, revert, confirm } = applyTournamentEntryUpdate(
      tournamentId,
      newEntryCount,
      newEntryAddressCount,
      address
    );

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.enterTournament(
            account!,
            tournamentId,
            gatedSubmissionType
          )
        : tournamentContract.enterTournament(
            account!,
            tournamentId,
            gatedSubmissionType
          );

      await wait();

      if (tx) {
        toast({
          title: "Entered Tournament!",
          description: `Entered tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing enter tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const approveAndEnterTournament = async (
    entryFeeToken: CairoOption<Premium>,
    tournamentId: BigNumberish,
    tournamentName: string,
    newEntryCount: BigNumberish,
    newEntryAddressCount: BigNumberish,
    gatedSubmissionType: CairoOption<GatedEntryTypeEnum>
  ) => {
    const { wait, revert, confirm } = applyTournamentEntryUpdate(
      tournamentId,
      newEntryCount,
      newEntryAddressCount,
      address
    );

    try {
      let calls = [];
      if (entryFeeToken.isSome()) {
        calls.push({
          contractAddress: entryFeeToken.Some?.token!,
          entrypoint: "approve",
          calldata: CallData.compile([
            tournament,
            entryFeeToken.Some?.token_amount!,
            "0",
          ]),
        });
      }
      calls.push({
        contractAddress: tournament,
        entrypoint: "enter_tournament",
        calldata: CallData.compile([tournamentId, gatedSubmissionType]),
      });

      const tx = await (account as Account)?.execute(calls);

      await wait();

      if (tx) {
        toast({
          title: "Entered Tournament!",
          description: `Entered tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing enter tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const startTournament = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    startAll: boolean,
    startCount: CairoOption<number>,
    usableGoldenTokens: any[],
    usableBlobertTokens: any[],
    newAddressStartCount: BigNumberish,
    weapon: BigNumberish,
    name: BigNumberish
  ) => {
    const randomInt = getRandomInt(
      0,
      (selectedChainConfig?.clientRewardAddress?.length ?? 1) - 1
    );
    const selectedRevenueAddress =
      selectedChainConfig?.clientRewardAddress?.[randomInt];

    const { wait, revert, confirm } = applyTournamentStartUpdate(
      tournamentId,
      newAddressStartCount,
      addAddressPadding(address ?? "0x0")
    );

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.startTournament(
            account!,
            Number(tournamentId),
            startAll,
            startCount,
            selectedRevenueAddress,
            usableGoldenTokens,
            usableBlobertTokens,
            weapon,
            name
          )
        : tournamentContract.startTournament(
            account!,
            Number(tournamentId),
            startAll,
            startCount,
            selectedRevenueAddress,
            usableGoldenTokens,
            usableBlobertTokens,
            weapon,
            name
          );

      await wait();

      if (tx) {
        toast({
          title: "Started Tournament!",
          description: `Started tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing create tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const startTournamentAndApproveTokens = async (
    approvalCalls: any[],
    tournamentId: BigNumberish,
    tournamentName: string,
    startAll: boolean,
    startCount: CairoOption<number>,
    usableGoldenTokens: any[],
    usableBlobertTokens: any[],
    newAddressStartCount: BigNumberish,
    weapon: BigNumberish,
    name: BigNumberish
  ) => {
    const randomInt = getRandomInt(
      0,
      (selectedChainConfig?.clientRewardAddress?.length ?? 1) - 1
    );
    const selectedRevenueAddress =
      selectedChainConfig?.clientRewardAddress?.[randomInt];

    const { wait, revert, confirm } = applyTournamentStartUpdate(
      tournamentId,
      newAddressStartCount,
      addAddressPadding(address ?? "0x0")
    );

    const totalCalls = [
      ...approvalCalls,
      {
        contractAddress: tournament,
        entrypoint: "start_tournament",
        calldata: CallData.compile([
          tournamentId,
          startAll,
          startCount,
          selectedRevenueAddress!,
          usableGoldenTokens,
          usableBlobertTokens,
          weapon,
          name,
        ]),
      },
    ];

    try {
      const tx = isMainnet
        ? await (account as Account)?.execute(totalCalls)
        : (account as Account)?.execute(totalCalls);

      await wait();

      if (tx) {
        toast({
          title: "Started Tournament!",
          description: `Started tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing create tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const submitScores = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    gameIds: Array<BigNumberish>
  ) => {
    const { wait, revert, confirm } = applyTournamentSubmitScoresUpdate(
      tournamentId,
      gameIds
    );

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.submitScores(account!, tournamentId, gameIds)
        : tournamentContract.submitScores(account!, tournamentId, gameIds);

      await wait();

      if (tx) {
        toast({
          title: "Submitted Scores!",
          description: `Submitted scores for tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing create tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const addPrize = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    prize: TournamentPrize,
    prizeKey: BigNumberish,
    showToast: boolean
  ) => {
    toast({
      title: "Adding Prize...",
      description: `Adding prize for tournament ${tournamentName}`,
    });

    const { wait, revert, confirm } = applyTournamentPrizeUpdate(
      tournamentId,
      prizeKey,
      prize.token,
      prize.token_data_type,
      prize.payout_position
    );

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.addPrize(
            account!,
            tournamentId,
            prize.token,
            prize.token_data_type,
            prize.payout_position
          )
        : tournamentContract.addPrize(
            account!,
            tournamentId,
            prize.token,
            prize.token_data_type,
            prize.payout_position
          );

      await wait();

      if (showToast && tx) {
        toast({
          title: "Added Prize!",
          description: `Added prize for tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing add prize:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const approveAndAddPrize = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    prize: TournamentPrize,
    prizeKey: BigNumberish,
    showToast: boolean
  ) => {
    toast({
      title: "Adding Prize...",
      description: `Adding prize for tournament ${tournamentName}`,
    });

    const { wait, revert, confirm } = applyTournamentPrizeUpdate(
      tournamentId,
      prizeKey,
      prize.token,
      prize.token_data_type,
      prize.payout_position
    );

    try {
      let calls = [];
      calls.push({
        contractAddress: prize.token,
        entrypoint: "approve",
        calldata: CallData.compile([
          tournament,
          prize.token_data_type.activeVariant() === "erc20"
            ? prize.token_data_type.variant.erc20?.token_amount!
            : prize.token_data_type.variant.erc721?.token_id!,
          "0",
        ]),
      });
      calls.push({
        contractAddress: tournament,
        entrypoint: "add_prize",
        calldata: CallData.compile([
          tournamentId,
          prize.token,
          prize.token_data_type,
          prize.payout_position,
        ]),
      });

      const tx = await (account as Account)?.execute(calls);

      await wait();

      if (showToast && tx) {
        toast({
          title: "Added Prize!",
          description: `Added prize for tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing add prize:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const createTournamentAndAddPrizes = async (
    tournamentId: BigNumberish,
    tournament: Tournament,
    prizes: TournamentPrize[]
  ) => {
    const { wait, revert, confirm } = applyTournamentCreateAndAddPrizesUpdate(
      tournamentId,
      tournament.name,
      tournament.description,
      address!,
      tournament.registration_start_time,
      tournament.registration_end_time,
      tournament.start_time,
      tournament.end_time,
      tournament.submission_period,
      tournament.winners_count,
      tournament.gated_type as CairoOption<GatedTypeEnum>,
      tournament.entry_premium as CairoOption<Premium>,
      prizes as TournamentPrize[]
    );

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.createTournament_and_addPrizes(
            account!,
            tournament.name,
            tournament.description,
            tournament.registration_start_time,
            tournament.registration_end_time,
            tournament.start_time,
            tournament.end_time,
            tournament.submission_period,
            tournament.winners_count,
            tournament.gated_type as CairoOption<GatedTypeEnum>,
            tournament.entry_premium as CairoOption<Premium>,
            prizes
          )
        : tournamentContract.createTournament_and_addPrizes(
            account!,
            tournament.name,
            tournament.description,
            tournament.registration_start_time,
            tournament.registration_end_time,
            tournament.start_time,
            tournament.end_time,
            tournament.submission_period,
            tournament.winners_count,
            tournament.gated_type as CairoOption<GatedTypeEnum>,
            tournament.entry_premium as CairoOption<Premium>,
            prizes
          );

      await wait();

      if (tx) {
        toast({
          title: "Created Tournament!",
          description: `Created tournament ${feltToString(tournament.name)}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing create tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const distributePrizes = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    prizeKeys: Array<BigNumberish>
  ) => {
    const transactionId = uuidv4();

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.distributePrizes(
            account!,
            tournamentId,
            prizeKeys
          )
        : tournamentContract.distributePrizes(
            account!,
            tournamentId,
            prizeKeys
          );

      if (tx) {
        toast({
          title: "Distributed Prizes!",
          description: `Distributed prizes for tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      state.revertOptimisticUpdate(transactionId);
      console.error("Error executing distribute prizes:", error);
      throw error;
    } finally {
      state.confirmTransaction(transactionId);
    }
  };

  // Loot Survivor

  const setAdventurer = async (adventurerId: BigNumberish, adventurer: any) => {
    const transactionId = uuidv4();

    try {
      const resolvedClient = await client;
      resolvedClient.loot_survivor_mock.setAdventurer(
        account!,
        adventurerId,
        adventurer
      );
    } catch (error) {
      state.revertOptimisticUpdate(transactionId);
      console.error("Error executing distribute prizes:", error);
      throw error;
    } finally {
      state.confirmTransaction(transactionId);
    }
  };

  const mintErc20 = async (recipient: string, amount: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.erc20_mock.mint(account!, recipient, amount);
  };

  const approveErc20 = async (spender: string, amount: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.erc20_mock.approve(account!, spender, amount);
  };

  const getERC20Balance = async (address: string) => {
    const resolvedClient = await client;
    return await resolvedClient.erc20_mock.balanceOf(address);
  };

  const getERC20Allowance = async (owner: string, spender: string) => {
    const resolvedClient = await client;
    return await resolvedClient.erc20_mock.allowance(owner, spender);
  };

  const mintEth = async (recipient: string, amount: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.eth_mock.mint(account as Account, recipient, amount);
  };

  const approveEth = async (spender: string, amount: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.eth_mock.approve(account!, spender, amount);
  };

  const getEthBalance = async (address: string) => {
    const resolvedClient = await client;
    return await resolvedClient.eth_mock.balanceOf(address);
  };

  const getEthAllowance = async (owner: string, spender: string) => {
    const resolvedClient = await client;
    return await resolvedClient.eth_mock.allowance(owner, spender);
  };

  const mintLords = async (recipient: string, amount: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.lords_mock.mint(account!, recipient, amount);
  };

  const approveLords = async (spender: string, amount: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.lords_mock.approve(account!, spender, amount);
  };

  const getLordsBalance = async (address: string) => {
    const resolvedClient = await client;
    return await resolvedClient.lords_mock.balanceOf(address);
  };

  const getLordsAllowance = async (owner: string, spender: string) => {
    const resolvedClient = await client;
    return await resolvedClient.lords_mock.allowance(owner, spender);
  };

  const mintErc721 = async (recipient: string, tokenId: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.erc721_mock.mint(account!, recipient, tokenId);
  };

  const approveErc721 = async (spender: string, tokenId: Uint256) => {
    const resolvedClient = await client;
    await resolvedClient.erc721_mock.approve(account!, spender, tokenId);
  };

  const getErc721Balance = async (address: string) => {
    const resolvedClient = await client;
    return await resolvedClient.erc721_mock.balanceOf(address);
  };

  const getBalanceGeneral = async (tokenAddress: string) => {
    const result = await (account as Account)?.callContract({
      contractAddress: tokenAddress,
      entrypoint: "balance_of",
      calldata: [address!],
    });
    console.log(result);
    return BigInt(result[0]);
  };

  const approveERC20General = async (token: Token) => {
    await (account as Account)?.execute([
      {
        contractAddress: token.token,
        entrypoint: "approve",
        calldata: CallData.compile([
          tournament,
          token.tokenDataType.variant.erc20?.token_amount!,
          "0",
        ]),
      },
    ]);
  };

  const approveERC20Multiple = async (tokens: Token[]) => {
    const summedCalls = Object.values(
      tokens.reduce((acc: { [key: string]: any }, token) => {
        const tokenAddress = token.token;
        if (!acc[tokenAddress]) {
          acc[tokenAddress] = {
            contractAddress: tokenAddress,
            entrypoint: "approve",
            calldata: CallData.compile([
              tournament,
              token.tokenDataType.variant.erc20?.token_amount!,
              "0",
            ]),
            totalAmount: BigInt(
              token.tokenDataType.variant.erc20?.token_amount! || 0
            ),
          };
        } else {
          // Sum the amounts for the same token
          acc[tokenAddress].totalAmount += BigInt(
            token.tokenDataType.variant.erc20?.token_amount! || 0
          );
          // Update calldata with new total
          acc[tokenAddress].calldata = CallData.compile([
            tournament,
            acc[tokenAddress].totalAmount.toString(),
            "0",
          ]);
        }
        return acc;
      }, {})
    ).map(({ contractAddress, entrypoint, calldata }) => ({
      contractAddress,
      entrypoint,
      calldata,
    }));
    console.log(summedCalls);
    await (account as Account)?.execute(summedCalls);
  };

  const approveERC721General = async (token: Token) => {
    await (account as Account)?.execute([
      {
        contractAddress: token.token,
        entrypoint: "approve",
        calldata: CallData.compile([
          tournament,
          token.tokenDataType.variant.erc721?.token_id!,
          "0",
        ]),
      },
    ]);
  };

  const approveERC721Multiple = async (tokens: Token[]) => {
    let calls = [];
    for (const token of tokens) {
      calls.push({
        contractAddress: token.token,
        entrypoint: "approve",
        calldata: CallData.compile([
          tournament,
          token.tokenDataType.variant.erc721?.token_id!,
          "0",
        ]),
      });
    }
    await (account as Account)?.execute(calls);
  };

  return {
    createTournament,
    enterTournament,
    approveAndEnterTournament,
    startTournament,
    startTournamentAndApproveTokens,
    submitScores,
    registerTokens,
    addPrize,
    approveAndAddPrize,
    createTournamentAndAddPrizes,
    distributePrizes,
    setAdventurer,
    mintErc20,
    approveErc20,
    getERC20Balance,
    getERC20Allowance,
    getEthAllowance,
    getLordsAllowance,
    mintEth,
    approveEth,
    getEthBalance,
    mintLords,
    approveLords,
    getLordsBalance,
    mintErc721,
    approveErc721,
    getErc721Balance,
    getBalanceGeneral,
    approveERC20General,
    approveERC20Multiple,
    approveERC721General,
    approveERC721Multiple,
  };
};
