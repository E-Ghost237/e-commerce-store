/**
 * Brand layer. The commerce core is brand-neutral; everything a shopper reads about the brand lives here,
 * so a second brand is a second content file, not a code change.
 */
export const site = {
  brand: "Common/Core",
  tagline: "Fur-free home, minus the sticky sheets.",
  description: "Reusable pet hair tools that actually lift fur from sofas, beds, cars and laundry. Ships across the US.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com",
  hero: {
    eyebrow: "Shedding season / 2026",
    title: "Fur off.\nIn one pass.",
    body: "Reusable rollers and gloves that lift pet hair from fabric without refills, batteries or sticky tape.",
    cta: "Shop the kit",
  },
  demoVideo: {
    src: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? "",
    poster: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1600",
    caption: "Watch the roller clear a couch cushion in 12 seconds.",
  },
  benefits: [
    { title: "No refills, ever", body: "Empty the chamber into the bin and keep going. Nothing sticky to rebuy." },
    { title: "Works on every fabric", body: "Couches, bedding, car seats, coats: the bristles grab fur without pilling." },
    { title: "Ships from the US", body: "Fast US delivery with tracking from the moment your order leaves the warehouse." },
  ],
  testimonials: [
    { quote: "Two huskies, one grey sofa. This is the first thing that keeps up.", author: "Dana, Portland" },
    { quote: "I cancelled my lint roller subscription the week it arrived.", author: "Marcus, Austin" },
    { quote: "Car seats went from fur carpet to clean in five minutes.", author: "Priya, Denver" },
  ],
  faq: [
    { question: "How long does shipping take?", answer: "Delivery estimates come from our fulfilment partner at checkout and depend on the shipping option you choose. Every order gets tracking." },
    { question: "Can I return it?", answer: "Yes. If it doesn't work for you, contact us within 30 days of delivery and we'll make it right." },
    { question: "Do I need an account?", answer: "No. Check out as a guest; we e-mail your confirmation and tracking link." },
    { question: "Is checkout secure?", answer: "Payment happens on Stripe's hosted checkout. We never see or store your card details." },
  ],
  pages: {
    shipping: {
      title: "Shipping",
      body: [
        "We ship to addresses in the United States.",
        "Shipping options, costs and delivery estimates are shown at checkout before you pay. They come from a live quote for your address and cart.",
        "Orders are sent to our fulfilment partner shortly after payment is confirmed. You receive an e-mail with tracking as soon as the parcel ships.",
        "If tracking stalls or a delivery problem occurs, we follow up with the carrier and keep you informed.",
      ],
    },
    returns: {
      title: "Returns & refunds",
      body: [
        "Contact us within 30 days of delivery if something is wrong or the product isn't right for you.",
        "Refunds go back to your original payment method. Banks usually show them within 5-10 business days.",
        "Damaged or incorrect items are replaced or refunded at no cost to you.",
      ],
    },
    privacy: {
      title: "Privacy policy",
      body: [
        "We collect what we need to fulfil your order: your e-mail, shipping address and the items you buy.",
        "Payments are processed by Stripe; card details never reach our servers.",
        "We record how you found us (for example campaign parameters in links) to measure our marketing. We don't sell personal data.",
        "We only send marketing e-mails, such as a checkout reminder, if you opted in at checkout. Write to us to access or delete your data.",
      ],
    },
    terms: {
      title: "Terms of sale",
      body: [
        "Prices are shown in US dollars and confirmed by our servers at checkout.",
        "Your order is accepted once payment is confirmed. If an item becomes unavailable after payment, we contact you and refund or replace it; we never substitute silently.",
        "These terms are governed by the laws of the United States and the state in which the merchant is registered.",
      ],
    },
    contact: {
      title: "Contact",
      body: [
        "Questions about an order, a return or a product? We usually reply within one business day.",
        "Include your order number (it starts with CC-) so we can help faster.",
      ],
    },
  },
} as const;

export type InfoPageKey = keyof typeof site.pages;
