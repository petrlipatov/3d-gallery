import { authContext } from "@/shared/constants/contexts";
import { store } from "@/shared/store";

export function AuthProvider({ children }) {
  return <authContext.Provider value={store}>{children}</authContext.Provider>;
}
