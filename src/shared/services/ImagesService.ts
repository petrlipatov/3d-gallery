import { api } from "@/shared/http";
import { AxiosResponse } from "axios";
import { ImageData } from "../types";

export class ImagesService {
  static async fetchImages(): Promise<AxiosResponse<ImageData[]>> {
    return api.get<ImageData[]>("/images");
  }
}
