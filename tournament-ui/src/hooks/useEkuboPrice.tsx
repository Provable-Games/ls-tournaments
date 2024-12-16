import { useState } from "react";

const useEkuboPrice = () => {
  const [price, setPrice] = useState<number>(0);
  setPrice(1);
  return { price };
};

export default useEkuboPrice;
