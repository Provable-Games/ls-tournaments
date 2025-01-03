import { useState, useMemo } from "react";
import { Button } from "@/components/buttons/Button";
import { feltToString, bigintToHex } from "@/lib/utils";
import { useVRFCost } from "@/hooks/useVRFCost";
import { useLordsCost } from "@/hooks/useLordsCost";
import { TournamentEntriesAddress, Tournament } from "@/generated/models.gen";
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
import { LORDS, ETH } from "@/components/Icons";
import { WeaponSelect } from "@/components/tournament/WeaponSelect";
import { AdventurerName } from "@/components/tournament/AdventurerName";

interface StartTournamentProps {
  tournamentEntriesAddressModel: TournamentEntriesAddress;
  tournamentModel: Tournament;
  currentAddressStartCount: BigNumberish;
  entryAddressCount: BigNumberish;
  entryCount: BigNumberish;
  usableGoldenTokens: string[];
  usableBlobertTokens: string[];
  isSeason: boolean;
}

const StartTournament = ({
  tournamentEntriesAddressModel,
  tournamentModel,
  currentAddressStartCount,
  entryAddressCount,
  entryCount,
  usableGoldenTokens,
  usableBlobertTokens,
  isSeason,
}: StartTournamentProps) => {
  const [customStartCount, setCustomStartCount] = useState(0);
  const { dollarPrice } = useVRFCost();
  const { lordsCost } = useLordsCost();
  const { tokenBalance, startTournamentData } = useUIStore();
  const navigate = useNavigate();

  const { eth, lords, goldenToken, blobert } = useTournamentContracts();

  const { approveERC20General, approveERC721General, startTournament } =
    useSystemCalls();

  // lords cost
  const totalGamesCost = lordsCost ? lordsCost * BigInt(entryCount) : 0n;
  const totalGamesAddressCost = lordsCost
    ? lordsCost * (isSeason ? 1n : BigInt(entryAddressCount))
    : 0n;
  const totalGamesCustomCost = useMemo(
    () => (lordsCost ? lordsCost * BigInt(customStartCount) : 0n),
    [customStartCount, lordsCost]
  );

  // free game savings
  const freeGameSavings = useMemo(() => {
    return lordsCost
      ? lordsCost *
          BigInt(usableGoldenTokens.length + usableBlobertTokens.length)
      : 0n;
  }, [usableGoldenTokens, usableBlobertTokens, lordsCost]);

  const totalGamesWithSavings = useMemo(() => {
    return BigInt(
      Math.max(Number(totalGamesCost) - Number(freeGameSavings), 0)
    );
  }, [totalGamesCost, freeGameSavings]);

  const addressGamesCostWithSavings = useMemo(() => {
    return BigInt(
      Math.max(Number(totalGamesAddressCost) - Number(freeGameSavings), 0)
    );
  }, [totalGamesAddressCost, freeGameSavings]);

  const customGamesCostWithSavings = useMemo(() => {
    return BigInt(
      Math.max(Number(totalGamesCustomCost) - Number(freeGameSavings), 0)
    );
  }, [totalGamesCustomCost, freeGameSavings]);

  // balance checks
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

      if (customGamesCostWithSavings > 0) {
        const lordsTokenDataType = new CairoCustomEnum({
          erc20: {
            token_amount: customGamesCostWithSavings,
          },
          erc721: undefined,
        }) as TokenDataTypeEnum;

        await approveERC20General({
          token: lords,
          tokenDataType: lordsTokenDataType,
        });
      }

      const ethTokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: totalVRFCost,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

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
              Math.min(
                formatUsableBlobertTokens.length,
                customStartCount - slicedUsableGoldenTokens.length
              ) // account for the golden tokens already we are already providing
            )
          : [];

      for (const goldenTokenId of slicedUsableGoldenTokens) {
        const goldenTokenDataType = new CairoCustomEnum({
          erc20: undefined,
          erc721: {
            token_id: goldenTokenId.low,
          },
        }) as TokenDataTypeEnum;
        await approveERC721General({
          token: goldenToken,
          tokenDataType: goldenTokenDataType,
        });
      }
      for (const blobertTokenId of slicedUsableBlobertTokens) {
        const blobertTokenDataType = new CairoCustomEnum({
          erc20: undefined,
          erc721: {
            token_id: blobertTokenId.low,
          },
        }) as TokenDataTypeEnum;
        await approveERC721General({
          token: blobert,
          tokenDataType: blobertTokenDataType,
        });
      }
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
        ),
        startTournamentData.weapon,
        startTournamentData.name
      );
    }
  };

  const handleStartTournamentAll = async () => {
    if (dollarPrice) {
      const totalVRFCost =
        (BigInt(dollarPrice) * BigInt(entryAddressCount) * 11n) / 10n;

      if (addressGamesCostWithSavings > 0) {
        const lordsTokenDataType = new CairoCustomEnum({
          erc20: {
            token_amount: addressGamesCostWithSavings,
          },
          erc721: undefined,
        }) as TokenDataTypeEnum;

        await approveERC20General({
          token: lords,
          tokenDataType: lordsTokenDataType,
        });
      }

      const ethTokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: totalVRFCost,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

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
                Number(entryAddressCount) - slicedUsableGoldenTokens.length
              )
            )
          : [];

      for (const goldenTokenId of slicedUsableGoldenTokens) {
        const goldenTokenDataType = new CairoCustomEnum({
          erc20: undefined,
          erc721: {
            token_id: goldenTokenId.low,
          },
        }) as TokenDataTypeEnum;
        await approveERC721General({
          token: goldenToken,
          tokenDataType: goldenTokenDataType,
        });
      }
      for (const blobertTokenId of slicedUsableBlobertTokens) {
        const blobertTokenDataType = new CairoCustomEnum({
          erc20: undefined,
          erc721: {
            token_id: blobertTokenId.low,
          },
        }) as TokenDataTypeEnum;
        await approveERC721General({
          token: blobert,
          tokenDataType: blobertTokenDataType,
        });
      }
      await startTournament(
        tournamentModel?.tournament_id!,
        feltToString(tournamentModel?.name!),
        false,
        new CairoOption(CairoOptionVariant.None),
        slicedUsableGoldenTokens,
        slicedUsableBlobertTokens,
        entryAddressCount,
        startTournamentData.weapon,
        startTournamentData.name
      );
    }
  };

  const handleStartTournamentForEveryone = async () => {
    if (dollarPrice) {
      const totalVRFCost = BigInt(dollarPrice) * BigInt(entryCount);

      if (totalGamesWithSavings > 0) {
        const lordsTokenDataType = new CairoCustomEnum({
          erc20: {
            token_amount: totalGamesWithSavings,
          },
          erc721: undefined,
        }) as TokenDataTypeEnum;

        await approveERC20General({
          token: lords,
          tokenDataType: lordsTokenDataType,
        });
      }

      const ethTokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: totalVRFCost,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;

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
              Math.min(
                formatUsableBlobertTokens.length,
                Number(entryCount) - slicedUsableGoldenTokens.length
              )
            )
          : [];

      for (const goldenTokenId of slicedUsableGoldenTokens) {
        const goldenTokenDataType = new CairoCustomEnum({
          erc20: undefined,
          erc721: {
            token_id: goldenTokenId.low,
          },
        }) as TokenDataTypeEnum;
        await approveERC721General({
          token: goldenToken,
          tokenDataType: goldenTokenDataType,
        });
      }
      for (const blobertTokenId of slicedUsableBlobertTokens) {
        const blobertTokenDataType = new CairoCustomEnum({
          erc20: undefined,
          erc721: {
            token_id: blobertTokenId.low,
          },
        }) as TokenDataTypeEnum;
        await approveERC721General({
          token: blobert,
          tokenDataType: blobertTokenDataType,
        });
      }
      await startTournament(
        tournamentModel?.tournament_id!,
        feltToString(tournamentModel?.name!),
        true,
        new CairoOption(CairoOptionVariant.None),
        slicedUsableGoldenTokens,
        slicedUsableBlobertTokens,
        entryCount,
        startTournamentData.weapon,
        startTournamentData.name
      );
    }
  };

  const totalFreeGames = usableGoldenTokens.length + usableBlobertTokens.length;

  console.log(totalGamesAddressCost);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Start Tournament</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      {tournamentEntriesAddressModel || isSeason ? (
        <div className="flex flex-col h-full">
          <div className="w-full flex flex-row justify-center gap-5 p-1">
            <div className="flex flex-col items-center w-1/3">
              {!isSeason ? (
                <>
                  <p className="text-xl uppercase text-terminal-green/75 no-text-shadow text-left">
                    My Games Played
                  </p>
                  <div className="flex flex-row items-center gap-2 px-5 uppercase text-2xl">
                    <p className="uppercase text-2xl">
                      {BigInt(currentAddressStartCount).toString()}
                    </p>
                    /<p> {BigInt(entryAddressCount).toString()}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-row items-center gap-2">
                    <p className="whitespace-nowrap uppercase text-xl text-terminal-green/75 no-text-shadow">
                      Entry Fee
                    </p>
                    <p className="text-lg">100 LORDS</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <p className="whitespace-nowrap text-terminal-green/75 no-text-shadow uppercase text-xl">
                      Requirements
                    </p>
                    <p className="text-lg">1 LSVR</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-center w-1/3">
              <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                Total Games Cost
              </p>
              <div className="relative flex flex-row gap-5">
                {freeGameSavings > 0 && (
                  <p className="absolute text-xl top-[-20px] text-terminal-yellow uppercase">
                    {addressGamesCostWithSavings > 0
                      ? `${Number(
                          addressGamesCostWithSavings / BigInt(10) ** BigInt(18)
                        )} LORDS`
                      : "Free"}
                  </p>
                )}
                <div className="flex flex-row gap-2 items-center">
                  <p
                    className={`uppercase text-xl ${
                      freeGameSavings > 0
                        ? "line-through text-terminal-green/75 no-text-shadow"
                        : ""
                    }`}
                  >
                    {Number(totalGamesAddressCost / BigInt(10) ** BigInt(18))}
                  </p>
                  <span className="flex h-5 w-5 fill-current">
                    <LORDS />
                  </span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <p className="uppercase text-xl">
                    {`$${(
                      Number(0.5) *
                      (isSeason
                        ? 1
                        : Number(tournamentEntriesAddressModel?.entry_count))
                    ).toFixed(2)}`}
                  </p>
                  <span className="flex h-5 w-5 fill-current">
                    <ETH />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center w-1/3">
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
              </div>
              <p className="text-2xl uppercase">{totalFreeGames}</p>
            </div>
          </div>
          <div className="w-full bg-terminal-green/50 h-0.5" />
          <div className="flex flex-col h-full">
            <div className="flex flex-row">
              <WeaponSelect />
              <AdventurerName />
            </div>
            <div className="w-full flex flex-row items-center justify-center gap-2 p-2 h-full">
              {!isSeason && (
                <Button
                  disabled={
                    !tournamentEntriesAddressModel ||
                    entryAddressCount === currentAddressStartCount ||
                    !ethBalanceForStartAll ||
                    !lordsBalanceForStartAll ||
                    !startTournamentData.weapon ||
                    !startTournamentData.name
                  }
                  onClick={handleStartTournamentAll}
                >
                  Start All Games
                </Button>
              )}
              {!isSeason && (
                <Button
                  disabled={
                    !tournamentEntriesAddressModel ||
                    entryAddressCount === currentAddressStartCount ||
                    !ethBalanceForStartEveryone ||
                    !lordsBalanceForStartEveryone ||
                    !startTournamentData.weapon ||
                    !startTournamentData.name
                  }
                  onClick={handleStartTournamentForEveryone}
                >
                  Start For Everyone
                </Button>
              )}
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
                  !lordsBalanceForStartCustom ||
                  !startTournamentData.weapon ||
                  !startTournamentData.name
                }
                onClick={() => handleStartTournamentCustom(customStartCount)}
              >
                Start
              </Button>
            </div>
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
    </div>
  );
};

export default StartTournament;
