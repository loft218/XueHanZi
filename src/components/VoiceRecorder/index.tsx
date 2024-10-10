import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";

import {
  AudioChannel,
  AudioEncodeBitRate,
  AudioFormat,
  AudioRate,
} from "@/lib/constants";

import "./index.scss";

interface Props {
  onComplete?: (tempFilePath: string) => void; // 可选的 onComplete 回调
}

const VoiceRecorder: React.FC<Props> = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recorderManager = Taro.getRecorderManager();

  const startRecording = () => {
    setIsRecording(true);

    recorderManager.start({
      format: AudioFormat,
      numberOfChannels: AudioChannel,
      encodeBitRate: AudioEncodeBitRate,
      sampleRate: AudioRate,
    });

    recorderManager.onStart(() => {
      console.log("录音开始");
    });

    recorderManager.onError((err) => {
      console.error("录音出错: ", err);
    });
  };

  const stopRecording = async () => {
    recorderManager.stop();
    setIsRecording(false);

    recorderManager.onStop(async (res) => {
      const { tempFilePath, duration: recordDuration } = res;

      console.log(
        `录音结束，临时文件路径: ${tempFilePath}，时长：${recordDuration}`
      );

      onComplete && onComplete(tempFilePath);
    });
  };

  return (
    <View className="record-button-wrapper">
      {isRecording && (
        <>
          <View className="circle-wrapper">
            <View className="circle1"></View>
          </View>
          <View className="circle-wrapper">
            <View className="circle2"></View>
          </View>
        </>
      )}
      <View
        className="record-btn"
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
      >
        按住念
      </View>
    </View>
  );
};

export default VoiceRecorder;
