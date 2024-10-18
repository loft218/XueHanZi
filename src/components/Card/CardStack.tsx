import { View } from "@tarojs/components";
import { forwardRef, useImperativeHandle, useState } from "react";

import { IHanZi } from "@/types/Word";

import "./CardStack.scss";

// 定义 CardStackHandle 类型，表示暴露的 nextCard 方法
export interface CardStackHandle {
  nextCard: () => void;
  isAnimating: boolean;
}

interface Props {
  words: IHanZi[];
  onAnimationChange?: (isAnimating: boolean) => void;
  onCardChange?: (newCards: IHanZi[]) => void; // 可选的回调函数
}

const CardStack = forwardRef<CardStackHandle, Props>(
  ({ words, onCardChange, onAnimationChange }: Props, ref) => {
    const [cards, setCards] = useState(words); // 卡片索引数组
    const [animationClasses, setAnimationClasses] = useState(
      Array.from({ length: cards.length }, () => "")
    ); // 每个卡片的动画类
    const [isAnimating, setIsAnimating] = useState(false); // 动画进行中的状态

    const handleNextCard = () => {
      if (isAnimating) return; // 防止重复点击

      setIsAnimating(true); // 设置动画状态为进行中
      onAnimationChange?.(true); // 通知父组件动画开始

      const currentCard = cards[0]; // 当前卡片
      // 设置当前卡片的动画类
      const newAnimationClasses = [...animationClasses];
      newAnimationClasses[0] = "toggle-animation"; // 为最前面的卡片添加动画类

      // 更新动画类
      setAnimationClasses(newAnimationClasses);

      // 切换卡片顺序
      setTimeout(() => {
        // 移除当前卡片的动画类
        newAnimationClasses[0] = "";
        setAnimationClasses(newAnimationClasses);

        // 将当前卡片移到最后面
        const newCards = [...cards.slice(1), currentCard];
        setCards(newCards);

        // 动画完成，重置动画状态
        setIsAnimating(false);
        onAnimationChange?.(false); // 通知父组件动画结束

        // 触发回调，将新顺序的卡片传递出去
        if (onCardChange) {
          onCardChange(newCards);
        }
      }, 1000); // 动画持续时间为1秒
    };

    // 使用 useImperativeHandle 将 handleNextCard 暴露给外部
    useImperativeHandle(ref, () => ({
      nextCard: handleNextCard,
      isAnimating,
    }));

    return (
      <View>
        <View className="card-stack">
          {cards.map((card, index) => (
            <View
              key={index}
              className={`card ${animationClasses[index]}`}
              style={{ zIndex: cards.length - index }}
            >
              {card.hanzi}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

export default CardStack;
