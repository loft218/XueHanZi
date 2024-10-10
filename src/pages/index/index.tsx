import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import XButton from "@/components/XButton";

export default function Index() {
  return (
    <View className="scroll-area">
      <View className="container justify-center ">
        <XButton onClick={() => Taro.navigateTo({ url: "/pages/hanzi/xue" })}>
          开始学汉字
        </XButton>
      </View>
    </View>
  );
}
