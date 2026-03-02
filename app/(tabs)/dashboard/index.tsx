import MetricsCards from "@/components/metricsCharts/metricCards";
import { MetricsCharts } from "@/components/metricsCharts/metrricCharts";
import { StatusPieChart } from "@/components/statusPieChart/StatusPieChart";
import TicketsCarousel from "@/components/ticketsCarrossel";
import { getTicketMetrics, listTicketsGroupedByStatus } from "@/lib/repositories";
import { ScreenState } from "@/lib/types/pageTypes";
import { getTop5FastestClosed } from "@/lib/utils/ticket.utils";
import { TicketMetrics, TicketsGroupedByStatus } from "@/lib/validations/ticket.schema";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";


type MetricsState =
  | { status: "loading"; }
  | { status: "error"; message: string; }
  | { status: "success"; data: TicketMetrics; };
function isGroupedByStatus(data: unknown): data is TicketsGroupedByStatus {
  return (
    typeof data === "object" &&
    data !== null &&
    "ABERTO" in data &&
    "ACEITO" in data &&
    "ENCERRADO" in data &&
    "CANCELADO" in data &&
    "IMPROCEDENTE" in data
  );
}


// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {

  const [ticketsState, setTicketsState] = useState<ScreenState>({ status: "loading" });
  const [metricsState, setMetricsState] = useState<MetricsState>({ status: "loading" });

  const fetchData = async () => {
    setTicketsState({ status: "loading" });
    setMetricsState({ status: "loading" });

    const [ticketsResult, metricsResult] = await Promise.allSettled([
      listTicketsGroupedByStatus(),
      getTicketMetrics(),
    ]);

    if (ticketsResult.status === "fulfilled") {
      setTicketsState({ status: "success", data: ticketsResult.value });
    } else {
      setTicketsState({ status: "error", message: "Falha ao carregar tickets." });
    }

    if (metricsResult.status === "fulfilled") {
      setMetricsState({ status: "success", data: metricsResult.value });
    } else {
      setMetricsState({ status: "error", message: "Falha ao carregar métricas." });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      className={styles.container}
      contentContainerClassName={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className={styles.header}>
        <Text className={styles.headerTitle}>Dashboard</Text>
        <Text className={styles.headerSub}>Performance e indicadores</Text>
      </View>

      <View className={styles.sections}>

        {/* ── Gráfico de Pizza ── */}
        {ticketsState.status === "loading" && <SectionSkeleton />}
        {ticketsState.status === "error" && <SectionError message={ticketsState.message} />}
        {ticketsState.status === "success" && isGroupedByStatus(ticketsState.data) && (
          <>
            <StatusPieChart groupedTickets={ticketsState.data} />
            <TicketsCarousel
              tickets={getTop5FastestClosed(ticketsState.data.ENCERRADO)}
            />
          </>
        )}
        {/* ── Cards de Métricas + Gráfico de Barras ── */}
        {metricsState.status === "loading" && <SectionSkeleton />}
        {metricsState.status === "error" && <SectionError message={metricsState.message} />}
        {metricsState.status === "success" && (
          <>
            <MetricsCards metrics={metricsState.data} />
            <MetricsCharts metrics={metricsState.data} />
          </>
        )}
      </View>
    </ScrollView>
  );
}


function SectionSkeleton() {
  return (
    <View className={helperStyles.skeleton}>
      <ActivityIndicator size="small" />
    </View>
  );
}

function SectionError({ message }: { message: string; }) {
  return (
    <View className={helperStyles.errorBox}>
      <Text className={helperStyles.errorText}>{message}</Text>
    </View>
  );
}

const helperStyles = {
  skeleton: "bg-white dark:bg-zinc-900 rounded-2xl p-6 items-center justify-center",
  errorBox: "bg-red-50 dark:bg-red-950 rounded-2xl p-4",
  errorText: "text-red-500 dark:text-red-400 text-sm text-center",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  container: "flex-1 bg-zinc-100 dark:bg-zinc-950",
  content: "pb-10",
  header: "px-5 pt-6 pb-4",
  headerTitle: "text-2xl font-extrabold text-zinc-800 dark:text-zinc-100",
  headerSub: "text-sm text-zinc-400 dark:text-zinc-500 mt-0.5",
  sections: "px-4 gap-y-4",
};