import { Swiper, SwiperItem, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

import { callBaiduSpeechRecognition } from "@/api/baidu";
import { convertToPinyin } from "@/api/pinyin";
import { Section } from "@/components/base";
import VoiceRecorder from "@/components/VoiceRecorder";
import WordCard from "@/components/WordCard";
import { isDevTools } from "@/utils/taro";

import words from "../../data/lesson1.json";

export default function HanZiNianPage() {
  const [recognizedText, setRecognizedText] = useState("");
  const [recognizedPinyin, setRecognizedPinyin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecordingComplete = async (filePath: string) => {
    if (isDevTools()) return;

    try {
      setLoading(true);
      const fileSystemManager = Taro.getFileSystemManager();
      const audioBuffer: string | ArrayBuffer =
        fileSystemManager.readFileSync(filePath);

      // 确保 audioBuffer 是 ArrayBuffer 类型
      if (typeof audioBuffer === "string") {
        throw new Error("Expected ArrayBuffer but received string.");
      }

      const audioData = Taro.arrayBufferToBase64(audioBuffer);
      const fileSize = audioBuffer.byteLength;

      // 调用百度语音识别API并转换为拼音
      const recognitionText = await callBaiduSpeechRecognition(
        audioData,
        fileSize
      );
      const pinyinResult = await convertToPinyin(recognitionText);

      // 更新状态
      setRecognizedText(recognitionText);
      setRecognizedPinyin(pinyinResult);
    } catch (error) {
      console.error("录音处理错误:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      Taro.showLoading({ title: "正在识别..." });
    } else {
      Taro.hideLoading();
    }
  }, [loading]);

  return (
    <View className="scroll-area">
      <View className="container justify-center">
        <View className="text-3xl font-bold">念一念</View>

        <Swiper indicatorDots className="w-full flex-1">
          {words.map((word, index) => (
            <SwiperItem
              key={index}
              className="w-full flex justify-center items-center"
            >
              <WordCard word={word.hanzi} size="10rem" padding="2rem" />
            </SwiperItem>
          ))}
        </Swiper>

        <Section>
          <View>{recognizedText || "等待录音结果..."}</View>
          <View>{recognizedPinyin || "等待拼音结果..."}</View>
        </Section>

        <Section>
          <VoiceRecorder onComplete={handleRecordingComplete} />
        </Section>
      </View>
    </View>
  );
}
