import Taro from "@tarojs/taro";

export const getPlatform = () => Taro.getSystemInfoSync().platform;
export const isDevTools = () => getPlatform() === "devtools";
