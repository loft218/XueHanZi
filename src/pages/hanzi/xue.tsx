import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";

import { XButton } from "@/components/base";
import Section from "@/components/base/Section";
import WordCard from "@/components/WordCard";
import useAudioPlayer from "@/hooks/useAudioPlayer";

import words from "../../data/lesson1.json";

export default function HanZiXuePage() {
  const [currentWord, setCurrentWord] = useState("");

  const player = useAudioPlayer();

  Taro.useUnload(() => {
    player.destroy();
  });

  return (
    <View className="scroll-area">
      <View className="container justify-center">
        <View className="text-3xl font-bold">学一学</View>
        <Section>
          <View className="flex flex-wrap w-full justify-center gap-2">
            {words.map((word, _index) => (
              <WordCard
                onClick={() => {
                  player.play(word.duyin);
                  setCurrentWord(word.hanzi);
                }}
                className={
                  currentWord === word.hanzi
                    ? "bg-primary text-white"
                    : "text-neutral-400"
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
        <XButton
          onClick={() => Taro.navigateTo({ url: "/pages/hanzi/nian" })}
          className="btn-primary"
        >
          下一步
        </XButton>
      </View>
    </View>
  );
}
