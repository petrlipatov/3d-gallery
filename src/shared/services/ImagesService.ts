import { api } from "@/shared/http";
import { AxiosResponse } from "axios";
import { ImageData } from "../models/ImageData";

export class ImagesService {
  static async fetchImages(): Promise<AxiosResponse<ImageData[]>> {
    return api.get<ImageData[]>("/images");
  }

  static async deleteImage(image: string): Promise<AxiosResponse> {
    return api.delete(`/images/${image}`);
  }
}
