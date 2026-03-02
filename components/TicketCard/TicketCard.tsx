import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { formatDateShort } from "@/lib/utils/formarters";
import { ticketStatusLabel, type TicketEntity } from "@/lib/validations/ticket.schema";
import { ticketStyles } from "@/styles/ticketStyles";
import { STATUS_CONFIG, ticketCardStyles } from "./styles";

type TicketCardProps = { ticket: TicketEntity; };

export function TicketCard({ ticket }: TicketCardProps) {
  const router = useRouter();
  const statusConfig = STATUS_CONFIG[ticket.status];

  return (
    <Pressable
      className={ticketCardStyles.pressable}
      onPress={() => router.push({ pathname: "/(tabs)/tickets/[id]", params: { id: ticket.id } })}
    >
      <View className={`${ticketCardStyles.card} ${statusConfig.borderColor}`}>
        <View className={ticketCardStyles.body}>
          <View className={ticketCardStyles.header}>
            <Text className={ticketCardStyles.title} numberOfLines={2}>
              {ticket.title}
            </Text>
            {/* Badge estrutural de ticketStyles, cor de statusConfig */}
            <View className={`${ticketStyles.badge} ${statusConfig.badgeBg}`}>
              <View className={`${ticketStyles.badgeDot} ${statusConfig.dotColor}`} />
              <Text className={`${ticketStyles.badgeText} ${statusConfig.badgeText}`}>
                {ticketStatusLabel[ticket.status]}
              </Text>
            </View>
          </View>

          <Text className={ticketCardStyles.details} numberOfLines={2}>
            {ticket.details}
          </Text>

          <View className={ticketCardStyles.footer}>
            <View className={ticketCardStyles.metaRow}>
              <Feather name="user" size={12} color="#94a3b8" />
              <Text className={ticketCardStyles.metaText}>{ticket.requester}</Text>
            </View>
            <View className={ticketCardStyles.metaRow}>
              <Feather name="calendar" size={12} color="#94a3b8" />
              <Text className={ticketCardStyles.metaText}>{formatDateShort(ticket.createdAt)}</Text>
            </View>
            <View className={ticketCardStyles.metaRow}>
              <Feather name="clock" size={12} color="#94a3b8" />
              <Text className={ticketCardStyles.metaText}>Prazo: {formatDateShort(ticket.deadline)}</Text>
            </View>
          </View>
        </View>

        <View className={ticketCardStyles.chevron}>
          <Feather name="chevron-right" size={18} color="#94a3b8" />
        </View>
      </View>
    </Pressable>
  );
}