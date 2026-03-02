import { TicketMetrics } from "@/lib/validations/ticket.schema";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Props = {
  metrics: TicketMetrics;
};

const STATUS_CONFIG = [
  { key: "ABERTO", label: "Aberto", color: "#ef4444" },
  { key: "ACEITO", label: "Aceito", color: "#3b82f6" },
  { key: "ENCERRADO", label: "Encerrado", color: "#22c55e" },
  { key: "CANCELADO", label: "Cancelado", color: "#6b7280" },
  { key: "IMPROCEDENTE", label: "Improcedente", color: "#f59e0b" },
] as const;

export function MetricsCharts({ metrics }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const barData = STATUS_CONFIG.map(({ key, label, color }) => ({
    value: metrics.byStatus[key],
    label,
    frontColor: color,
    topLabelComponent: () => (
      <Text style={{ fontSize: 10, color: isDark ? "#a1a1aa" : "#52525b", marginBottom: 2 }}>
        {metrics.byStatus[key]}
      </Text>
    ),
  }));

  const labelColor = isDark ? "#a1a1aa" : "#71717a";
  const rulesColor = isDark ? "#3f3f46" : "#e4e4e7";
  const yAxisColor = isDark ? "#52525b" : "#d4d4d8";

  return (
    <View className={styles.card}>
      <Text className={styles.title}>Distribuição por Status</Text>

      <BarChart
        data={barData}
        barWidth={38}
        spacing={14}
        roundedTop
        hideRules={false}
        rulesColor={rulesColor}
        rulesType="solid"
        xAxisColor={yAxisColor}
        yAxisColor={yAxisColor}
        yAxisTextStyle={{ color: labelColor, fontSize: 11 }}
        xAxisLabelTextStyle={{ color: labelColor, fontSize: 10 }}
        noOfSections={4}
        maxValue={Math.max(...Object.values(metrics.byStatus), 4)}
        barBorderRadius={4}
        isAnimated
      />
    </View>
  );
}

const styles = {
  card: "bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm",
  title: "text-base font-bold text-zinc-800 dark:text-zinc-100 mb-4",
};