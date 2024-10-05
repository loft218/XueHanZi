import { View, Button } from "@tarojs/components";
import React from "react";

interface RecordingButtonProps {
  onStart: () => void;
  onStop: () => void;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({
  onStart,
  onStop,
}) => {
  return (
    <View>
      <Button onTouchStart={onStart} onTouchEnd={onStop}>
        按住录音
      </Button>
    </View>
  );
};

export default RecordingButton;
