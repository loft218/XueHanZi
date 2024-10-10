import { createInnerAudioContext, InnerAudioContext } from "@tarojs/taro";
import { useState, useEffect, useCallback } from "react";

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

  // 创建 InnerAudioContext 实例
  useEffect(() => {
    const ctx = createInnerAudioContext();
    setCurrent(ctx);

    return () => {
      if (ctx) {
        ctx.destroy(); // 清理音频实例
      }
    };
  }, []);

  // 处理所有音频事件
  const handleAudioEvents = useCallback((ctx: InnerAudioContext) => {
    ctx.onPlay(() => setStatus("playing"));
    ctx.onPause(() => setStatus("paused"));
    ctx.onEnded(() => setStatus("finished"));
    ctx.onStop(() => setStatus("stopped"));
    ctx.onError((err) => {
      console.error("Audio Error: ", err);
      setStatus("error");
    });
    ctx.onCanplay(() => {
      setStatus("ready");
      ctx.play();
    });
    ctx.onWaiting(() => {
      setStatus("loading");
    });
  }, []);

  const play = (src: string) => {
    if (!current) {
      console.error("Audio context is not initialized.");
      return;
    }

    // 避免重复播放
    if (status === "playing" && current.src === src) {
      return;
    }

    current.src = src; // 更新 src
    setStatus("loading");

    // 绑定事件
    handleAudioEvents(current);

    // 调用 play 会触发 onCanplay 后正式播放
    current.play();
  };

  const pause = () => {
    if (current && status === "playing") {
      current.pause();
    }
  };

  const stop = () => {
    if (current) {
      current.stop();
    }
  };

  const destroy = () => {
    if (current) {
      // 清除所有监听器以防止内存泄漏
      current.offPlay();
      current.offPause();
      current.offEnded();
      current.offStop();
      current.offError();
      current.offCanplay();
      current.offWaiting();
      current.destroy();
      setStatus("idle");
    }
  };

  return { current, status, play, pause, stop, destroy };
};

export default useAudioPlayer;
