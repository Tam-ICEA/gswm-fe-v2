import HttpService from "./HttpService";

export const apiGetDevicesInformation = (data) => {
  return HttpService.get("api/device/search", { params: data });
};
export const apiGetOriginalData = (data) => {
  return HttpService.get("api/original-data/search", { params: data });
};

export const apiGetReturnCmd = (data) => {
  return HttpService.get("api/return-cmd/search", { params: data });
};

export const apiGetLinkDown = (data) => {
  return HttpService.get("api/down-link-command/search", { params: data });
};

export const apiCreateLinkDown = (data) =>
  HttpService.post("api/down-link-command/create", data);
