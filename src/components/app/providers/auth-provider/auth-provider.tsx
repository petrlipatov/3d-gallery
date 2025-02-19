import { authContext } from "@/shared/constants/contexts";
import { authStore } from "@/shared/stores";

export function AuthProvider({ children }) {
  return (
    <authContext.Provider value={authStore}>{children}</authContext.Provider>
  );
}
