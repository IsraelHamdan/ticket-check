import { TicketMetrics } from "@/lib/repositories";
import { Text, View } from "react-native";

type Props = {
  metrics: TicketMetrics;
};

export default function MetricsCards({ metrics }: Props) {
  const avgLabel = metrics.avgClosingTimeMinutes !== null
    ? `${metrics.avgClosingTimeMinutes} min`
    : "—";

  return (
    <View className={styles.wrapper}>
      {/* Total Geral */}
      <View className={styles.card}>
        <Text className={styles.cardValue}>{metrics.totalCount}</Text>
        <Text className={styles.cardLabel}>Total Geral</Text>
      </View>

      {/* Média de encerramento */}
      <View className={styles.card}>
        <Text className={styles.cardValue}>{avgLabel}</Text>
        <Text className={styles.cardLabel}>Média de{"\n"}Encerramento</Text>
      </View>
    </View>
  );

}
const styles = {
  wrapper: "flex-row gap-x-3",
  card: "flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm items-center justify-center",
  cardValue: "text-2xl font-extrabold text-zinc-800 dark:text-zinc-100",
  cardLabel: "text-xs text-zinc-400 dark:text-zinc-500 mt-1 text-center",
};