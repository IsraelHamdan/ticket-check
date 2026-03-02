import { View } from "react-native";
import { dotsStyles } from "./styles";

export default function PaginationDots({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  return (
    <View className={dotsStyles.wrapper}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={
            i === active ? dotsStyles.dotActive : dotsStyles.dotInactive
          }
        />
      ))}
    </View>
  );
}