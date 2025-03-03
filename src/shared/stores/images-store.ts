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

  setImages(images: ImageData[] | null) {
    this.images = images;
  }

  setStatus(status: FetchStatus) {
    this.status = status;
  }

  async fetchImages() {
    try {
      this.setStatus(FetchStatus.Loading);
      const res = await ImagesService.fetchImages();
      this.setImages(res.data);
      this.setStatus(FetchStatus.Ok);
    } catch (err) {
      this.setStatus(FetchStatus.Error);
      console.log(err);
    }
  }

  async deleteImage(image: string) {
    try {
      this.setStatus(FetchStatus.Loading);
      const res = await ImagesService.deleteImage(image);
      console.log(res);
      this.setStatus(FetchStatus.Ok);
    } catch (err) {
      this.setStatus(FetchStatus.Error);
      console.log(err);
    }
  }
}
