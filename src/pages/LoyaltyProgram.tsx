import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useLoyaltyStore } from "@/stores/loyaltyStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Star, Shield, Crown, Gift, Lock, CheckCircle, Ticket,
} from "lucide-react";

const LoyaltyProgram = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { points, level, title, badges, isVerifiedAdopter } = useLoyaltyStore();

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const nextLevel = (level + 1) * 500;
  const progress = Math.min(100, (points / nextLevel) * 100);
  const earnedBadges = badges.filter((b) => !b.locked);
  const lockedBadges = badges.filter((b) => b.locked);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("premium.loyaltyTitle")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Level card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 p-5 text-center space-y-3"
          >
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <Crown className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-xl font-extrabold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{t("premium.level")} {level}</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{points} pts</span>
                <span>{nextLevel} pts</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            {isVerifiedAdopter && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">{t("premium.verifiedAdopter")}</span>
              </div>
            )}
          </motion.div>

          {/* Perks */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Gift className="h-4 w-4 text-primary" /> {t("premium.perks")}
            </h3>
            {[
              { icon: <Ticket className="h-4 w-4" />, label: t("premium.perk_priority_events"), active: level >= 2 },
              { icon: <Star className="h-4 w-4" />, label: t("premium.perk_expert_qa"), active: level >= 3 },
              { icon: <Gift className="h-4 w-4" />, label: t("premium.perk_shop_discounts"), active: level >= 4 },
              { icon: <Trophy className="h-4 w-4" />, label: t("premium.perk_adoption_priority"), active: isVerifiedAdopter },
            ].map((perk, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl border p-3 ${perk.active ? "border-primary/20 bg-primary/5" : "border-border bg-card opacity-50"}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${perk.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {perk.icon}
                </div>
                <span className="text-xs font-bold text-foreground flex-1">{perk.label}</span>
                {perk.active ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </section>

          {/* Earned badges */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Trophy className="h-4 w-4 text-primary" /> {t("premium.earnedBadges")} ({earnedBadges.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {earnedBadges.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-4 text-center"
                >
                  <span className="text-2xl">{b.emoji}</span>
                  <p className="mt-1 text-xs font-bold text-foreground">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{b.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Locked badges */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-muted-foreground">{t("premium.lockedBadges")}</h3>
            <div className="grid grid-cols-2 gap-2">
              {lockedBadges.map((b) => (
                <div key={b.id} className="rounded-2xl border border-border bg-card p-4 text-center opacity-40">
                  <span className="text-2xl grayscale">{b.emoji}</span>
                  <p className="mt-1 text-xs font-bold text-foreground">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{b.description}</p>
                  <Lock className="mx-auto mt-1 h-3 w-3 text-muted-foreground" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default LoyaltyProgram;
