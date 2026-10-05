/**
 * Brand layer. The commerce core is brand-neutral; everything a shopper reads about the brand lives here,
 * so a second brand is a second content file, not a code change.
 */
export const site = {
  brand: "Paw & Pine",
  tagline: "Fur-free home, minus the sticky sheets.",
  description:
    "Reusable pet hair tools that lift fur from sofas, beds, cars and laundry — no refills, no batteries, nothing to rebuy. Ships across the US.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com",

  announcement: ["Ships from the US", "30-day returns", "No refills to rebuy", "Secure checkout by Stripe"],

  hero: {
    eyebrow: "The Fur-Free Home Kit",
    title: "Fur off.\nIn one pass.",
    body: "Reusable rollers and gloves that lift pet hair out of fabric — couches, bedding, car seats — without refills, batteries or sticky tape.",
    cta: "Shop the kit",
    secondaryCta: "See how it works",
    trust: ["No refills, ever", "Works on every fabric", "Ships from the US"],
    image: "/images/hero-living-room.jpg",
    imageAlt: "Golden retriever and a cat asleep on a cream boucle sofa in a sunlit living room",
    stat: { value: "1 pass", label: "to clear a cushion, not five sticky sheets" },
  },

  /** Scrolling value strip under the hero. */
  marquee: [
    "Sofas",
    "Bedding",
    "Car seats",
    "Coats & blankets",
    "No sticky sheets to rebuy",
    "Sealed fur chamber",
    "Rinse and reuse",
    "US-wide delivery",
  ],

  demoVideo: {
    src: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? "",
    poster: "/images/detail-roller.jpg",
    caption: "Watch the roller clear a couch cushion — no sheets, no batteries, no fur left in the weave.",
    fallbackAlt: "A hand rolling pet hair off a linen sofa cushion",
  },

  story: {
    eyebrow: "Why it works",
    title: "Bristles that grab fur instead of hiding it.",
    body: [
      "Sticky sheets run out mid-clean and vacuums push hair deeper into the weave. This roller lifts fur, dander and lint out of fabric and seals it in a chamber you empty into the bin.",
      "The same short bristles are gentle on boucle, linen, velvet, car upholstery and coats — soft enough that cushions come back without pilling.",
    ],
    bullets: [
      "Sealed chamber: fur stays in the roller, not on your hands",
      "Works dry, on any fabric, without batteries",
      "Rinseable and reusable for years, not weeks",
    ],
  },

  how: {
    eyebrow: "How it works",
    title: "Three steps, ten seconds.",
    steps: [
      {
        title: "Roll it over the fabric",
        body: "Short bristles lift fur, dander and lint out of the weave instead of pushing it around.",
      },
      {
        title: "Empty the chamber",
        body: "Pop the lid and tip the fur straight into the bin. No sheets to peel, nothing on your hands.",
      },
      {
        title: "Rinse it and reuse it",
        body: "A rinse under the tap and it is ready for tomorrow. Nothing to reorder, ever.",
      },
    ],
  },

  rooms: {
    eyebrow: "Around the house",
    title: "Built for the places fur actually lands.",
    items: [
      { title: "The couch", body: "Boucle, linen and velvet come back to life without pilling.", image: "/images/hero-living-room.jpg", alt: "Dog and cat resting on a cream boucle sofa" },
      { title: "The back seat", body: "Five minutes in the school run queue and the upholstery reads grey again.", image: "/images/car-interior.jpg", alt: "A dog on a blanket on the back seat of a car" },
      { title: "The bed", body: "Clean linen again, even with a cat that claims the duvet every night.", image: "/images/bedroom-linen.jpg", alt: "A grey cat curled up on white linen bedding" },
    ],
  },

  benefits: [
    { title: "No refills, ever", body: "Empty the chamber into the bin and keep going. Nothing sticky to rebuy." },
    { title: "Works on every fabric", body: "Couches, bedding, car seats, coats: the bristles grab fur without pilling." },
    { title: "Ships from the US", body: "Fast US delivery with tracking from the moment your order leaves the warehouse." },
  ],

  comparison: {
    eyebrow: "The honest comparison",
    title: "What one pass costs you.",
    columns: ["Sticky sheets", "Vacuum nozzle", "Paw & Pine"],
    rows: [
      ["Refills to buy", "Every week or two", "Bags and filters", "None"],
      ["Runs on", "Thumb work", "Power and noise", "Nothing"],
      ["On upholstery", "Rips on texture", "Snags loose weave", "Fabric-safe bristles"],
      ["Fur ends up", "In the bin, sticky side down", "Back in the air", "Sealed in the chamber"],
    ],
  },

  testimonials: [
    { quote: "Two huskies, one grey sofa. This is the first thing that keeps up.", author: "Dana", location: "Portland, OR" },
    { quote: "I cancelled my lint roller subscription the week it arrived.", author: "Marcus", location: "Austin, TX" },
    { quote: "Car seats went from fur carpet to clean in five minutes.", author: "Priya", location: "Denver, CO" },
  ],

  trust: [
    { title: "30-day returns", body: "If it doesn't work for you, contact us within 30 days of delivery." },
    { title: "Secure checkout", body: "Payment happens on Stripe's hosted checkout — we never see your card." },
    { title: "US delivery", body: "Options and delivery estimates shown at checkout, tracking included." },
    { title: "Real support", body: "Questions go to a person, usually answered within one business day." },
  ],

  faq: [
    { question: "How long does shipping take?", answer: "Delivery estimates come from our fulfilment partner at checkout and depend on the shipping option you choose. Every order gets tracking." },
    { question: "Do I need sticky sheets?", answer: "No. The roller's bristles lift fur into a sealed chamber you empty into the bin. There is nothing to peel and nothing to reorder." },
    { question: "Will it damage my sofa?", answer: "The bristles are soft enough for boucle, linen and velvet and are designed to lift fur without pilling or snagging the weave." },
    { question: "Can I return it?", answer: "Yes. If it doesn't work for you, contact us within 30 days of delivery and we'll make it right." },
    { question: "Do I need an account?", answer: "No. Check out as a guest; we e-mail your confirmation and tracking link." },
    { question: "Is checkout secure?", answer: "Payment happens on Stripe's hosted checkout. We never see or store your card details." },
  ],

  /** Product page furniture: what a shopper checks before buying. */
  product: {
    highlights: [
      "Sealed chamber — fur stays in the roller, not on your hands",
      "Fabric-safe bristles for boucle, linen, velvet and car upholstery",
      "Rinses clean and reuses for years: no refills, no batteries",
    ],
    details: [
      {
        title: "Shipping & delivery",
        body: "Options, costs and delivery estimates come from a live quote for your address and are shown at checkout before you pay. Every order gets tracking.",
      },
      {
        title: "Returns",
        body: "Contact us within 30 days of delivery if it isn't right for you and we'll make it right. Refunds go back to your original payment method.",
      },
      {
        title: "Care & reuse",
        body: "Empty the chamber into the bin, rinse the head under the tap and let it air dry. No sheets to peel, no batteries to charge, nothing to reorder.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Ready when you are",
    title: "Trade the fur for a clean couch.",
    body: "Everything you need for a whole-home reset, priced below buying the pieces apart.",
    cta: "Shop the kit",
    image: "/images/bedroom-linen.jpg",
    alt: "A cat curled up on white linen bedding in a sunlit bedroom",
  },

  pages: {
    shipping: {
      blurb: "Where we deliver, what it costs and how tracking reaches you.",
      title: "Shipping",
      body: [
        "We ship to addresses in the United States.",
        "Shipping options, costs and delivery estimates are shown at checkout before you pay. They come from a live quote for your address and cart.",
        "Orders are sent to our fulfilment partner shortly after payment is confirmed. You receive an e-mail with tracking as soon as the parcel ships.",
        "If tracking stalls or a delivery problem occurs, we follow up with the carrier and keep you informed.",
      ],
    },
    returns: {
      blurb: "Thirty days to change your mind, and how refunds land back on your card.",
      title: "Returns & refunds",
      body: [
        "Contact us within 30 days of delivery if something is wrong or the product isn't right for you.",
        "Refunds go back to your original payment method. Banks usually show them within 5-10 business days.",
        "Damaged or incorrect items are replaced or refunded at no cost to you.",
      ],
    },
    privacy: {
      blurb: "What we collect to fulfil an order, and what we never do with it.",
      title: "Privacy policy",
      body: [
        "We collect what we need to fulfil your order: your e-mail, shipping address and the items you buy.",
        "Payments are processed by Stripe; card details never reach our servers.",
        "We record how you found us (for example campaign parameters in links) to measure our marketing. We don't sell personal data.",
        "We only send marketing e-mails, such as a checkout reminder, if you opted in at checkout. Write to us to access or delete your data.",
      ],
    },
    terms: {
      blurb: "The short version of the agreement when you buy from us.",
      title: "Terms of sale",
      body: [
        "Prices are shown in US dollars and confirmed by our servers at checkout.",
        "Your order is accepted once payment is confirmed. If an item becomes unavailable after payment, we contact you and refund or replace it; we never substitute silently.",
        "These terms are governed by the laws of the United States and the state in which the merchant is registered.",
      ],
    },
    contact: {
      blurb: "A person reads every message, usually within one business day.",
      title: "Contact",
      body: [
        "Questions about an order, a return or a product? We usually reply within one business day.",
        "Include your order number (it starts with CC-) so we can help faster.",
      ],
    },
  },
} as const;

export type InfoPageKey = keyof typeof site.pages;
