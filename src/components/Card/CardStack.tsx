import { View } from "@tarojs/components";
import { useState } from "react";

import "./CardStack.scss";
import { XButton } from "../base";

const CardStack = () => {
  const [cards, setCards] = useState([0, 1, 2, 3]); // 卡片索引数组
  const [animationClasses, setAnimationClasses] = useState(["", "", "", ""]); // 每个卡片的动画类

  const handleNextCard = () => {
    // 当前卡片索引
    const currentCard = cards[0];

    // 设置当前卡片动画类
    const newAnimationClasses = [...animationClasses];
    newAnimationClasses[0] = "toggle-animation"; // 当前最前面的卡片添加动画类

    // 更新动画类
    setAnimationClasses(newAnimationClasses);

    // 切换卡片顺序
    setTimeout(() => {
      // 移除当前卡片的动画类
      newAnimationClasses[0] = "";
      setAnimationClasses(newAnimationClasses);

      // 将当前卡片移到最后面
      setCards((prevCards) => [...prevCards.slice(1), currentCard]);
    }, 1000); // 动画持续时间为1秒
  };

  return (
    <View>
      <View className="card-stack">
        {cards.map((card, index) => (
          <View
            key={card}
            className={`card z-${4 - index} ${animationClasses[index]}`}
          >
            {card + 1}
          </View>
        ))}
      </View>
      <XButton onClick={handleNextCard}>Next</XButton>
    </View>
  );
};

export default CardStack;
