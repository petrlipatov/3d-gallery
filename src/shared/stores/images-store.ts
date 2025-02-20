import { makeAutoObservable } from "mobx";

import { FetchStatus } from "../constants/api";
import { ImageData } from "../models";
import { ImagesService } from "../services/ImagesService";
import { RootStore } from "./root-store";

export class ImagesStore {
  rootStore: RootStore;
  images: ImageData[] | null = null;
  status: FetchStatus = FetchStatus.Idle;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setImages(images: ImageData[]) {
    this.images = images;
  }

  async fetchImages() {
    try {
      const res = await ImagesService.fetchImages();
      this.setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  }
}
