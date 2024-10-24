import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";

import { getSpeechAudio } from "@/api/baidu";
import { XButton } from "@/components/base";
import Section from "@/components/base/Section";
import BaseCard from "@/components/Card/BaseCard";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { saveFile, checkFileExists } from "@/utils/taro";

import words from "../../data/lesson1.json";

export default function HanZiXuePage() {
  const [currentWord, setCurrentWord] = useState("");

  const player = useAudioPlayer();

  // setCurrentWord(word.hanzi);

  // 获取语音并保存文件
  const synthesizeAndSaveFile = async (
    text: string,
    fileName: string
  ): Promise<string | null> => {
    const arrayBuffer = await getSpeechAudio(text);

    if (arrayBuffer) {
      return await saveFile(arrayBuffer, fileName); // 调用通用的保存方法
    } else {
      console.error("Failed to synthesize speech.");
      return null;
    }
  };

  const handleCardClick = async (index: number) => {
    const text = words[index].hanzi;
    const fileName = `${encodeURIComponent(text)}.mp3`;
    const fileFullName = `${Taro.env.USER_DATA_PATH}/${fileName}`;

    try {
      // 检查本地文件是否存在
      const fileExists = await checkFileExists(fileFullName);

      if (fileExists) {
        console.log(`File exists: ${fileFullName}`);
        player.play(fileFullName);
      } else {
        console.log(`File does not exist, calling API: ${fileFullName}`);
        const savedPath = await synthesizeAndSaveFile(text, fileFullName);

        if (savedPath) {
          player.play(savedPath);
        } else {
          console.error("Failed to save audio to file.");
        }
      }
    } catch (error) {
      console.error("Error during file operation:", error);
    }
  };

  function navigateToNext() {
    Taro.navigateTo({ url: "/pages/hanzi/ren" });
  }

  return (
    <View className="scroll-area">
      <View className="container justify-center">
        <View className="text-3xl font-bold">学一学</View>
        <Section>
          <View className="flex flex-wrap w-full justify-center gap-2">
            {words.map((word, _index) => (
              <BaseCard
                onClick={() => handleCardClick(_index)}
                className={
                  currentWord === word.hanzi
                    ? "text-primary animate__animated animate__heartBeat"
                    : "text-neutral-800"
                }
                key="_index"
                word={word.hanzi}
                size="5rem"
                padding="1rem"
              />
            ))}
          </View>
        </Section>

        <View>{player.status}</View>
        <XButton onClick={navigateToNext} className="btn-primary">
          下一步
        </XButton>
      </View>
    </View>
  );
}
