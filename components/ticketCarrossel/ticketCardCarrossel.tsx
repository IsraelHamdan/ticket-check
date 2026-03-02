import { RankedTicket } from "@/lib/utils/ticket.utils";
import { Text, View } from "react-native";
import { cardStyles } from "./styles";

export default function TicketCardCarrossel({ ticket }: { ticket: RankedTicket; }) {
  const closingLabel =
    ticket.closingMinutes < 60
      ? `${ticket.closingMinutes} min`
      : `${Math.floor(ticket.closingMinutes / 60)}h ${ticket.closingMinutes % 60}min`;

  return (
    <View className={cardStyles.card}>
      {/* Header do card */}
      <View className={cardStyles.header}>
        <View className={cardStyles.rankBadge}>
          <Text className={cardStyles.rankText}>#{ticket.rank}</Text>
        </View>
        <Text className={cardStyles.closingTime}>⚡ {closingLabel}</Text>
      </View>

      {/* Conteúdo */}
      <Text className={cardStyles.title} numberOfLines={2}>
        {ticket.title}
      </Text>

      <Text className={cardStyles.details} numberOfLines={2}>
        {ticket.details}
      </Text>

      {/* Rodapé */}
      <View className={cardStyles.footer}>
        <Text className={cardStyles.footerLabel}>
          Solicitante:{" "}
          <Text className={cardStyles.footerValue}>{ticket.requester}</Text>
        </Text>
        <Text className={cardStyles.footerLabel}>
          Encerrado:{" "}
          <Text className={cardStyles.footerValue}>
            {ticket.updatedAt.toLocaleDateString("pt-BR")}
          </Text>
        </Text>
      </View>
    </View>
  );
}