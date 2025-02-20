import { autorun, makeAutoObservable } from "mobx";
import { AuthStore } from "./auth-store";
import { ImagesStore } from "./images-store";

class RootStore {
  authStore: AuthStore;
  imagesStore: ImagesStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.imagesStore = new ImagesStore(this);
  }
}

export type { RootStore };
export const rootStore = new RootStore();

autorun(() => {
  console.log(rootStore.imagesStore.status);
});
