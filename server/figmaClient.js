const axios = require("axios");
const https = require("https");
const { performance } = require("perf_hooks");

let axiosInstance = axios.create({
  baseURL: "https://api.figma.com/v1/"
});

module.exports = {
  async getDocument(key, accessToken) {
    const headers = {};

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      headers["X-Figma-Token"] = process.env.FIGMA_TOKEN;
    }

    let start = performance.now();
    let response = await axiosInstance({
      method: "GET",
      url: `files/${key}?geometry=paths`,
      headers
    });
    return response.data;
  },
  async getDocumentImages(key, accessToken) {
    const headers = {};

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      headers["X-Figma-Token"] = process.env.FIGMA_TOKEN;
    }

    let start = performance.now();
    let response = await axiosInstance({
      method: "GET",
      url: `files/${key}/images`,
      headers
    });

    return response.data;
  }
};
