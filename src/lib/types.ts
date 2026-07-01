export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  category?: string | null;
  startingPrice: number;
  currentHighestBid: number;
  highestBidderId?: string | null;
  highestBidderName?: string | null;
  startTime: string;
  durationMinutes: number;
  minIncrement?: number | null;
  isPublished: boolean;
  winnerId?: string | null;
  winnerName?: string | null;
  winningBid?: number | null;
  adminId: string;
  status: 'upcoming' | 'live' | 'ended';
}