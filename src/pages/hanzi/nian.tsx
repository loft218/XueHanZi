import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";

import { callBaiduSpeechRecognition } from "@/api/baidu";
import { convertToPinyin } from "@/api/pinyin";
import { Section, XButton } from "@/components/base";
import CardStack, { CardStackHandle } from "@/components/Card/CardStack";
import VoiceRecorder from "@/components/VoiceRecorder";
import { IHanZi } from "@/types/Word";
import { isDevTools } from "@/utils/taro";

import words from "../../data/lesson1.json";

export default function HanZiNianPage() {
  const [recognizedText, setRecognizedText] = useState("");
  const [recognizedPinyin, setRecognizedPinyin] = useState("");
  const [currentWord, setCurrentWord] = useState<IHanZi>(words[0]);
  const [isAnimating, setIsAnimating] = useState(false); // 跟踪动画状态
  const [loading, setLoading] = useState(false);

  const cardStackRef = useRef<CardStackHandle>(null);

  const handleNextCard = () => {
    if (cardStackRef.current) {
      cardStackRef.current.nextCard(); // 调用暴露出来的 nextCard 方法
    }
  };

  // 监听动画状态变化
  const handleAnimationChange = (animating: boolean) => {
    setIsAnimating(animating);
  };

  const handleCardChange = (newCards: IHanZi[]) => {
    setCurrentWord(newCards[0]);
  };

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

      //判断
      if (pinyinResult.split(",").includes(currentWord.pinyin)) {
        handleNextCard();
      } else {
        Taro.showToast({ title: "错误", icon: "error", duration: 2000 });
      }
    } catch (error) {
      console.error("录音处理错误:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (loading) {
  //     Taro.showLoading({ title: "正在识别..." });
  //   } else {
  //     Taro.hideLoading();
  //   }
  // }, [loading]);

  return (
    <View className="scroll-area">
      <View className="container justify-center">
        <View className="text-3xl font-bold">念一念</View>

        <CardStack
          ref={cardStackRef}
          words={words}
          onAnimationChange={handleAnimationChange}
          onCardChange={handleCardChange}
        />

        {/* <XButton onClick={handleNextCard} disabled={isAnimating}>
          Manual Next Card
        </XButton> */}

        <Section>
          <View>{recognizedText || "等待录音结果..."}</View>
          <View>{recognizedPinyin || "等待拼音结果..."}</View>
        </Section>

        <Section>
          <VoiceRecorder
            onComplete={handleRecordingComplete}
            disabled={isAnimating}
          />
        </Section>
      </View>
    </View>
  );
}
