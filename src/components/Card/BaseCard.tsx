import { Text, View } from "@tarojs/components";

// import gridBg from "@/assets/grid-bg.png";

interface Props {
  word: string;
  size?: string;
  padding?: string;
  onClick?: () => void;
}

const BaseCard = ({
  word,
  size = "3rem",
  padding = "2rem",
  onClick,
}: Props) => {
  return (
    <View
      className="bg-white border-solid border-2 rounded-md cursor-pointer"
      style={{ width: 150, height: 200 }}
      onClick={onClick}
    >
      <View className="flex w-full h-full justify-center items-center">
        <Text style={{ fontSize: size, lineHeight: size, padding: padding }}>
          {word}
        </Text>
      </View>
    </View>
  );
};

export default BaseCard;
