import { createInnerAudioContext, InnerAudioContext } from "@tarojs/taro";
import { useState } from "react";

import { AudioStatus } from "@/types/AudioPlayer";

interface Player {
  current: InnerAudioContext | undefined;
  status: AudioStatus;
  play: (src: string) => void;
  pause: () => void;
  stop: () => void;
  destroy: () => void;
}

const useAudioPlayer = (): Player => {
  const [current, setCurrent] = useState<InnerAudioContext>();
  const [status, setStatus] = useState<AudioStatus>("idle");

  const createAudioContext = (src: string) => {
    const ctx = createInnerAudioContext();
    ctx.src = src;
    setCurrent(ctx);
    return ctx;
  };

  const play = (src: string) => {
    const ctx = createAudioContext(src);
    ctx.onEnded(() => setStatus("finished"));
    ctx.onError(() => setStatus("error"));
    ctx.play();
    setStatus("playing");
  };

  const pause = () => {
    if (current && status !== "finished") {
      current.pause();
      setStatus("paused");
    }
  };

  const stop = () => {
    if (current) {
      current.stop();
      setStatus("stopped");
    }
  };

  const destroy = () => {
    if (current) current.destroy();
  };

  return { current, status, play, pause, stop, destroy };
};

export default useAudioPlayer;
