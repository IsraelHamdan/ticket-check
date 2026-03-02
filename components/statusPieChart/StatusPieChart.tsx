import { TicketsGroupedByStatus } from "@/lib/validations/ticket.schema";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

// ─── Constantes ───────────────────────────────────────────────────────────────

const STATUS_CONFIG = [
  { key: "ABERTO", label: "Aberto", color: "#ef4444" },
  { key: "ACEITO", label: "Aceito", color: "#3b82f6" },
  { key: "ENCERRADO", label: "Encerrado", color: "#22c55e" },
  { key: "CANCELADO", label: "Cancelado", color: "#6b7280" },
  { key: "IMPROCEDENTE", label: "Improcedente", color: "#f59e0b" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  groupedTickets: TicketsGroupedByStatus;
};

type PieItem = {
  key: string;
  value: number;
  color: string;
  label: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusPieChart({ groupedTickets }: Props) {
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  // Monta os dados filtrando status sem tickets
  const pieData = useMemo<PieItem[]>(() =>
    STATUS_CONFIG
      .map(({ key, label, color }) => ({
        key,
        label,
        color,
        value: groupedTickets[key as keyof TicketsGroupedByStatus].length,
      }))
      .filter(item => item.value > 0),
    [groupedTickets]
  );

  const total = useMemo(
    () => pieData.reduce((acc, cur) => acc + cur.value, 0),
    [pieData]
  );

  // Dado focado (para o label central dinâmico)
  const focused = focusedKey
    ? pieData.find(d => d.key === focusedKey)
    : null;

  if (total === 0) {
    return (
      <View className={styles.emptyContainer}>
        <Text className={styles.emptyText}>Sem dados de tickets</Text>
      </View>
    );
  }

  return (
    <View className={styles.card}>
      <Text className={styles.title}>Status dos Tickets</Text>

      {/* Gráfico */}
      <View className={styles.chartWrapper}>
        <PieChart
          data={pieData}
          donut
          radius={110}
          innerRadius={68}
          strokeWidth={2}
          strokeColor="#fff"
          focusOnPress
          toggleFocusOnPress
          onPress={(item: PieItem) =>
            setFocusedKey(prev => (prev === item.key ? null : item.key))
          }
          centerLabelComponent={() => (
            <View className={styles.centerLabel}>
              {focused ? (
                <>
                  <Text
                    className={styles.centerValue}
                    style={{ color: focused.color }}
                  >
                    {focused.value}
                  </Text>
                  <Text className={styles.centerSub} numberOfLines={1}>
                    {focused.label}
                  </Text>
                </>
              ) : (
                <>
                  <Text className={styles.centerValue}>{total}</Text>
                  <Text className={styles.centerSub}>Total</Text>
                </>
              )}
            </View>
          )}
        />
      </View>

      {/* Legenda */}
      <View className={styles.legendWrapper}>
        {pieData.map(item => (
          <TouchableOpacity
            key={item.key}
            onPress={() =>
              setFocusedKey(prev => (prev === item.key ? null : item.key))
            }
            className={styles.legendItem}
            activeOpacity={0.7}
          >
            <View
              className={styles.legendDot}
              style={{
                backgroundColor: item.color,
                // Destaca o item focado
                width: focusedKey === item.key ? 14 : 10,
                height: focusedKey === item.key ? 14 : 10,
              }}
            />
            <Text className={styles.legendText}>
              {item.label}:{" "}
              <Text className={styles.legendCount}>{item.value}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  // Card principal
  card: "bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm",
  title: "text-base font-bold text-zinc-800 dark:text-zinc-100 mb-4",

  // Área do gráfico
  chartWrapper: "items-center",

  // Label central (dentro do donut)
  centerLabel: "items-center justify-center",
  centerValue: "text-3xl font-extrabold text-zinc-800 dark:text-zinc-100",
  centerSub: "text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 max-w-[80px] text-center",

  // Legenda
  legendWrapper: "flex-row flex-wrap gap-x-4 gap-y-2 mt-5",
  legendItem: "flex-row items-center gap-x-2",
  legendDot: "rounded-full",
  legendText: "text-sm text-zinc-600 dark:text-zinc-400",
  legendCount: "font-bold text-zinc-800 dark:text-zinc-200",

  // Estado vazio
  emptyContainer: "bg-white dark:bg-zinc-900 rounded-2xl p-6 items-center",
  emptyText: "text-zinc-400 dark:text-zinc-500 text-sm",
};