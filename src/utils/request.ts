import Taro from "@tarojs/taro";

interface RequestConfig extends Taro.request.Option {
  baseUrl?: string;
  retryCount?: number; // 增加重试次数
  retryDelay?: number; // 重试延迟时间（毫秒）
  // 可以在这里添加其他自定义配置
}

const BASE_URL = process.env.TARO_APP_API_BASE;
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const DEFAULT_RETRY_COUNT = 5; // 默认重试次数
const DEFAULT_RETRY_DELAY = 5000; // 默认延迟时间（毫秒）

const request = async function <T>(
  url: string,
  config?: RequestConfig
): Promise<T> {
  const {
    baseUrl = BASE_URL,
    method = "GET",
    data = {},
    header = {},
    retryCount = DEFAULT_RETRY_COUNT,
    retryDelay = DEFAULT_RETRY_DELAY,
  } = config || {};
  const localUser = Taro.getStorageSync("local_user");

  let attempt = 0;
  let currentRetryDelay = retryDelay; // 用于更新重试延迟

  while (attempt <= retryCount) {
    try {
      const res = await Taro.request({
        url: `${baseUrl}${url}`,
        method,
        data,
        header: {
          ...DEFAULT_HEADERS,
          ...header,
          "Local-User-Id": localUser?.id,
        },
      });

      if (res.statusCode >= 200 && res.statusCode < 300) {
        return res.data as T;
      } else if (res.statusCode === 429 && attempt < retryCount) {
        // 如果状态码是429（请求过多），等待一段时间后重试
        console.warn(
          `Too many requests, retrying in ${currentRetryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, currentRetryDelay));
        attempt++;
        // 使用指数退避策略，逐步增加重试延迟时间
        currentRetryDelay *= 2;
      } else {
        throw new Error(`statusCode:${res.statusCode},errMsg:${res.errMsg}`);
      }
    } catch (error) {
      // 可以在这里统一处理错误
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // 万一都重试失败
  throw new Error("Max retries reached, request failed.");
};

export default request;
