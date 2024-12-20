import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BigNumberish, shortString } from "starknet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (Math.abs(num) >= 1000000) {
    return parseFloat((num / 1000000).toFixed(2)) + "m";
  } else if (Math.abs(num) >= 1000) {
    return parseFloat((num / 1000).toFixed(2)) + "k";
  } else if (Math.abs(num) >= 10) {
    return num.toFixed(0);
  } else if (Math.abs(num) > 0) {
    return num.toFixed(2);
  } else {
    return "0";
  }
}

export function formatEth(num: number): string {
  if (Math.abs(num) >= 0.01) {
    return num.toFixed(2);
  } else if (Math.abs(num) >= 0.0001) {
    return num.toFixed(4);
  } else {
    return "0";
  }
}

export function indexAddress(address: string) {
  return address.replace(/^0x0+/, "0x");
}

export function padAddress(address: string) {
  if (address && address !== "") {
    const length = address.length;
    const neededLength = 66 - length;
    let zeros = "";
    for (var i = 0; i < neededLength; i++) {
      zeros += "0";
    }
    const newHex = address.substring(0, 2) + zeros + address.substring(2);
    return newHex;
  } else {
    return "";
  }
}

export function displayAddress(string: string) {
  if (string === undefined) return "unknown";
  return string.substring(0, 6) + "..." + string.substring(string.length - 4);
}

export const stringToFelt = (v: string): BigNumberish =>
  v ? shortString.encodeShortString(v) : "0x0";

export const feltToString = (v: BigNumberish): string => {
  return BigInt(v) > 0n ? shortString.decodeShortString(bigintToHex(v)) : "";
};

export const bigintToHex = (v: BigNumberish): `0x${string}` =>
  !v ? "0x0" : `0x${BigInt(v).toString(16)}`;

export const isPositiveBigint = (v: BigNumberish | null): boolean => {
  try {
    return v != null && BigInt(v) > 0n;
  } catch {
    return false;
  }
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  }
};

// Add a utility function to check if a date is before another date
export function isBefore(date1: Date, date2: Date) {
  return date1.getTime() < date2.getTime();
}

export function formatBalance(num: BigNumberish): number {
  return Number(num) / 10 ** 18;
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

export const removeFieldOrder = <T extends Record<string, any>>(
  obj: T
): Omit<T, "fieldOrder"> => {
  const newObj = { ...obj } as Record<string, any>; // Cast to a non-generic type
  delete newObj.fieldOrder;

  Object.keys(newObj).forEach((key) => {
    if (typeof newObj[key] === "object" && newObj[key] !== null) {
      newObj[key] = removeFieldOrder(newObj[key]);
    }
  });

  return newObj as Omit<T, "fieldOrder">;
};

export const cleanObject = (obj: any): any =>
  Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {} as { [key: string]: any });

export const calculatePayouts = (
  totalPlaces: number,
  weightingFactor: number
): number[] => {
  // Calculate the weights for each place
  const weights: number[] = [];
  for (let i = 1; i <= totalPlaces; i++) {
    weights.push(1 / Math.pow(i, weightingFactor));
  }

  // Calculate the total weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Calculate the percentage payouts
  const payouts: number[] = weights.map((weight) =>
    Math.floor((weight / totalWeight) * 100)
  );

  // Calculate the sum of rounded payouts
  const totalPayout = payouts.reduce((sum, payout) => sum + payout, 0);

  // Distribute the remaining percentage points
  // to the highest weighted positions until we reach 100
  let remaining = 100 - totalPayout;
  let index = 0;
  while (remaining > 0) {
    payouts[index] += 1;
    remaining -= 1;
    index = (index + 1) % totalPlaces;
  }

  return payouts;
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function getKeyFromValue(searchValue: string): string | null {
  const data = {
    1: "Pendant",
    2: "Necklace",
    3: "Amulet",
    4: "Silver Ring",
    5: "Bronze Ring",
    6: "Platinum Ring",
    7: "Titanium Ring",
    8: "Gold Ring",
    9: "Ghost Wand",
    10: "Grave Wand",
    11: "Bone Wand",
    12: "Wand",
    13: "Grimoire",
    14: "Chronicle",
    15: "Tome",
    16: "Book",
    17: "Divine Robe",
    18: "Silk Robe",
    19: "Linen Robe",
    20: "Robe",
    21: "Shirt",
    22: "Crown",
    23: "Divine Hood",
    24: "Silk Hood",
    25: "Linen Hood",
    26: "Hood",
    27: "Brightsilk Sash",
    28: "Silk Sash",
    29: "Wool Sash",
    30: "Linen Sash",
    31: "Sash",
    32: "Divine Slippers",
    33: "Silk Slippers",
    34: "Wool Shoes",
    35: "Linen Shoes",
    36: "Shoes",
    37: "Divine Gloves",
    38: "Silk Gloves",
    39: "Wool Gloves",
    40: "Linen Gloves",
    41: "Gloves",
    42: "Katana",
    43: "Falchion",
    44: "Scimitar",
    45: "Long Sword",
    46: "Short Sword",
    47: "Demon Husk",
    48: "Dragonskin Armor",
    49: "Studded Leather Armor",
    50: "Hard Leather Armor",
    51: "Leather Armor",
    52: "Demon Crown",
    53: "Dragons Crown",
    54: "War Cap",
    55: "Leather Cap",
    56: "Cap",
    57: "Demonhide Belt",
    58: "Dragonskin Belt",
    59: "Studded Leather Belt",
    60: "Hard Leather Belt",
    61: "Leather Belt",
    62: "Demonhide Boots",
    63: "Dragonskin Boots",
    64: "Studded Leather Boots",
    65: "Hard Leather Boots",
    66: "Leather Boots",
    67: "Demons Hands",
    68: "Dragonskin Gloves",
    69: "Studded Leather Gloves",
    70: "Hard Leather Gloves",
    71: "Leather Gloves",
    72: "Warhammer",
    73: "Quarterstaff",
    74: "Maul",
    75: "Mace",
    76: "Club",
    77: "Holy Chestplate",
    78: "Ornate Chestplate",
    79: "Plate Mail",
    80: "Chain Mail",
    81: "Ring Mail",
    82: "Ancient Helm",
    83: "Ornate Helm",
    84: "Great Helm",
    85: "Full Helm",
    86: "Helm",
    87: "Ornate Belt",
    88: "War Belt",
    89: "Plated Belt",
    90: "Mesh Belt",
    91: "Heavy Belt",
    92: "Holy Greaves",
    93: "Ornate Greaves",
    94: "Greaves",
    95: "Chain Boots",
    96: "Heavy Boots",
    97: "Holy Gauntlets",
    98: "Ornate Gauntlets",
    99: "Gauntlets",
    100: "Chain Gloves",
    101: "Heavy Gloves",
  };
  const entry = Object.entries(data).find(
    ([_key, value]) => value === searchValue
  );
  return entry ? entry[0] : null;
}
