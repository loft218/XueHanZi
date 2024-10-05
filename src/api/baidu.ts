import Taro from "@tarojs/taro";

import { AudioChannel, AudioFormat, AudioRate } from "@/lib/constants";

// 获取百度 API Access Token
const getBaiduAccessToken = async (): Promise<string> => {
  try {
    const apiKey = process.env.TARO_APP_SPEECH_API_KEY;
    const secretKey = process.env.TARO_APP_SPEECH_SECRET_KEY;

    const response = await Taro.request({
      url: `https://aip.baidubce.com/oauth/2.0/token`,
      method: "POST",
      data: {
        grant_type: "client_credentials",
        client_id: apiKey,
        client_secret: secretKey,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.statusCode === 200) {
      const { access_token, expires_in } = response.data;

      // 获取当前时间（毫秒）
      const currentTime = Date.now();

      // 计算过期时间戳（当前时间 + expires_in 转为毫秒）
      const expirationTime = currentTime + expires_in * 1000;

      // 将 access_token 和过期时间存储到本地缓存
      Taro.setStorageSync("baiduAccessToken", access_token);
      Taro.setStorageSync("baiduTokenExpiration", expirationTime);

      console.log("Access token 已存储");
      return access_token;
    } else {
      throw new Error("获取 access_token 失败");
    }
  } catch (error) {
    console.error("请求失败:", error);
    throw error;
  }
};

// 检查本地缓存的 token 是否有效
const getCachedAccessToken = async () => {
  const accessToken = Taro.getStorageSync("baiduAccessToken");
  const expirationTime = Taro.getStorageSync("baiduTokenExpiration");
  const currentTime = Date.now();

  // 如果有 token 且没有过期，直接返回缓存的 token
  if (accessToken && expirationTime > currentTime) {
    console.log("使用缓存的 access token");
    return accessToken;
  } else {
    // 如果没有 token 或已过期，重新获取新的 token
    return await getBaiduAccessToken();
  }
};

// 调用百度语音识别 API 的函数
export const callBaiduSpeechRecognition = async (
  base64Audio: string,
  fileSize: number
): Promise<string> => {
  try {
    const token = await getCachedAccessToken();

    const response = await Taro.request({
      url: `https://vop.baidu.com/server_api`,
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      data: {
        format: AudioFormat, // 确保这里与文件格式匹配
        rate: AudioRate,
        channel: AudioChannel,
        cuid: "dev",
        speech: base64Audio, // 直接使用读取到的 Base64 数据
        len: fileSize, // Base64 字符串的长度
        token: token,
      },
    });

    if (response.statusCode === 200) {
      if (response.data.err_no === 0) {
        return response.data.result[0]; // 识别成功，返回结果
      } else {
        Taro.showToast({ title: "语音识别失败", icon: "none" });
        return "识别失败";
      }
    } else {
      throw new Error("调用百度语音识别 API 失败");
    }
  } catch (error) {
    Taro.showToast({ title: "请求失败", icon: "error" });
    return "请求失败";
  }
};
