import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, Tag, Star, Heart, Crown, Filter,
} from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  artisan: string;
  price: number;
  discountedPrice?: number;
  emoji: string;
  category: "accessories" | "food" | "toys" | "clothing";
  rating: number;
  premiumOnly: boolean;
}

const MOCK_ITEMS: ShopItem[] = [
  { id: "si1", name: "Cuccia artigianale in lana", artisan: "FeliCraft Roma", price: 65, discountedPrice: 52, emoji: "🛏️", category: "accessories", rating: 4.8, premiumOnly: true },
  { id: "si2", name: "Tiragraffi in legno massello", artisan: "CatWood Lab", price: 120, discountedPrice: 96, emoji: "🪵", category: "accessories", rating: 4.9, premiumOnly: true },
  { id: "si3", name: "Biscotti naturali bio", artisan: "Biscotti Felini", price: 12, emoji: "🍪", category: "food", rating: 4.5, premiumOnly: false },
  { id: "si4", name: "Topolino in feltro handmade", artisan: "MiaoCraft", price: 8, discountedPrice: 6, emoji: "🐭", category: "toys", rating: 4.7, premiumOnly: true },
  { id: "si5", name: "Bandana personalizzata", artisan: "PetStyle Italia", price: 15, discountedPrice: 12, emoji: "🧣", category: "clothing", rating: 4.6, premiumOnly: true },
  { id: "si6", name: "Cibo umido premium x6", artisan: "NaturaCat", price: 24, emoji: "🥫", category: "food", rating: 4.4, premiumOnly: false },
  { id: "si7", name: "Fontanella in ceramica", artisan: "AquaCat Design", price: 45, discountedPrice: 36, emoji: "💧", category: "accessories", rating: 4.9, premiumOnly: true },
  { id: "si8", name: "Tunnel gioco pieghevole", artisan: "PlayCat Studio", price: 22, emoji: "🎪", category: "toys", rating: 4.3, premiumOnly: false },
];

const PremiumShop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const categories = ["all", "accessories", "food", "toys", "clothing"];
  const filtered = category === "all" ? MOCK_ITEMS : MOCK_ITEMS.filter((i) => i.category === category);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("premium.shopTitle")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Premium banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-r from-primary/15 to-accent/10 border border-primary/20 p-4 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">{t("premium.shopPremiumBanner")}</p>
              <p className="text-[10px] text-muted-foreground">{t("premium.shopPremiumDesc")}</p>
            </div>
            <Tag className="h-5 w-5 text-primary" />
          </motion.div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {t(`premium.shopCat_${c}`)}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <div className="flex h-24 items-center justify-center bg-secondary/50 text-4xl">
                  {item.emoji}
                </div>
                <div className="p-3 space-y-1.5">
                  <p className="text-xs font-bold text-foreground leading-tight">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.artisan}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-accent" fill="currentColor" />
                    <span className="text-[10px] font-bold text-foreground">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.discountedPrice ? (
                      <>
                        <span className="text-xs font-extrabold text-primary">€{item.discountedPrice}</span>
                        <span className="text-[10px] text-muted-foreground line-through">€{item.price}</span>
                        <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                          -{Math.round(((item.price - item.discountedPrice) / item.price) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-extrabold text-foreground">€{item.price}</span>
                    )}
                  </div>
                  {item.premiumOnly && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5">
                      <Crown className="h-2.5 w-2.5 text-primary" />
                      <span className="text-[9px] font-bold text-primary">Premium</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default PremiumShop;
