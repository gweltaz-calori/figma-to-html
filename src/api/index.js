import axios from "axios";
import { clamp } from "@/js/utils/math";
import store from "@/store";

export const getFile = async id => {
  let response = await axios({
    url: `/api/files/${id}`,
    method: "GET"
  });

  return response.data;
};
