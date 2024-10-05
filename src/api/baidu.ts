import Taro from "@tarojs/taro";

import { AudioChannel, AudioFormat, AudioRate } from "@/lib/constants";

// 获取百度 API Access Token
export const getBaiduAccessToken = async (): Promise<string> => {
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

  return response.data.access_token;
};

// 调用百度语音识别 API 的函数
export const callBaiduSpeechRecognition = async (
  base64Audio: string,
  fileSize: number
): Promise<string> => {
  try {
    const token = await getBaiduAccessToken();
    console.log("baidu speech token:", token);

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

    if (response.data.err_no === 0) {
      return response.data.result[0]; // 识别成功，返回结果
    } else {
      Taro.showToast({ title: "语音识别失败", icon: "none" });
      return "识别失败";
    }
  } catch (error) {
    Taro.showToast({ title: "请求失败", icon: "none" });
    console.log(error);
    return "请求失败";
  }
};
