import useSound from "use-sound";

const dir = "/music/";

export const soundSelector = {
  click: "beep.wav",
};

const volumeMap = {
  click: 0.4,
};

const defaultVolume = 0.2;

export const useUiSounds = (selector: string) => {
  const [play] = useSound(dir + selector, {
    volume: volumeMap[selector as keyof typeof volumeMap] || defaultVolume,
  });

  return {
    play,
  };
};
