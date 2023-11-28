import axios from "axios";
import queryString from "query-string";
import { message } from "antd";

const axiosClient = axios.create({
  baseURL: "/",
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }

    return Promise.reject(new Error(`Lỗi khi kết nối tới server! `));
  },
  async (error) => {
    if (error.response?.status === 403) {
      message.error("Bạn không có quyền!");
    }
    if (error.response?.status === 500) {
      message.error(
        "Lỗi không xác định. Vui lòng liên hệ kỹ thuật để được hỗ trợ!"
      );
    }
    if (error.response?.data instanceof Blob) {
      const responseObj = await error.response.data.text();
      message.error(JSON.parse(responseObj)?.errorMessage);
    }

    const errorMessage = error.response?.data.errorMessage;
    if (errorMessage) message.error(errorMessage);

    throw error;
  }
);

export default axiosClient;
