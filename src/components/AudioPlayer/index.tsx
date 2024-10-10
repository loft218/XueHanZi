import { Button, View } from "@tarojs/components";

import { AudioStatus } from "@/types/AudioPlayer";

interface Props {
  audioUrl?: string;
  audioStatus: AudioStatus;
  playAudio: (audioUrl: string) => void;
  pauseAudio: () => void;
}
const AudioPlayer = ({
  audioUrl,
  audioStatus,
  playAudio,
  pauseAudio,
}: Props) => {
  return (
    audioUrl && (
      <View className="flex justify-center items-center h-16">
        <View
          onClick={() => {
            audioStatus === "playing" ? pauseAudio() : playAudio(audioUrl!);
          }}
        >
          <Button>▶</Button>
        </View>
      </View>
    )
  );
};

export default AudioPlayer;
