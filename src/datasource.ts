import axios, { AxiosResponse } from "axios";
import { Card, Template, Sizes } from "./types";

export const getCardsData = (): Promise<AxiosResponse<[Card], any>> => {
  return axios.get(
    "https://moonpig.github.io/tech-test-node-backend/cards.json"
  );
};

export const getTemplateData = (): Promise<AxiosResponse<[Template], any>> => {
  return axios.get(
    "https://moonpig.github.io/tech-test-node-backend/templates.json"
  );
};

export const getSizesData = () => {
  return axios.get(
    "https://moonpig.github.io/tech-test-node-backend/sizes.json"
  );
};
