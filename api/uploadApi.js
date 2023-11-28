import axiosClient from "./axiosClient";

const uploadApi = {
  uploadImg: (data) =>
    axiosClient.post(`#`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
export default uploadApi;
