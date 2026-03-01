import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { formatDateShort } from "@/lib/utils/formarters";
import {
  ticketStatusLabel,
  type TicketEntity
} from "@/lib/validations/ticket.schema";
import { STATUS_CONFIG, styles } from "./styles";

type TicketCardProps = {
  ticket: TicketEntity;
};

export function TicketCard({ ticket }: TicketCardProps) {
  const router = useRouter();
  const config = STATUS_CONFIG[ticket.status];

  const handlePress = () => {
    router.push({
      pathname: `/(tabs)/tickets/${ticket.id}`,
      params: { id: ticket.id },
    });
  };
  return (
    <Pressable className={styles.pressable} onPress={handlePress}>
      <View className={`${styles.card} ${config.borderColor}`}>
        <View className={styles.body}>
          <View className={styles.header}>
            <Text className={styles.title} numberOfLines={2}>
              {ticket.title}
            </Text>
            <View className={`${styles.badge} ${config.badgeBg}`}>
              <View className={`${styles.badgeDot} ${config.dotColor}`} />
              <Text className={`${styles.badgeText} ${config.badgeText}`}>
                {ticketStatusLabel[ticket.status]}
              </Text>
            </View>
          </View>

          <Text className={styles.details} numberOfLines={2}>
            {ticket.details}
          </Text>

          <View className={styles.footer}>
            <View className={styles.metaRow}>
              <Feather name="user" size={11} color="#94a3b8" />
              <Text className={styles.metaText}>{ticket.requester}</Text>
            </View>

            <View className={styles.metaRow}>
              <Feather name="calendar" size={11} color="#94a3b8" />
              <Text className={styles.metaText}>
                {formatDateShort(ticket.createdAt)}
              </Text>
            </View>

            <View className={styles.metaRow}>
              <Feather name="clock" size={11} color="#94a3b8" />
              <Text className={styles.metaText}>
                Prazo: {formatDateShort(ticket.deadline)}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.chevron}>
          <Feather name="chevron-right" size={16} color="#94a3b8" />
        </View>
      </View>
    </Pressable>
  );
}