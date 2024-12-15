import { useState, useMemo } from "react";
import { Button } from "@/components/buttons/Button";
import { feltToString, bigintToHex } from "@/lib/utils";
import { useVRFCost } from "@/hooks/useVRFCost";
import { useLordsCost } from "@/hooks/useLordsCost";
import {
  TournamentEntriesAddressModel,
  TournamentModel,
} from "@/generated/models.gen";
import {
  CairoCustomEnum,
  CairoOption,
  CairoOptionVariant,
  addAddressPadding,
  BigNumberish,
} from "starknet";
import { useSystemCalls } from "@/useSystemCalls";
import { TokenDataTypeEnum } from "@/generated/models.gen";
import { useTournamentContracts } from "@/hooks/useTournamentContracts";
import useUIStore from "@/hooks/useUIStore";
import { useNavigate } from "react-router-dom";

interface StartTournamentProps {
  tournamentEntriesAddressModel: TournamentEntriesAddressModel;
  tournamentModel: TournamentModel;
  currentAddressStartCount: BigNumberish;
  entryAddressCount: BigNumberish;
  entryCount: BigNumberish;
  usableGoldenTokens: number[];
  usableBlobertTokens: number[];
}

const StartTournament = ({
  tournamentEntriesAddressModel,
  tournamentModel,
  currentAddressStartCount,
  entryAddressCount,
  entryCount,
  usableGoldenTokens,
  usableBlobertTokens,
}: StartTournamentProps) => {
  const [customStartCount, setCustomStartCount] = useState(0);
  const { dollarPrice } = useVRFCost();
  const { lordsCost } = useLordsCost();
  const { tokenBalance } = useUIStore();
  const navigate = useNavigate();

  const { eth, lords } = useTournamentContracts();

  const { approveERC20General, startTournament } = useSystemCalls();

  const totalGamesCost = lordsCost ? lordsCost * BigInt(entryCount) : 0n;
  const totalGamesAddressCost = lordsCost
    ? lordsCost * BigInt(entryAddressCount)
    : 0n;
  const totalGamesCustomCost = useMemo(
    () => (lordsCost ? lordsCost * BigInt(customStartCount) : 0n),
    [customStartCount, lordsCost]
  );

  const lordsBalanceForStartAll = useMemo(() => {
    return tokenBalance.lords >= totalGamesAddressCost;
  }, [tokenBalance, totalGamesAddressCost]);

  const ethBalanceForStartAll = useMemo(() => {
    return dollarPrice && tokenBalance.eth
      ? BigInt(dollarPrice) * BigInt(entryAddressCount) <= tokenBalance.eth
      : false;
  }, [tokenBalance, dollarPrice, entryAddressCount]);

  const lordsBalanceForStartEveryone = useMemo(() => {
    return tokenBalance.lords >= totalGamesCost;
  }, [tokenBalance, totalGamesCost]);

  const ethBalanceForStartEveryone = useMemo(() => {
    return dollarPrice && tokenBalance.eth
      ? BigInt(dollarPrice) * BigInt(entryCount) <= tokenBalance.eth
      : false;
  }, [tokenBalance, dollarPrice, entryCount]);

  const lordsBalanceForStartCustom = useMemo(() => {
    return tokenBalance.lords >= totalGamesCustomCost;
  }, [tokenBalance, totalGamesCustomCost]);

  const ethBalanceForStartCustom = useMemo(() => {
    return dollarPrice && tokenBalance.eth
      ? BigInt(dollarPrice) * BigInt(customStartCount) <= tokenBalance.eth
      : false;
  }, [tokenBalance, dollarPrice, customStartCount]);

  const notEnoughBalanceMessage = useMemo(() => {
    if (!ethBalanceForStartAll && !lordsBalanceForStartAll) {
      return (
        <p className="text-terminal-yellow no-text-shadow">
          Not enough Lords and ETH
        </p>
      );
    } else if (!ethBalanceForStartAll) {
      return (
        <p className="text-terminal-yellow no-text-shadow">Not enough ETH</p>
      );
    } else if (!lordsBalanceForStartAll) {
      return (
        <p className="text-terminal-yellow no-text-shadow">Not enough Lords</p>
      );
    }
  }, [ethBalanceForStartAll, lordsBalanceForStartAll]);

  const handleChangeStartCount = (e: any) => {
    setCustomStartCount(e.target.value);
  };

  const formatUsableGoldenTokens = useMemo(() => {
    return usableGoldenTokens.map((token) => {
      return { low: token.toString(), high: "0" };
    });
  }, [usableGoldenTokens]);

  const formatUsableBlobertTokens = useMemo(() => {
    return usableBlobertTokens.map((token) => {
      return { low: token.toString(), high: "0" };
    });
  }, [usableBlobertTokens]);

  const handleStartTournamentCustom = async (customStartCount: number) => {
    if (dollarPrice) {
      const totalVRFCost = BigInt(dollarPrice) * BigInt(entryCount);

      const lordsTokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: totalGamesCustomCost,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

      const ethTokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: totalVRFCost,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

      await approveERC20General({
        token: lords,
        tokenDataType: lordsTokenDataType,
      });
      await approveERC20General({
        token: eth,
        tokenDataType: ethTokenDataType,
      });
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 second

      const slicedUsableGoldenTokens =
        formatUsableGoldenTokens?.length > 0
          ? formatUsableGoldenTokens.slice(
              0,
              Math.min(formatUsableGoldenTokens.length, customStartCount)
            )
          : [];
      const slicedUsableBlobertTokens =
        formatUsableBlobertTokens?.length > 0
          ? formatUsableBlobertTokens.slice(
              0,
              Math.min(formatUsableBlobertTokens.length, customStartCount)
            )
          : [];
      await startTournament(
        tournamentModel?.tournament_id!,
        feltToString(tournamentModel?.name!),
        false,
        new CairoOption(CairoOptionVariant.Some, customStartCount),
        slicedUsableGoldenTokens,
        slicedUsableBlobertTokens,
        addAddressPadding(
          bigintToHex(
            BigInt(currentAddressStartCount) + BigInt(customStartCount)
          )
        )
      );
    }
  };

  const handleStartTournamentAll = async () => {
    if (dollarPrice) {
      const totalVRFCost =
        (BigInt(dollarPrice) * BigInt(entryAddressCount) * 11n) / 10n;
      console.log(totalVRFCost);
      console.log(totalGamesAddressCost);

      const lordsTokenDataType = new CairoCustomEnum({
        erc20: {
          // token_amount: totalGamesAddressCost,
          token_amount: 10000000000000000000000n,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

      const ethTokenDataType = new CairoCustomEnum({
        erc20: {
          // token_amount: totalVRFCost,
          token_amount: 1000000000000000000000n,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

      await approveERC20General({
        token: lords,
        tokenDataType: lordsTokenDataType,
      });
      await approveERC20General({
        token: eth,
        tokenDataType: ethTokenDataType,
      });
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 second
      const slicedUsableGoldenTokens =
        formatUsableGoldenTokens?.length > 0
          ? formatUsableGoldenTokens.slice(
              0,
              Math.min(formatUsableGoldenTokens.length, Number(entryCount))
            )
          : [];
      const slicedUsableBlobertTokens =
        formatUsableBlobertTokens?.length > 0
          ? formatUsableBlobertTokens.slice(
              0,
              Math.min(formatUsableBlobertTokens.length, Number(entryCount))
            )
          : [];
      console.log("slicedUsableGoldenTokens", slicedUsableGoldenTokens);
      console.log("slicedUsableBlobertTokens", slicedUsableBlobertTokens);
      await startTournament(
        tournamentModel?.tournament_id!,
        feltToString(tournamentModel?.name!),
        false,
        new CairoOption(CairoOptionVariant.None),
        slicedUsableGoldenTokens,
        slicedUsableBlobertTokens,
        entryAddressCount
      );
    }
  };

  const handleStartTournamentForEveryone = async () => {
    if (dollarPrice) {
      const totalVRFCost = BigInt(dollarPrice) * BigInt(entryCount);

      const lordsTokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: totalGamesCost,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

      const ethTokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: totalVRFCost,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

      await approveERC20General({
        token: lords,
        tokenDataType: lordsTokenDataType,
      });
      await approveERC20General({
        token: eth,
        tokenDataType: ethTokenDataType,
      });

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 second
      const slicedUsableGoldenTokens =
        formatUsableGoldenTokens?.length > 0
          ? formatUsableGoldenTokens.slice(
              0,
              Math.min(
                formatUsableGoldenTokens.length,
                Number(entryAddressCount)
              )
            )
          : [];
      const slicedUsableBlobertTokens =
        formatUsableBlobertTokens?.length > 0
          ? formatUsableBlobertTokens.slice(
              0,
              Math.min(
                formatUsableBlobertTokens.length,
                Number(entryAddressCount)
              )
            )
          : [];
      await startTournament(
        tournamentModel?.tournament_id!,
        feltToString(tournamentModel?.name!),
        true,
        new CairoOption(CairoOptionVariant.None),
        slicedUsableGoldenTokens,
        slicedUsableBlobertTokens,
        entryCount
      );
    }
  };

  const totalFreeGames = usableGoldenTokens.length + usableBlobertTokens.length;

  return (
    <>
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Start Tournament</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      {tournamentEntriesAddressModel ? (
        <div className="flex flex-row gap-5">
          <div className="w-1/2 flex flex-col justify-center gap-5 px-10">
            <div className="flex flex-row items-center w-full gap-2">
              <p className="text-xl uppercase text-terminal-green/75 no-text-shadow text-left">
                My Games Played
              </p>
              <div className="flex flex-row items-center gap-2 px-5 uppercase text-2xl">
                <p className="uppercase text-2xl">
                  {BigInt(currentAddressStartCount).toString()}
                </p>
                /<p> {BigInt(entryAddressCount).toString()}</p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-5">
              <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                Total Games Cost
              </p>
              <div className="flex flex-col">
                <p className="uppercase text-xl">
                  {`${
                    Number(
                      lordsCost ? lordsCost / BigInt(10) ** BigInt(18) : 0
                    ) * Number(tournamentEntriesAddressModel?.entry_count)
                  } LORDS`}
                </p>
                <p className="uppercase text-xl">
                  {`$${(
                    Number(0.5) *
                    Number(tournamentEntriesAddressModel?.entry_count)
                  ).toFixed(2)} ETH`}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <div className="flex flex-col items-center">
                <div className="flex flex-row gap-1">
                  <span className="relative h-5 w-5">
                    <img src="/golden-token.png" alt="golden-token" />
                  </span>
                  <p className="text-xl">/</p>
                  <span className="relative h-5 w-5">
                    <img src="/blobert.png" alt="blobert" />
                  </span>
                </div>
                <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                  Free Games
                </p>
              </div>
              <p className="text-2xl uppercase">{totalFreeGames}</p>
            </div>
          </div>
          <div className="w-1/2 flex flex-col items-end justify-center gap-2 p-2">
            <div className="flex flex-row items-center gap-2 uppercase">
              {notEnoughBalanceMessage}
              <Button
                disabled={
                  !tournamentEntriesAddressModel ||
                  entryAddressCount === currentAddressStartCount ||
                  !ethBalanceForStartAll ||
                  !lordsBalanceForStartAll
                }
                onClick={handleStartTournamentAll}
              >
                Start All Games
              </Button>
            </div>
            <div className="flex flex-row items-center gap-2 uppercase">
              {notEnoughBalanceMessage}
              <Button
                disabled={
                  !tournamentEntriesAddressModel ||
                  entryAddressCount === currentAddressStartCount ||
                  !ethBalanceForStartEveryone ||
                  !lordsBalanceForStartEveryone
                }
                onClick={handleStartTournamentForEveryone}
              >
                Start For Everyone
              </Button>
            </div>
            <div className="flex flex-row items-center gap-2 whitespace-nowrap uppercase">
              {notEnoughBalanceMessage}
              <p
                className={`text-xl uppercase text-terminal-green/75 no-text-shadow ${
                  !tournamentEntriesAddressModel ||
                  entryAddressCount === currentAddressStartCount
                    ? "opacity-50"
                    : ""
                }`}
              >
                Custom
              </p>
              <input
                type="number"
                name="position"
                onChange={handleChangeStartCount}
                max={Number(tournamentEntriesAddressModel?.entry_count)}
                min={1}
                className={`p-1 m-2 w-16 h-8 2xl:text-2xl bg-terminal-black border border-terminal-green ${
                  !tournamentEntriesAddressModel ||
                  entryAddressCount === currentAddressStartCount
                    ? "opacity-50"
                    : ""
                }`}
              />
              <Button
                disabled={
                  !tournamentEntriesAddressModel ||
                  entryAddressCount === currentAddressStartCount ||
                  !ethBalanceForStartCustom ||
                  !lordsBalanceForStartCustom
                }
                onClick={() => handleStartTournamentCustom(customStartCount)}
              >
                Start
              </Button>
            </div>
            <Button
              disabled={
                !tournamentEntriesAddressModel ||
                entryAddressCount === currentAddressStartCount
              }
              onClick={() => handleStartTournamentCustom(customStartCount)}
            >
              Play Loot Survivor
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
          <p className="text-xl text-center uppercase">
            You have not entered any games in this tournament. Find one to enter
            on the overview page.
          </p>
          <Button onClick={() => navigate("/")}>Go to Overview</Button>
        </div>
      )}
    </>
  );
};

export default StartTournament;