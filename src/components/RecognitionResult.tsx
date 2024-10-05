import { View, Text } from "@tarojs/components";
import React from "react";

interface RecognitionResultProps {
  result: string;
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({ result }) => {
  return (
    <View>
      <Text>识别结果：{result}</Text>
    </View>
  );
};

export default RecognitionResult;
