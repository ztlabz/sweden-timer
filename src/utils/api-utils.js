import axios from "axios";
import { eventsGetAllApiUrl } from "./url-utils";


export const api = {};

api.eventsGetAll = async () => {
  const url = eventsGetAllApiUrl(); // 'http://localhost:3001/api/v1/events/get/all';
  const response = await axios.get(url);
  console.log('api.eventsGetAll get response', response);
  return response;
};
