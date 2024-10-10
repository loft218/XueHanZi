import { View, Text } from "@tarojs/components";

// import gridBg from "@/assets/grid-bg.png";

interface Props {
  word: string;
  size?: string;
  padding?: string;
  className?: string;
  onClick?: () => void;
}

const WordCard = ({
  word,
  size = "3rem",
  padding = "2rem",
  className = "",
  onClick,
}: Props) => {
  return (
    <Text
      onClick={onClick}
      className={`bg-white border-solid border-2 rounded-md ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{ fontSize: size, lineHeight: size, padding: padding }}
    >
      {word}
    </Text>
  );
};

export default WordCard;
