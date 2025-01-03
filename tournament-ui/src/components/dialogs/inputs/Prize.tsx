import { useState } from "react";
import { Button } from "@/components/buttons/Button";
import { PlusIcon } from "@/components/Icons";
import { Distribution } from "@/lib/types";
import { CairoCustomEnum } from "starknet";
import { useDojoStore } from "@/hooks/useDojoStore";
import { displayAddress } from "@/lib/utils";
import { TokenDataTypeEnum, TournamentPrize } from "@/generated/models.gen";
import { useDojo } from "@/DojoContext";

interface PrizeProps {
  onSubmit: (prizes: TournamentPrize[]) => void;
}

const Prizes = ({ onSubmit }: PrizeProps) => {
  const state = useDojoStore((state) => state);
  const { nameSpace } = useDojo();

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [distributions, setDistributions] = useState<Distribution[]>([
    { position: 0, percentage: 0 },
  ]);
  const [selectedToken, setSelectedToken] = useState<string>("Lords");

  const updatePosition = (index: number, newPosition: number) => {
    const newDistributions = [...distributions];
    newDistributions[index].position = newPosition;
    setDistributions(newDistributions);
  };

  const updatePercentage = (index: number, newPercentage: number) => {
    const newDistributions = [...distributions];
    newDistributions[index].percentage = newPercentage;
    setDistributions(newDistributions);
  };

  const handleChangeAmout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalAmount(parseInt(e.target.value));
  };

  const tokens = state.getEntitiesByModel(nameSpace, "Token");

  const prizes: TournamentPrize[] = distributions
    .filter((dist) => dist.position !== 0 && dist.percentage !== 0)
    .map((dist) => {
      const tokenDataType = new CairoCustomEnum({
        erc20: {
          token_amount: (totalAmount * dist.percentage) / 100,
        },
        erc721: undefined,
      }) as TokenDataTypeEnum; // Type assertion here

      return {
        tournament_id: 1,
        token: selectedToken,
        payout_position: dist.position,
        token_data_type: tokenDataType,
        prize_key: "",
        claimed: false,
      };
    });

  const totalPercentage = distributions
    .filter((dist) => dist.position !== 0 && dist.percentage !== 0)
    .reduce((sum, dist) => sum + dist.percentage, 0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row w-full items-center bg-terminal-green text-terminal-black h-10 px-5 justify-between">
        <div className="flex flex-row items-center gap-5">
          <p className="text-2xl uppercase">Select Token</p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <p>Token not displaying?</p>
          <Button variant="token" className="hover:text-terminal-black">
            <p>Register Token</p>
          </Button>
        </div>
      </div>
      <div className="h-20 px-10 w-full flex flex-row items-center gap-5 overflow-auto">
        {tokens.map((token) => {
          const tokenModel = token.models[nameSpace].Token;
          return (
            <Button
              key={token.entityId}
              variant={
                selectedToken === tokenModel?.token ? "default" : "token"
              }
              onClick={() => setSelectedToken(tokenModel?.token!)}
              className="relative w-20 !p-2"
            >
              <span className="text-xs uppercase whitespace-nowrap text-ellipsis overflow-hidden w-full">
                {tokenModel?.name}
              </span>
              <span
                className={`absolute top-0 text-xs uppercase ${
                  selectedToken === tokenModel?.token
                    ? "default text-terminal-black"
                    : "token text-terminal-green/75"
                }`}
              >
                {(tokenModel?.token_data_type as unknown as string).toString()}
              </span>
              <span
                className={`w-full absolute bottom-0 text-xs uppercase ${
                  selectedToken === tokenModel?.token
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
        <p className="text-2xl uppercase">Add Amount</p>
        <p className="text-2xl font-bold">
          {isNaN(totalAmount) ? "" : totalAmount}
        </p>
      </div>
      <div className="h-20 px-10 w-full flex flex-row items-center justify-center gap-5">
        <div className="flex flex-row items-center gap-5">
          <Button
            variant={totalAmount === 1 ? "default" : "token"}
            onClick={() => {
              setTotalAmount(1);
            }}
          >
            1
          </Button>
          <Button
            variant={totalAmount === 5 ? "default" : "token"}
            onClick={() => {
              setTotalAmount(5);
            }}
          >
            5
          </Button>
          <Button
            variant={totalAmount === 10 ? "default" : "token"}
            onClick={() => {
              setTotalAmount(10);
            }}
          >
            10
          </Button>
          <Button
            variant={totalAmount === 100 ? "default" : "token"}
            onClick={() => {
              setTotalAmount(100);
            }}
          >
            100
          </Button>
          <div className="flex flex-row items-center gap-2">
            <p className="uppercase">Custom:</p>
            <input
              type="number"
              name="position"
              onChange={handleChangeAmout}
              className="p-1 m-2 w-20 h-8 2xl:text-2xl bg-terminal-black border border-terminal-green"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full items-center bg-terminal-green text-terminal-black h-10 px-5 justify-between">
        <p className="text-2xl uppercase">Add Distribution</p>
        <div className="flex flex-row gap-2">
          {distributions
            .filter((dist) => dist.position !== 0 && dist.percentage !== 0)
            .sort((a, b) => a.position - b.position) // Add this line to sort by position
            .map((distribution, index) => {
              const getOrdinalSuffix = (position: number) => {
                const formatPosition = isNaN(position) ? 0 : position;
                if (formatPosition % 10 === 1 && formatPosition !== 11)
                  return "st";
                if (formatPosition % 10 === 2 && formatPosition !== 12)
                  return "nd";
                if (position % 10 === 3 && position !== 13) return "rd";
                return "th";
              };

              return (
                <p key={index} className="text-lg uppercase font-bold">
                  {isNaN(distribution.percentage)
                    ? ""
                    : `${distribution.position}${getOrdinalSuffix(
                        distribution.position
                      )}: ${distribution.percentage}%,`}
                </p>
              );
            })}
          <p className="text-lg uppercase font-bold">{`Total: ${totalPercentage}%`}</p>
        </div>
      </div>
      <div className="py-5 w-full flex flex-col items-center h-[200px] overflow-y-scroll">
        {distributions.map((distribution, index) => (
          <div key={index} className="flex flex-row gap-20">
            <div className="flex flex-col w-1/2">
              <p className="uppercase font-bold">Position</p>
              <div className="flex flex-row items-center gap-5">
                <Button
                  variant={distribution.position === 1 ? "default" : "token"}
                  onClick={() => {
                    updatePosition(index, 1);
                  }}
                >
                  1st
                </Button>
                <Button
                  variant={distribution.position === 2 ? "default" : "token"}
                  onClick={() => {
                    updatePosition(index, 2);
                  }}
                >
                  2nd
                </Button>
                <Button
                  variant={distribution.position === 3 ? "default" : "token"}
                  onClick={() => {
                    updatePosition(index, 3);
                  }}
                >
                  3rd
                </Button>
                <input
                  type="number"
                  name="position"
                  onChange={(e) => {
                    updatePosition(index, parseInt(e.target.value));
                  }}
                  className="p-1 m-2 w-20 h-8 2xl:text-2xl bg-terminal-black border border-terminal-green"
                  placeholder="POS"
                />
              </div>
            </div>
            <div
              className={`flex flex-col w-1/2 ${
                distribution.position === 0
                  ? "text-gray-500 no-text-shadow"
                  : ""
              }`}
            >
              <p className="uppercase font-bold">Share %</p>
              <div className="flex flex-row items-center gap-5">
                <Button
                  variant={
                    distribution.position
                      ? distribution.percentage === 1
                        ? "default"
                        : "token"
                      : "disabled"
                  }
                  onClick={() => {
                    if (distribution.position !== 0) {
                      updatePercentage(index, 1);
                    }
                  }}
                >
                  1%
                </Button>
                <Button
                  variant={
                    distribution.position
                      ? distribution.percentage === 5
                        ? "default"
                        : "token"
                      : "disabled"
                  }
                  onClick={() => {
                    if (distribution.position !== 0) {
                      updatePercentage(index, 5);
                    }
                  }}
                >
                  5%
                </Button>
                <Button
                  variant={
                    distribution.position
                      ? distribution.percentage === 10
                        ? "default"
                        : "token"
                      : "disabled"
                  }
                  onClick={() => {
                    if (distribution.position !== 0) {
                      updatePercentage(index, 10);
                    }
                  }}
                >
                  10%
                </Button>
                <input
                  type="number"
                  name="share"
                  onChange={(e) => {
                    if (distribution.position !== 0) {
                      updatePercentage(index, parseInt(e.target.value));
                    }
                  }}
                  className={`p-1 m-2 w-20 h-8 2xl:text-2xl bg-terminal-black ${
                    distribution.position === 0
                      ? "border border-gray-500"
                      : "border border-terminal-green"
                  }`}
                  placeholder="SHARE"
                  disabled={distribution.position === 0}
                  max={100}
                  min={0}
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          className="m-5 w-20"
          variant="token"
          onClick={() => {
            setDistributions([
              ...distributions,
              { position: 0, percentage: 0 },
            ]);
          }}
        >
          <span className="w-4 h-4">
            <PlusIcon />
          </span>
        </Button>
      </div>
      <Button
        variant="token"
        size="lg"
        onClick={() => {
          if (totalPercentage !== 100) {
            alert("Prize distribution must total 100%");
            return;
          }
          onSubmit(prizes);
        }}
        disabled={totalPercentage !== 100}
      >
        Add Prize
      </Button>
    </div>
  );
};

export default Prizes;
