import React, { useState } from "react";
import { Button } from "@/components/buttons/Button";
import { formatNumber, getTokenKeyFromValue } from "@/lib/utils";
import { useLordsCost } from "@/hooks/useLordsCost";
import {
  GatedEntryTypeEnum,
  Tournament,
  TournamentEntriesAddress,
} from "@/generated/models.gen";
import { useSystemCalls } from "@/useSystemCalls";
import { bigintToHex, feltToString } from "@/lib/utils";
import {
  addAddressPadding,
  CairoCustomEnum,
  CairoOption,
  CairoOptionVariant,
  BigNumberish,
} from "starknet";
import useUIStore from "@/hooks/useUIStore";
import { TOKEN_ICONS } from "@/lib/constants";
import { useDojo } from "@/DojoContext";
import { useDojoStore } from "@/hooks/useDojoStore";

interface EnterTournamentProps {
  tournamentModel: Tournament;
  tournamentEntriesAddressModel: TournamentEntriesAddress;
  entryCount: BigNumberish;
  entryAddressCount: BigNumberish;
}

const EnterTournament = ({
  tournamentModel,
  tournamentEntriesAddressModel,
  entryCount,
  entryAddressCount,
}: EnterTournamentProps) => {
  const { lordsCost } = useLordsCost();
  const { enterTournament, approveERC20General } = useSystemCalls();
  const { nameSpace } = useDojo();
  const state = useDojoStore();
  const { setInputDialog } = useUIStore();
  const currentTime = new Date().getTime() / 1000;

  const [submittingTokenId, setSubmittingTokenId] = useState<BigNumberish>();
  const [submittingGameIds, _] = useState<BigNumberish[]>();

  const handleEnterTournament = async () => {
    let gatedSubmission: CairoOption<GatedEntryTypeEnum> =
      new CairoOption<GatedEntryTypeEnum>(CairoOptionVariant.None);
    // handle gated submissions
    if (tournamentModel?.gated_type.isSome()) {
      if (tournamentModel?.gated_type.Some?.activeVariant() == "token") {
        const gatedSubmissionType = new CairoCustomEnum({
          token_id: submittingTokenId,
          game_id: undefined,
        });
        gatedSubmission = new CairoOption<GatedEntryTypeEnum>(
          CairoOptionVariant.Some,
          gatedSubmissionType
        );
      } else if (
        tournamentModel?.gated_type.Some?.activeVariant() == "tournament"
      ) {
        const gatedSubmissionType = new CairoCustomEnum({
          token_id: undefined,
          game_id: submittingGameIds,
        });
        gatedSubmission = new CairoOption<GatedEntryTypeEnum>(
          CairoOptionVariant.Some,
          gatedSubmissionType
        );
      }
    }
    // handle entry premiums
    if (tournamentModel?.entry_premium.isSome()) {
      const token = {
        token: tournamentModel?.entry_premium?.Some?.token!,
        tokenDataType: new CairoCustomEnum({
          erc20: {
            token_amount: tournamentModel?.entry_premium?.Some?.token_amount!,
          },
          erc721: undefined,
        }),
      };
      await approveERC20General(token);
    }
    await enterTournament(
      tournamentModel?.tournament_id!,
      feltToString(tournamentModel?.name!),
      addAddressPadding(bigintToHex(BigInt(entryCount) + 1n)),
      addAddressPadding(bigintToHex(BigInt(entryAddressCount) + 1n)),
      gatedSubmission
    );
  };

  const tokens = state.getEntitiesByModel(nameSpace, "Token");

  if (Number(tournamentModel?.registration_start_time) > currentTime) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-xl uppercase">
          Tournament has not began registration
        </p>
      </div>
    );
  }

  const noEntryPremium = tournamentModel.entry_premium.isNone();
  const noGatedType = tournamentModel.gated_type.isNone();

  // TODO: Handle approvals when entr fees are visible

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <p className="text-4xl text-center uppercase">Enter Tournament</p>
        <div className="w-full bg-terminal-green/50 h-0.5" />
      </div>
      <div className="flex flex-col h-full">
        <div className="flex flex-row p-5">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row items-center gap-2">
              <p className="whitespace-nowrap uppercase text-xl text-terminal-green/75 no-text-shadow">
                Entry Fee
              </p>
              {noEntryPremium ? (
                <p className="text-lg">-</p>
              ) : (
                <div className="flex flex-row gap-1 items-center text-lg">
                  <span>
                    {Number(
                      tournamentModel?.entry_premium?.Some?.token_amount ?? 0n
                    ) /
                      10 ** 18}
                  </span>
                  <span>
                    {TOKEN_ICONS[
                      getTokenKeyFromValue(
                        tournamentModel?.entry_premium?.Some?.token!
                      )!
                    ]
                      ? React.createElement(
                          TOKEN_ICONS[
                            getTokenKeyFromValue(
                              tournamentModel?.entry_premium?.Some?.token!
                            )!
                          ]
                        )
                      : tokens.find(
                          (t) =>
                            t.models[nameSpace].Token?.token ===
                            tournamentModel?.entry_premium?.Some?.token!
                        )?.models[nameSpace].Token?.symbol}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="whitespace-nowrap text-terminal-green/75 no-text-shadow uppercase text-xl">
                Requirements
              </p>
              {noGatedType ? (
                <p className="text-lg">-</p>
              ) : tournamentModel?.gated_type?.Some?.activeVariant() ==
                "token" ? (
                <div className="flex flex-row gap-1 items-center text-lg">
                  <span>Holds</span>
                  <span>
                    {TOKEN_ICONS[
                      getTokenKeyFromValue(
                        tournamentModel?.gated_type?.Some?.variant.token.token
                      )!
                    ]
                      ? React.createElement(
                          TOKEN_ICONS[
                            getTokenKeyFromValue(
                              tournamentModel?.gated_type?.Some?.variant.token
                                .token
                            )!
                          ]
                        )
                      : tokens.find(
                          (t) =>
                            t.models[nameSpace].Token?.token ===
                            tournamentModel?.gated_type?.Some?.variant.token
                              .token
                        )?.models[nameSpace].Token?.symbol}
                  </span>
                </div>
              ) : tournamentModel?.gated_type?.Some?.activeVariant() ==
                "tournament" ? (
                <div className="flex flex-row items-center gap-2">
                  <p className="uppercase">Qualified</p>
                  <Button
                    onClick={() =>
                      setInputDialog({
                        type: "tournament-list",
                        props: {
                          tournamentIds:
                            tournamentModel?.gated_type?.Some?.variant.address,
                        },
                      })
                    }
                  >
                    View
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-2">
                  <p className="uppercase text-lg">Whitelisted</p>
                  <Button
                    onClick={() =>
                      setInputDialog({
                        type: "addresses",
                        props: {
                          addresses:
                            tournamentModel?.gated_type?.Some?.variant.address,
                        },
                      })
                    }
                  >
                    List
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                Game Cost
              </p>
              <p className="text-xl">
                {formatNumber(
                  lordsCost ? Number(lordsCost / BigInt(10) ** BigInt(18)) : 0
                )}{" "}
                LORDS
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl uppercase text-terminal-green/75 no-text-shadow">
                VRF Cost
              </p>
              <p className="text-xl">$0.50</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-terminal-green/50 h-0.5" />
        <div className="flex flex-row h-full items-center gap-20 p-5">
          <div className="flex flex-row items-center gap-2">
            <h3 className="text-xl uppercase text-terminal-green/75 no-text-shadow ">
              My Entries
            </h3>
            {tournamentEntriesAddressModel ? (
              <p className="uppercase text-2xl">
                {BigInt(tournamentEntriesAddressModel?.entry_count).toString()}
              </p>
            ) : (
              <p className="uppercase">You have no entries</p>
            )}
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            {tournamentModel?.gated_type.Some?.activeVariant() == "token" && (
              <div className="flex flex-row items-center gap-2">
                <span>Token ID</span>
                <input
                  value={submittingTokenId?.toString()}
                  onChange={(e) => setSubmittingTokenId(e.target.value)}
                  className="text-lg p-1 w-16 h-8 bg-terminal-black border border-terminal-green"
                />
              </div>
            )}
            <Button
              onClick={handleEnterTournament}
              size="md"
              disabled={
                tournamentModel?.gated_type.Some?.activeVariant() == "token" &&
                !submittingTokenId
              }
            >
              Enter Tournament
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterTournament;
