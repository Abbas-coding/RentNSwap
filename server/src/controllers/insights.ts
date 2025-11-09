import asyncHandler from "express-async-handler";
import Item from "../models/Item";
import Booking from "../models/Booking";
import Swap from "../models/Swap";

export const getOverview = asyncHandler(async (_req, res) => {
  const [items, bookings, swaps] = await Promise.all([
    Item.find().limit(20),
    Booking.find(),
    Swap.find(),
  ]);

  const stats = {
    items: items.length,
    bookings: bookings.length,
    swaps: swaps.length,
    avgRating:
      items.length > 0
        ? Number((items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length).toFixed(1))
        : 0,
  };

  const trending = items.slice(0, 4).map((item) => ({
    title: item.title,
    price: `$${item.pricePerDay}/day`,
  }));

  res.json({ stats, trending });
});

export const getCommunityInsights = asyncHandler(async (_req, res) => {
  const items = await Item.find();
  const locations = new Set(items.map((item) => item.location));

  res.json({
    stats: {
      sharedItems: items.length,
      locations: locations.size,
      avgRating:
        items.length > 0
          ? Number((items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length).toFixed(1))
          : 0,
    },
    testimonials: [
      {
        quote: "Swapping camera gear between shoots keeps my kit fresh without buying new every season.",
        author: "Lena — content creator",
      },
      {
        quote: "Rent & Swap helped our co-op host events without overbuying furniture and décor.",
        author: "Anika — community organizer",
      },
    ],
  });
});
