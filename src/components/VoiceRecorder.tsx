import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";

import { callBaiduSpeechRecognition } from "@/api/baidu";
import {
  AudioChannel,
  AudioEncodeBitRate,
  AudioFormat,
  AudioRate,
} from "@/lib/constants";

import RecognitionResult from "./RecognitionResult";
import RecordingButton from "./RecordingButton";

const VoiceRecorder: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [duration, setDuration] = useState<number>(0); // 添加时长状态
  const recorderManager = Taro.getRecorderManager();

  // 开始录音
  const startRecording = () => {
    recorderManager.start({
      format: AudioFormat,
      numberOfChannels: AudioChannel,
      encodeBitRate: AudioEncodeBitRate,
      sampleRate: AudioRate,
    });
    Taro.showToast({ title: "开始录音", icon: "none" });

    // 监听录音时长
    recorderManager.onStart(() => {
      console.log("录音开始");
    });
  };

  // 停止录音并调用百度语音识别
  const stopRecording = async () => {
    recorderManager.stop();
    Taro.showToast({ title: "停止录音", icon: "none" });

    recorderManager.onStop(async (res) => {
      const { tempFilePath, duration: recordDuration } = res; // 获取时长和文件路径
      console.log(tempFilePath);
      setDuration(recordDuration); // 更新时长状态

      Taro.showToast({ title: "录音结束，处理中...", icon: "none" });

      // 调用方法读取录音文件并进行Base64编码
      const fileSystemManager = Taro.getFileSystemManager();
      const audioBuffer = fileSystemManager.readFileSync(tempFilePath);
      const base64Audio = Taro.arrayBufferToBase64(audioBuffer as ArrayBuffer);
      const fileSize = (audioBuffer as ArrayBuffer).byteLength;

      // 调用百度语音识别API
      const recognitionResult = await callBaiduSpeechRecognition(
        base64Audio as string,
        fileSize
      );

      setResult(recognitionResult);
    });
  };

  return (
    <View className="container">
      <RecordingButton onStart={startRecording} onStop={stopRecording} />
      <RecognitionResult result={result} />
      <View>录音时长: {duration / 1000}秒</View>
    </View>
  );
};

export default VoiceRecorder;
