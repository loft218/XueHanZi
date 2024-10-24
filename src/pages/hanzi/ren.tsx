import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";

import { Section, XButton } from "@/components/base";
import CardFlip from "@/components/Card/CardFlip";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { IHanZi } from "@/types/Word";

import words from "../../data/lesson1.json";

export default function HanZiRenPage() {
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    Array.from({ length: words.length }, () => false)
  );
  const [shakeIndices, setShakeIndices] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState<IHanZi | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const player = useAudioPlayer();

  // 开始游戏
  const startGame = () => {
    setIsStarted(true);
    playAudioRandomWord();
  };

  // 播放随机音频

  // 检查是否完成
  useEffect(() => {
    if (flippedStates.every(Boolean)) {
      setIsCompleted(true);
    } else {
      playAudioRandomWord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedStates]);

  // 卡片翻转逻辑
  const handleCardFlip = (index: number) => {
    if (!isStarted) return; // 未开始游戏不能操作

    const selectedWord = words[index];

    if (selectedWord === currentWord) {
      // 如果卡片正确
      setFlippedStates((prevStates) =>
        prevStates.map((isFlipped, i) => (i === index ? true : isFlipped))
      );
    } else {
      // 如果卡片错误
      triggerShake(index);
    }
  };

  // 卡片抖动逻辑
  const triggerShake = (index: number) => {
    setShakeIndices((prev) => [...prev, index]);
    setTimeout(() => {
      setShakeIndices([]);
    }, 1000);
  };

  // 动画完成的回调函数
  const handleAnimationComplete = () => {};

  function playAudioRandomWord() {
    const availableWords = words.filter((_, index) => !flippedStates[index]);

    if (availableWords.length === 0) {
      setIsCompleted(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const randomWord = availableWords[randomIndex];
    setCurrentWord(randomWord);

    if (player.current && player.status !== "playing") {
      player.play(randomWord.duyin);
    }
  }

  // 跳转到下一步
  function navigateToNext() {
    Taro.navigateTo({ url: "/pages/hanzi/nian" });
  }

  return (
    <View className="scroll-area">
      <View className="container justify-center">
        <View className="text-3xl font-bold">认一认</View>

        <Section>
          <View className="flex flex-wrap w-full justify-center gap-4">
            {words.map((word, index) => (
              <CardFlip
                key={index}
                frontText={word.hanzi}
                isFlipped={flippedStates[index]}
                onFlip={() => handleCardFlip(index)}
                shouldShake={shakeIndices.includes(index)}
                onAnimationComplete={handleAnimationComplete}
              />
            ))}
          </View>
        </Section>

        <XButton onClick={startGame} className="btn-primary">
          {isStarted ? "重新开始" : "开始"}
        </XButton>

        <XButton
          onClick={navigateToNext}
          className="btn-primary"
          disabled={!isCompleted}
        >
          下一步
        </XButton>

        {player.status === "playing" && (
          <View className="absolute inset-0 bg-black opacity-50 z-10" /> // 播放语音时的遮罩
        )}
      </View>
    </View>
  );
}
