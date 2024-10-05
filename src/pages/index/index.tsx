import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";

import VoiceRecorder from "@/components/VoiceRecorder";

import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index">
      <VoiceRecorder />
    </View>
  );
}
