import { View, Text } from "@tarojs/components";
import { useState } from "react";

import "./CardFlip.scss";

interface CardFlipProps {
  frontText: string;
  backColor: string;
}

const CardFlip: React.FC<CardFlipProps> = ({ frontText, backColor }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <View className="card-container" onClick={handleClick}>
      <View className={`card ${isFlipped ? "flipped" : ""}`}>
        {/* 正面 */}
        <View className="card-front">
          <Text className="text-3xl">{frontText}</Text>
        </View>
        {/* 背面 */}
        <View className="card-back" style={{ backgroundColor: backColor }} />
      </View>
    </View>
  );
};

export default CardFlip;
