import { ChangeEvent, useState } from "react";
import useUIStore from "@/hooks/useUIStore";

const TournamentDetails = () => {
  const { formData, setFormData } = useUIStore();
  const [isMaxLength, setIsMaxLength] = useState(false);

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "tournamentName" && value.length >= 31) {
      setIsMaxLength(true);
    } else {
      setIsMaxLength(false);
    }
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col">
      <p className="text-xl uppercase">Tournament details</p>
      <div className="flex flex-col gap-2 border-2 border-terminal-green/75">
        <div className="flex flex-col gap-2 py-2">
          <div className="px-5 text-terminal-green/75 flex flex-row items-center gap-5">
            <p className="text-xl uppercase text-terminal-green/90">Name</p>
            <input
              type="text"
              name="tournamentName"
              value={formData.tournamentName}
              onChange={handleChangeName}
              className="px-2 h-6 w-96 text-lg bg-terminal-black border border-terminal-green/50 !no-text-shadow transform focus:outline-none focus:ring-1 focus:ring-terminal-green"
              maxLength={31}
            />
            {isMaxLength && <p className="text-terminal-yellow">MAX LENGTH!</p>}
          </div>
          <div className="w-full bg-terminal-green/50 h-0.5" />
          <div className="px-5 text-terminal-green/75 flex flex-col">
            <p className="text-xl uppercase text-terminal-green/90">
              Description
            </p>
            <textarea
              name="tournamentDescription"
              value={formData.tournamentDescription}
              onChange={handleChangeDescription}
              className="mb-2 px-2 h-10 max-h-10 w-full text-lg bg-terminal-black border border-terminal-green/50 focus:outline-none focus:ring-1 focus:ring-terminal-green"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
