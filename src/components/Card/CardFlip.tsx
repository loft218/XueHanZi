import { View, Text, Image } from "@tarojs/components";
import { useCallback, useEffect, useState } from "react";

import "./CardFlip.scss";

interface CardFlipProps {
  frontText: string;
  isFlipped: boolean; // 从父组件传入翻转状态
  onFlip: () => void; // 父组件控制翻转的回调函数
  shouldShake?: boolean; // 是否需要抖动动画
  onAnimationComplete?: () => void; // 动画完成后的回调函数
  canFlipBack?: boolean; // 是否允许翻转回来
}

const CardFlip: React.FC<CardFlipProps> = ({
  frontText,
  isFlipped,
  onFlip,
  shouldShake = false,
  onAnimationComplete,
  canFlipBack = true, // 默认允许翻转回来
}) => {
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null); // 当前动画状态
  const [isLocked, setIsLocked] = useState(false); // 锁定状态防止重复点击
  const animationDuration = 1000; // 动画持续时间 1 秒

  // 触发指定类型的动画
  const triggerAnimation = useCallback(
    (animationType: string) => {
      setCurrentAnimation(animationType); // 设置当前动画类型
      setIsLocked(true); // 锁定，防止动画过程中重复点击

      // 动画完成后回调
      setTimeout(() => {
        setCurrentAnimation(null); // 清除动画状态
        setIsLocked(false); // 解锁
        if (onAnimationComplete) {
          onAnimationComplete(); // 动画完成后通知父组件
        }
      }, animationDuration);
    },
    [onAnimationComplete]
  );

  useEffect(() => {
    if (shouldShake && !isFlipped) {
      triggerAnimation("shake");
    }
  }, [isFlipped, shouldShake, triggerAnimation]);

  // 点击卡片进行翻转操作
  const handleClick = () => {
    if (isLocked) return; // 动画过程中不允许点击

    // 如果卡片已翻转，只有在 canFlipBack 为 true 时才允许再次翻转
    if (isFlipped && !canFlipBack) return;

    triggerAnimation("flip"); // 触发翻转动画
    onFlip(); // 通知父组件翻转卡片
  };

  return (
    <View className="card-container" onClick={handleClick}>
      <View
        className={`card ${isFlipped ? "flipped" : ""} ${
          currentAnimation === "shake"
            ? "animate__animated animate__shakeX"
            : ""
        } ${currentAnimation === "flip" ? "flipped" : ""}`} // 根据当前动画类型应用不同动画
        style={{ transitionDuration: `${animationDuration}ms` }} // 动画持续时间
      >
        {/* 正面 */}
        <View
          className={`card-front ${
            currentAnimation === "shake" ? "bg-red-200" : "bg-white"
          }`}
        >
          <Text className="text-8xl">{frontText}</Text>
        </View>
        {/* 背面 */}
        <View className="card-back">
          <Image
            src={`http://qiniu.xiaoque.cc/xuehz/images/${frontText}.png`}
            mode="widthFix"
            style={{ width: "100%" }}
          />
          <Text>我们</Text>
        </View>
      </View>
    </View>
  );
};

export default CardFlip;
