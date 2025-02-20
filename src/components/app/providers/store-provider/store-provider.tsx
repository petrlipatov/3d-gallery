import { storeContext } from "@/shared/constants/contexts";
import { rootStore } from "@/shared/stores";

export function StoreProvider({ children }) {
  return (
    <storeContext.Provider value={rootStore}>{children}</storeContext.Provider>
  );
}
