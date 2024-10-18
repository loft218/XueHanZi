import { View, Text } from "@tarojs/components";
import "./CardFlip.scss";
import { useEffect, useState } from "react";

interface CardFlipProps {
  frontText: string;
  backColor?: string;
  isFlipped: boolean; // 从父组件传入翻转状态
  onFlip: () => void; // 父组件控制翻转的回调函数
  shouldShake?: boolean; // 是否需要抖动动画
}

const CardFlip: React.FC<CardFlipProps> = ({
  frontText,
  backColor = "#cccccc",
  isFlipped,
  onFlip,
  shouldShake = false, // 默认不抖动
}) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (shouldShake && !isFlipped) {
      setShake(true);
      // 动画结束后重置 shake 状态
      const timer = setTimeout(() => {
        setShake(false);
      }, 500); // 动画持续时间，需根据实际情况调整

      return () => clearTimeout(timer); // 清除定时器
    }
  }, [isFlipped, shouldShake]);

  return (
    <View className="card-container" onClick={onFlip}>
      <View
        className={`card ${isFlipped ? "flipped" : ""} ${
          shake ? "animate__animated animate__shakeX" : ""
        }`}
      >
        {/* 正面 */}
        <View className={`card-front ${shake ? "bg-red-200" : "bg-white"}`}>
          <Text className="text-3xl">{frontText}</Text>
        </View>
        {/* 背面 */}
        <View className="card-back" style={{ backgroundColor: backColor }} />
      </View>
    </View>
  );
};

export default CardFlip;
