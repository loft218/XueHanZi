import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useEffect, useState } from "react";

import { Section, XButton } from "@/components/base";
import CardFlip from "@/components/Card/CardFlip";
import useAudioPlayer from "@/hooks/useAudioPlayer";

import words from "../../data/lesson1.json";

export default function HanZiRenPage() {
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    Array.from({ length: words.length }, () => false)
  );
  const [shakeIndices, setShakeIndices] = useState<number[]>([]); // 存储需要抖动的卡片索引

  const [playerReady, setPlayerReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const player = useAudioPlayer();

  // 播放指定索引的音频
  const playAudioAtIndex = (index: number) => {
    if (player.current && player.status !== "playing") {
      // 只有在未播放时才播放
      player.play(words[index].duyin); // 播放对应音频
    }
  };

  function getRandomFalseIndexFromStates(states: boolean[]): number | null {
    const falseIndices = states
      .map((flipped, index) => (flipped === false ? index : -1)) // 保留 false 的索引，其他设为 -1
      .filter((index) => index !== -1); // 过滤掉 -1，保留有效索引

    console.log(falseIndices);

    if (falseIndices.length === 0) return null; // 如果没有 false 的索引，返回 null

    const randomIndex = Math.floor(Math.random() * falseIndices.length); // 随机获取一个索引
    return falseIndices[randomIndex]; // 返回随机索引对应的值
  }

  useEffect(() => {
    if (playerReady) return;
    if (player.current) {
      setPlayerReady(true);
    }
  }, [player, playerReady]);

  const handleCardFlip = (index: number) => {
    // 语音播放结束后才能翻转
    if (player.status !== "finished" && player.status !== "stopped") return;
    //如果当前卡片不是当前正在翻转的卡片则不执行翻转
    if (currentIndex !== index) {
      triggerShake(index);
      return;
    }

    setFlippedStates((prevStates) =>
      // 如果卡片已经翻转，则不执行翻转
      prevStates.map((isFlipped, i) =>
        i === index && !isFlipped ? !isFlipped : isFlipped
      )
    );
  };

  const triggerShake = (index: number) => {
    setShakeIndices((prev) => [...prev, index]); // 添加需要抖动的卡片索引

    // 1秒后移除抖动状态
    setTimeout(() => {
      setShakeIndices((prev) => prev.filter((i) => i !== index)); // 移除抖动状态
    }, 1000); // 动画持续时间
  };

  function navigateToNext() {
    Taro.navigateTo({ url: "/pages/hanzi/nian" });
  }

  useEffect(() => {
    if (!playerReady) return;
    console.log(flippedStates);
    setTimeout(() => {
      const randomIndex = getRandomFalseIndexFromStates(flippedStates);
      console.log(randomIndex);
      setCurrentIndex(randomIndex);
      if (randomIndex !== null) {
        playAudioAtIndex(randomIndex);
      } else {
        setIsCompleted(true);
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedStates, playerReady]);

  useEffect(() => {
    console.log(player.status);
    if (player.status === "loading" || player.status === "playing") {
      // setPlaying(true);
      Taro.showToast({ title: "播放中", mask: true });
    }
  }, [player.status, playing]);

  return (
    <View className="scroll-area">
      <View className="container justify-center">
        <View className="text-3xl font-bold">认一认</View>

        <Section>
          <View className="flex flex-wrap w-full justify-center gap-2">
            {words.map((word, _index) => (
              <CardFlip
                key="_index"
                frontText={word.hanzi}
                isFlipped={flippedStates[_index]}
                onFlip={() => handleCardFlip(_index)}
                shouldShake={shakeIndices.includes(_index)}
              />
            ))}
          </View>
        </Section>

        <XButton
          onClick={navigateToNext}
          className="btn-primary"
          disabled={!isCompleted}
        >
          下一步
        </XButton>
      </View>
    </View>
  );
}
