/* eslint-disable react/no-unescaped-entities */
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  type ListRenderItem,
} from "react-native";

import { TicketCard } from "@/components/TicketCard/TicketCard";
import { listTickets } from "@/lib/repositories/tickets.repository";
import { ScreenState } from "@/lib/types/pageTypes";
import type { TicketEntity } from "@/lib/validations/ticket.schema";
import { ticketStyles } from "@/styles/ticketStyles";

const keyExtractor = (item: TicketEntity): string => item.id;

const renderItem: ListRenderItem<TicketEntity> = ({ item }) => (
  <TicketCard ticket={item} />
);

const EmptyList = () => (
  <View className={ticketStyles.emptyWrapper}>
    <Feather name="inbox" size={48} color="#94a3b8" />
    <Text className={ticketStyles.emptyTitle}>Nenhum chamado encontrado</Text>
    <Text className={ticketStyles.emptySubtitle}>
      Abra um novo chamado pela aba 'Novo&lsquo; para ele aparecer aqui.
    </Text>
  </View>
);

export default function HomePage() {
  const [state, setState] = useState<ScreenState>({ status: "loading" });

  const fetchTickets = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const tickets = await listTickets();
      setState({ status: "success", data: tickets });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao carregar chamados.";
      setState({ status: "error", message });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [fetchTickets])
  );

  if (state.status === "loading") {
    return (
      <View className={ticketStyles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={ticketStyles.loadingText}>Carregando chamados...</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View className={ticketStyles.errorWrapper}>
        <Feather name="alert-circle" size={40} color="#ef4444" />
        <Text className={ticketStyles.errorTitle}>Falha ao carregar</Text>
        <Text className={ticketStyles.errorSubtitle}>{state.message}</Text>
      </View>
    );
  }
  const tickets = Array.isArray(state.data) ? state.data : [state.data];
  return (
    <FlatList
      className={ticketStyles.container}
      contentContainerClassName={ticketStyles.listContent}
      contentContainerStyle={tickets.length === 0 ? { flex: 1 } : undefined}
      data={tickets}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={EmptyList}
      showsVerticalScrollIndicator={false}
    />
  );
}