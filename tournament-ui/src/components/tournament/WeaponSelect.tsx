import { BladeIcon, BludgeonIcon, MagicIcon } from "@/components/Icons";
import useUIStore from "@/hooks/useUIStore";
import { getItemKeyFromValue, getItemValueFromKey } from "@/lib/utils";

export const WeaponSelect = () => {
  const { startTournamentData, setStartTournamentData } = useUIStore();
  const weapons = [
    {
      name: "Book",
      description: "Magic Weapon",
      image: "/weapons/book.png",
      icon: <MagicIcon />,
    },
    {
      name: "Wand",
      description: "Magic Weapon",
      image: "/weapons/wand.png",
      icon: <MagicIcon />,
    },
    {
      name: "Short Sword",
      description: "Blade Weapon",
      image: "/weapons/shortsword.png",
      icon: <BladeIcon />,
    },
    {
      name: "Club",
      description: "Bludgeon Weapon",
      image: "/weapons/club.png",
      icon: <BludgeonIcon />,
    },
  ];

  const handleWeaponSelectionDesktop = (weapon: string) => {
    setStartTournamentData({
      ...startTournamentData,
      weapon: getItemKeyFromValue(weapon) ?? "",
    });
  };

  return (
    <div className="w-2/3 flex flex-col items-center">
      <p className="uppercase text-lg m-0 text-terminal-green/75 no-text-shadow">
        Choose Weapon
      </p>
      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 h-full">
        {weapons.map((weapon) => (
          <div
            key={weapon.name}
            className={`flex flex-col items-center justify-center w-16 h-10 hover:cursor-pointer hover:bg-terminal-green hover:text-terminal-black p-1 ${
              getItemValueFromKey(Number(startTournamentData.weapon)) ==
              weapon.name
                ? "bg-terminal-green text-terminal-black"
                : "border border-terminal-green"
            }`}
            onClick={() => handleWeaponSelectionDesktop(weapon.name)}
          >
            <div className="w-2">{weapon.icon}</div>
            <p className="uppercase text-xs text-center">{weapon.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
