import { useState } from "react";
import { Button } from "@/components/buttons/Button";
import { CairoCustomEnum } from "starknet";
import { useDojoStore } from "@/hooks/useDojoStore";
import { displayAddress } from "@/lib/utils";
import {
  TokenDataTypeEnum,
  TournamentPrize,
  Token,
} from "@/generated/models.gen";
import { useDojo } from "@/DojoContext";

interface PrizeProps {
  onSubmit: (prize: TournamentPrize) => void;
}

const Prizes = ({ onSubmit }: PrizeProps) => {
  const state = useDojoStore((state) => state);
  const { nameSpace } = useDojo();
  const [selectedType, setSelectedType] = useState<"erc20" | "erc721">("erc20");

  const [prize, setPrize] = useState<TournamentPrize>({
    tournament_id: 1,
    token: "",
    payout_position: 0,
    token_data_type: new CairoCustomEnum({
      erc20: {
        token_amount: 0,
      },
      erc721: undefined,
    }) as TokenDataTypeEnum,
    prize_key: "",
    claimed: false,
  });

  const updatePosition = (newPosition: number) => {
    setPrize({
      ...prize,
      payout_position: newPosition,
    });
  };

  const updateTokenData = (token_data: number) => {
    if (selectedType === "erc20") {
      let token_data_type = new CairoCustomEnum({
        erc20: {
          token_amount: token_data * 10 ** 18,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum;
      setPrize({
        ...prize,
        token_data_type: token_data_type,
      });
    } else {
      let token_data_type = new CairoCustomEnum({
        erc20: undefined,
        erc721: {
          token_id: token_data,
        },
      }) as TokenDataTypeEnum;
      setPrize({
        ...prize,
        token_data_type: token_data_type,
      });
    }
  };

  const tokens = state.getEntitiesByModel(nameSpace, "Token");

  const filteredTokens = tokens.filter((token) => {
    if (selectedType) {
      return (
        (
          token.models[nameSpace].Token as unknown as Token
        ).token_data_type?.activeVariant() === selectedType
      );
    }
    return true;
  });

  const token_data =
    prize.token_data_type.activeVariant() === "erc20"
      ? prize.token_data_type.variant.erc20.token_amount / 10 ** 18
      : prize.token_data_type.variant.erc721.token_id;

  console.log(prize);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row w-full items-center bg-terminal-green/50 text-terminal-black h-10 px-5 justify-between">
        <div className="flex flex-row items-center gap-5">
          <p className="text-2xl uppercase">Select Token</p>
          <div className="flex flex-row items-center gap-5">
            <Button
              className={selectedType === "erc20" ? "bg-terminal-green/75" : ""}
              variant={selectedType === "erc20" ? "default" : "token"}
              onClick={() => setSelectedType("erc20")}
            >
              ERC20
            </Button>
            <Button
              className={
                selectedType === "erc721" ? "bg-terminal-green/75" : ""
              }
              variant={selectedType === "erc721" ? "default" : "token"}
              onClick={() => setSelectedType("erc721")}
            >
              ERC721
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          <p>Token not displaying?</p>
          <Button variant="token" className="hover:text-terminal-black">
            <p>Register Token</p>
          </Button>
        </div>
      </div>
      <div className="h-20 px-10 w-full flex flex-row items-center gap-5 overflow-auto">
        {filteredTokens.map((token) => {
          const tokenModel = token.models[nameSpace].Token as unknown as Token;
          return (
            <Button
              key={token.entityId}
              variant={prize.token === tokenModel?.token ? "default" : "token"}
              onClick={() => {
                setPrize({
                  ...prize,
                  token: tokenModel?.token!,
                });
              }}
              className="relative w-20 !p-2"
            >
              <span className="text-xs uppercase whitespace-nowrap text-ellipsis overflow-hidden w-full">
                {tokenModel?.name}
              </span>
              <span
                className={`absolute top-0 text-xs uppercase ${
                  prize.token === tokenModel?.token
                    ? "default text-terminal-black"
                    : "token text-terminal-green/75"
                }`}
              >
                {tokenModel?.token_data_type?.activeVariant() as string}
              </span>
              <span
                className={`w-full absolute bottom-0 text-xs uppercase ${
                  prize.token === tokenModel?.token
                    ? "default text-terminal-black"
                    : "token text-terminal-green/75"
                }`}
              >
                {displayAddress(tokenModel?.token!)}
              </span>
            </Button>
          );
        })}
      </div>
      <div className="flex flex-row w-full items-center bg-terminal-green text-terminal-black h-10 px-5 justify-between">
        <p className="text-2xl uppercase">
          {selectedType === "erc20" ? "Enter Amount" : "Enter Token ID"}
        </p>
        <p className="text-2xl font-bold">
          {prize.token_data_type.activeVariant() === "erc20"
            ? prize.token_data_type.variant.erc20.token_amount
            : prize.token_data_type.variant.erc721.token_id}
        </p>
      </div>
      <div className="h-20 px-10 w-full flex flex-row items-center justify-center gap-5">
        <div className="flex flex-row items-center gap-5">
          <Button
            variant={token_data === 1 ? "default" : "token"}
            onClick={() => {
              updateTokenData(1);
            }}
          >
            1
          </Button>
          <Button
            variant={token_data === 5 ? "default" : "token"}
            onClick={() => {
              updateTokenData(5);
            }}
          >
            5
          </Button>
          <Button
            variant={token_data === 10 ? "default" : "token"}
            onClick={() => {
              updateTokenData(10);
            }}
          >
            10
          </Button>
          <Button
            variant={token_data === 100 ? "default" : "token"}
            onClick={() => {
              updateTokenData(100);
            }}
          >
            100
          </Button>
          <div className="flex flex-row items-center gap-2">
            <p className="uppercase">Custom:</p>
            <input
              type="number"
              name="position"
              onChange={(e) => {
                updateTokenData(parseInt(e.target.value));
              }}
              className="p-1 m-2 w-20 h-8 2xl:text-2xl bg-terminal-black border border-terminal-green"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full items-center bg-terminal-green text-terminal-black h-10 px-5 justify-between">
        <p className="text-2xl uppercase">Enter Payout Position</p>
        <div className="flex flex-row gap-2">
          <p className="text-lg uppercase font-bold">{`Position: ${prize.payout_position}`}</p>
        </div>
      </div>
      <div className="py-5 w-full flex flex-col items-center h-[200px] overflow-y-scroll">
        <div className="flex flex-row gap-20">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row items-center gap-5">
              <Button
                variant={prize.payout_position === 1 ? "default" : "token"}
                onClick={() => {
                  updatePosition(1);
                }}
              >
                1st
              </Button>
              <Button
                variant={prize.payout_position === 2 ? "default" : "token"}
                onClick={() => {
                  updatePosition(2);
                }}
              >
                2nd
              </Button>
              <Button
                variant={prize.payout_position === 3 ? "default" : "token"}
                onClick={() => {
                  updatePosition(3);
                }}
              >
                3rd
              </Button>
              <div className="flex flex-row items-center gap-2">
                <p className="uppercase">Custom:</p>
                <input
                  type="number"
                  name="position"
                  onChange={(e) => {
                    updatePosition(parseInt(e.target.value));
                  }}
                  className="p-1 m-2 w-20 h-8 2xl:text-2xl bg-terminal-black border border-terminal-green"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="token"
        size="lg"
        onClick={() => {
          onSubmit(prize);
        }}
        disabled={
          prize.payout_position === 0 ||
          prize.token === "" ||
          prize.token_data_type ===
            new CairoCustomEnum({
              erc20: {
                token_amount: 0,
              },
              erc721: undefined,
            })
        }
      >
        Add Prize
      </Button>
    </div>
  );
};

export default Prizes;
