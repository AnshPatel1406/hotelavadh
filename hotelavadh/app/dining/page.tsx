"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Leaf, Wheat } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DinnerImages = [
  "/dining_images/1.jpg",
  "/dining_images/2.jpg",
  "/dining_images/3.jpg",
  "/dining_images/4.jpg",
  "/dining_images/5.jpg",
];

type MenuItem = { name: string; desc?: string; jain?: boolean; vegan?: boolean };
type MenuSection = { section: string; items: MenuItem[] };
type MenuTab = { id: string; label: string; sections: MenuSection[] };

const menu: MenuTab[] = [
  {
    id: "starters",
    label: "Starters",
    sections: [
      {
        section: "Veg Starters",
        items: [
          { name: "Paneer Tikka", desc: "Cottage cheese marinated in spiced yogurt, chargrilled in tandoor", jain: true },
          { name: "Hara Bhara Kabab", desc: "Crispy spinach & pea patties with mint chutney", jain: true },
          { name: "Dahi Ke Sholey", desc: "Crispy pastry pockets filled with hung curd & spices", jain: true },
          { name: "Veg Seekh Kabab", desc: "Mixed vegetable mince on skewers, tandoor roasted" },
          { name: "Crispy Corn", desc: "Golden fried sweet corn tossed with herbs & spices", jain: true },
          { name: "Stuffed Mushroom", desc: "Button mushrooms filled with spiced cheese & herbs" },
          { name: "Aloo Tikki", desc: "Pan-fried potato patties with tamarind & mint chutney", jain: true },
          { name: "Spring Rolls", desc: "Crispy rolls filled with seasoned vegetables" },
        ],
      },
      {
        section: "Soups",
        items: [
          { name: "Tomato Shorba", desc: "Classic spiced tomato broth with fresh cream", jain: true },
          { name: "Sweet Corn Soup", desc: "Creamy corn soup with mild spices" },
          { name: "Mixed Vegetable Soup", desc: "Clear broth with seasonal vegetables", jain: true },
          { name: "Manchow Soup", desc: "Indo-Chinese style thick spiced soup with crispy noodles" },
        ],
      },
    ],
  },
  {
    id: "mains",
    label: "Main Course",
    sections: [
      {
        section: "Dal & Lentils",
        items: [
          { name: "Dal Makhani", desc: "Slow-cooked black lentils with butter & cream" },
          { name: "Dal Tadka", desc: "Yellow lentils tempered with cumin, garlic & dried chilli", jain: true },
          { name: "Panchmel Dal", desc: "Five-lentil mix slow-cooked Rajasthani style", jain: true },
          { name: "Dal Baati", desc: "Rajasthani baked wheat balls with lentil curry", jain: true },
        ],
      },
      {
        section: "Paneer Specials",
        items: [
          { name: "Paneer Butter Masala", desc: "Cottage cheese in rich tomato-cashew gravy", jain: true },
          { name: "Shahi Paneer", desc: "Paneer in a royal cream & nut-based gravy", jain: true },
          { name: "Kadai Paneer", desc: "Stir-fried paneer with capsicum in rustic masala" },
          { name: "Paneer Lababdar", desc: "Silky onion-tomato gravy with fenugreek" },
          { name: "Palak Paneer", desc: "Cottage cheese in smooth spiced spinach gravy" },
          { name: "Paneer Do Pyaza", desc: "Double-onion paneer with whole spices" },
        ],
      },
      {
        section: "Vegetable Curries",
        items: [
          { name: "Mix Veg Curry", desc: "Seasonal vegetables in a home-style masala gravy", jain: true },
          { name: "Aloo Matar", desc: "Potato & peas in tangy tomato-based gravy", jain: true },
          { name: "Navratan Korma", desc: "Nine vegetables & nuts in a mild, creamy sauce", jain: true },
          { name: "Baingan Bharta", desc: "Flame-roasted aubergine with tomatoes & spices" },
          { name: "Bharwa Shimla Mirch", desc: "Stuffed bell peppers in a tangy onion gravy" },
          { name: "Methi Malai Matar", desc: "Fenugreek & peas in a velvety cream sauce", jain: true },
        ],
      },
      {
        section: "Rice & Biryani",
        items: [
          { name: "Veg Biryani", desc: "Basmati rice slow-cooked with vegetables & whole spices", jain: true },
          { name: "Jeera Rice", desc: "Steamed basmati tempered with cumin", jain: true },
          { name: "Peas Pulao", desc: "Fragrant rice tossed with green peas & mint", jain: true },
          { name: "Curd Rice", desc: "Cooling South-Indian style yogurt rice" },
        ],
      },
    ],
  },
  {
    id: "breads",
    label: "Breads",
    sections: [
      {
        section: "Tandoor Breads",
        items: [
          { name: "Butter Naan", desc: "Soft leavened bread brushed with butter", jain: true },
          { name: "Garlic Naan", desc: "Naan topped with roasted garlic & coriander" },
          { name: "Stuffed Paratha", desc: "Whole-wheat flatbread with spiced potato filling", jain: true },
          { name: "Missi Roti", desc: "Gram-flour flatbread with ajwain", jain: true },
          { name: "Tandoori Roti", desc: "Whole-wheat bread baked in clay oven", jain: true },
          { name: "Laccha Paratha", desc: "Flaky layered flatbread", jain: true },
          { name: "Puri", desc: "Deep-fried puffed whole-wheat bread", jain: true },
        ],
      },
    ],
  },
  {
    id: "jain",
    label: "Jain Menu",
    sections: [
      {
        section: "Jain Starters",
        items: [
          { name: "Jain Paneer Tikka", desc: "Marinated paneer without onion & garlic, tandoor grilled", jain: true },
          { name: "Jain Hara Bhara Kabab", desc: "Spinach-pea patties prepared without root vegetables", jain: true },
          { name: "Jain Crispy Corn", desc: "Fried corn tossed with Jain-compliant spice mix", jain: true },
        ],
      },
      {
        section: "Jain Main Course",
        items: [
          { name: "Jain Dal Tadka", desc: "Lentils tempered without onion & garlic", jain: true },
          { name: "Jain Paneer Butter Masala", desc: "Tomato-cashew gravy, no onion no garlic", jain: true },
          { name: "Jain Mix Veg", desc: "Seasonal vegetables in a Jain-style dry masala", jain: true },
          { name: "Jain Shahi Paneer", desc: "Royal nut & cream gravy, strictly Jain", jain: true },
          { name: "Jain Navratan Korma", desc: "Nine-vegetable korma prepared Jain style", jain: true },
          { name: "Jain Veg Biryani", desc: "Aromatic rice without onion, garlic or root veg", jain: true },
        ],
      },
      {
        section: "Jain Breads",
        items: [
          { name: "Jain Butter Naan", desc: "Soft naan made without yogurt fermentation agents that conflict with Jain principles", jain: true },
          { name: "Jain Missi Roti", desc: "Gram-flour roti without any prohibited ingredients", jain: true },
          { name: "Jain Laccha Paratha", desc: "Layered flatbread, Jain compliant", jain: true },
        ],
      },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    sections: [
      {
        section: "Indian Sweets",
        items: [
          { name: "Gulab Jamun", desc: "Soft milk-solid dumplings in rose-cardamom syrup", jain: true },
          { name: "Rasgulla", desc: "Spongy cottage-cheese balls in light sugar syrup", jain: true },
          { name: "Rasmalai", desc: "Soft patties soaked in saffron-infused milk", jain: true },
          { name: "Gajar Halwa", desc: "Slow-cooked carrot pudding with ghee & nuts", jain: true },
          { name: "Moong Dal Halwa", desc: "Rich slow-cooked lentil dessert with cardamom", jain: true },
          { name: "Malpua", desc: "Mini pancakes fried in ghee, dipped in sugar syrup" },
        ],
      },
      {
        section: "Ice Creams & Kulfi",
        items: [
          { name: "Matka Kulfi", desc: "Traditional slow-frozen milk kulfi in earthen pot", jain: true },
          { name: "Mango Kulfi", desc: "Alphonso mango kulfi on a stick", jain: true },
          { name: "Seasonal Ice Cream", desc: "Rotating flavours — ask your server", jain: true },
          { name: "Falooda", desc: "Rose milk with basil seeds, vermicelli & ice cream" },
        ],
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    sections: [
      {
        section: "Indian Classics",
        items: [
          { name: "Masala Chaas", desc: "Spiced buttermilk with cumin & coriander", jain: true },
          { name: "Sweet Lassi", desc: "Chilled yogurt drink blended with sugar & cardamom", jain: true },
          { name: "Mango Lassi", desc: "Thick Alphonso mango & yogurt blend", jain: true },
          { name: "Rose Sharbat", desc: "Chilled rose syrup with cold milk & basil seeds", jain: true },
          { name: "Jaljeera", desc: "Tangy cumin-spiced cooler with tamarind & mint", jain: true },
          { name: "Thandai", desc: "Chilled milk with nuts, saffron & aromatic spices", jain: true },
        ],
      },
      {
        section: "Fresh Juices & Shakes",
        items: [
          { name: "Sugarcane Juice", desc: "Fresh-pressed with ginger & lemon", jain: true },
          { name: "Watermelon Juice", desc: "Chilled & lightly spiced", jain: true },
          { name: "Strawberry Milkshake", desc: "Thick shake with fresh strawberries & milk", jain: true },
          { name: "Chocolate Milkshake", desc: "Rich dark-chocolate blended with cold milk", jain: true },
          { name: "Mixed Fruit Juice", desc: "Seasonal blend of fresh fruits", jain: true },
        ],
      },
      {
        section: "Hot Beverages",
        items: [
          { name: "Masala Chai", desc: "Classic spiced Indian tea with ginger, cardamom & milk" },
          { name: "Filter Coffee", desc: "South-Indian style strong decoction with frothed milk" },
          { name: "Saffron Milk", desc: "Warm milk infused with saffron & pistachio", jain: true },
          { name: "Turmeric Latte", desc: "Golden milk with turmeric, black pepper & honey", jain: true },
        ],
      },
    ],
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function DiningPage() {
  const [activeTab, setActiveTab] = useState("starters");
  const activeMenu = menu.find((m) => m.id === activeTab)!;

  return (
    <div className="space-y-16">

      {/* ── HERO ── */}
      <div className="space-y-5 pt-2">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-xs tracking-[0.18em] uppercase font-medium border-orange-300 text-orange-700 bg-orange-50"
        >
          Restaurant & Dining
        </Badge>

        <h1
          className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Flavours Rooted in
          <br />
          <span className="italic text-muted-foreground">Tradition</span>
        </h1>

        <p className="text-muted-foreground max-w-xl leading-relaxed text-base md:text-lg">
          Pure vegetarian fare crafted with care — from hearty North Indian classics
          to delicate Jain preparations, served in a warm and welcoming setting.
        </p>

        {/* Timings strip */}
        <div className="inline-flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-border/60 bg-muted/30 px-5 py-3 text-sm">
          <span className="font-medium">Lunch</span>
          <span className="text-muted-foreground">11:00 AM – 3:30 PM</span>
          <span className="w-px h-4 bg-border hidden sm:block" />
          <span className="font-medium">Dinner</span>
          <span className="text-muted-foreground">7:00 PM – 11:00 PM</span>
          <span className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex gap-2 ml-auto">
            <Button asChild variant="outline" size="sm" className="rounded-full h-7 px-4 text-xs">
              <a href="tel:+919428504802">Call</a>
            </Button>
            <Button asChild size="sm" className="rounded-full h-7 px-4 text-xs bg-green-600 hover:bg-green-700 text-white border-0">
              <a href="https://wa.me/919428504802" target="_blank" rel="noreferrer">WhatsApp</a>
            </Button>
          </div>
        </div>
      </div>

      {/* ── HIGHLIGHTS ── */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { emoji: "🌿", title: "Pure Vegetarian", sub: "100% veg kitchen, no eggs" },
          { emoji: "🙏", title: "Jain Options", sub: "Available on request" },
          { emoji: "☀️", title: "Daily Specials", sub: "Fresh seasonal dishes every day" },
        ].map((h) => (
          <div key={h.title} className="flex items-start gap-4 rounded-2xl border border-border/50 bg-muted/20 p-5">
            <span className="text-2xl">{h.emoji}</span>
            <div>
              <div className="font-medium text-sm">{h.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{h.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MENU ── */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <h2
            className="text-2xl md:text-3xl font-light tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Our Menu
          </h2>
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Leaf className="h-3 w-3 text-green-600" /> Jain available
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {menu.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "rounded-full px-4 py-1.5 text-xs font-medium transition border",
                activeTab === tab.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Menu content */}
        <div className="space-y-8">
          {activeMenu.sections.map((section) => (
            <div key={section.section}>
              {/* section heading */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-sm font-medium tracking-wide"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {section.section}
                </span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start justify-between gap-3 rounded-xl px-4 py-3 border border-border/40 bg-background hover:bg-muted/20 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.jain && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] text-green-700 font-medium">
                            <Leaf className="h-2.5 w-2.5" /> Jain
                          </span>
                        )}
                      </div>
                      {item.desc && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>
                    {/* green dot = veg */}
                    <span className="mt-0.5 shrink-0 h-3 w-3 rounded-sm border-2 border-green-600 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div className="space-y-5">
        <h2
          className="text-2xl md:text-3xl font-light tracking-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Gallery
        </h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {DinnerImages.map((img, i) => (
            <div
              key={i}
              className={[
                "relative overflow-hidden rounded-2xl bg-muted",
                i === 0 ? "h-48 md:h-56" : "h-32 md:h-40",
              ].join(" ")}
            >
              <Image
                src={img}
                alt={`Dining ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="rounded-3xl bg-foreground text-background px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-background/50 mb-2">
            Dine with us
          </p>
          <h3
            className="text-2xl md:text-3xl font-light leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            A table for every
            <br />
            <span className="italic">occasion.</span>
          </h3>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" className="shrink-0 rounded-full bg-background text-foreground hover:bg-background/90 px-6">
            <a href="tel:+919428504802">Call to Reserve</a>
          </Button>
          <Button asChild size="lg" className="shrink-0 rounded-full bg-background text-foreground hover:bg-background/90 px-6">
            <a href="https://wa.me/919428504802" target="_blank" rel="noreferrer">WhatsApp Us →</a>
          </Button>
        </div>
      </div>

    </div>
  );
}