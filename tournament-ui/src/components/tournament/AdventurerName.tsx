import { ChangeEvent, useState } from "react";
import useUIStore from "@/hooks/useUIStore";
import { stringToFelt } from "@/lib/utils";

export const AdventurerName = () => {
  const { startTournamentData, setStartTournamentData } = useUIStore();
  const [isMaxLength, setIsMaxLength] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setStartTournamentData({
      ...startTournamentData,
      name: stringToFelt(value.slice(0, 31)),
    });
    if (value.length >= 31) {
      setIsMaxLength(true);
    } else {
      setIsMaxLength(false);
    }
  };

  return (
    <>
      <div className="relative w-1/2 flex flex-col items-center uppercase flex flex-col">
        <p className="uppercase text-center text-lg m-0 text-terminal-green/75 no-text-shadow">
          Name
        </p>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          className="p-1 h-8 w-3/4 text-lg bg-terminal-black border border-terminal-green"
          maxLength={31}
        />
        {isMaxLength && (
          <p className="absolute bottom-[-15px] right-5 text-terminal-yellow">
            MAX LENGTH!
          </p>
        )}
      </div>
    </>
  );
};
