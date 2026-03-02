import { RankedTicket } from "@/lib/utils/ticket.utils";
import React, { useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import PaginationDots from "./ticketCarrossel/paginationDot";
import { baseStyles } from "./ticketCarrossel/styles";
import TicketCardCarrossel from "./ticketCarrossel/ticketCardCarrossel";

type Props = {
  tickets: RankedTicket[];
};


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;

export default function TicketsCarousel({ tickets }: Props) {
  const carouselRef = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  if (tickets.length === 0) {
    return (
      <View className={baseStyles.emptyContainer}>
        <Text className={baseStyles.emptyText}>
          Nenhum ticket encerrado ainda
        </Text>
      </View>
    );
  }

  return (
    <View className={baseStyles.card}>
      <Text className={baseStyles.title}>🏆 Top 5 — Encerrados mais Rápido</Text>

      <Carousel
        ref={carouselRef}
        data={tickets}
        width={CARD_WIDTH}
        height={180}
        loop
        autoPlay={isAutoPlaying}
        autoPlayInterval={3000}
        scrollAnimationDuration={600}
        onProgressChange={(_, absoluteProgress) => {
          // Atualiza o dot ativo no meio da transição
          const index = Math.round(absoluteProgress) % tickets.length;
          setActiveIndex(index);
        }}
        onScrollStart={() => setIsAutoPlaying(false)}  // pausa ao toque
        onScrollEnd={() => setIsAutoPlaying(true)}     // retoma após swipe
        renderItem={({ item }) => <TicketCardCarrossel ticket={item} />}
      />

      <PaginationDots total={tickets.length} active={activeIndex} />
    </View>
  );
}