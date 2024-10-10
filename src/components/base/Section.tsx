import { View } from "@tarojs/components";

export default function Section({ children }: { children: React.ReactNode }) {
  return <View className="my-4">{children}</View>;
}
