import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Cat, Heart, Shield, Calendar, Brain, Stethoscope } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useShelterCatStore } from "@/stores/shelterCatStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import BehavioralProfileForm, { emptyBehavioralProfile } from "@/components/BehavioralProfileForm";
import { getCatPhoto } from "@/lib/catPhotos";
import { isHeartAdoption } from "@/lib/heartAdoption";
import { useEffect } from "react";
import { mockCats } from "@/api/mockData";

const CatDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuthStore();
  const { cats: shelterCats } = useShelterCatStore();

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const cat = shelterCats.find((c) => c.id === id) || mockCats.find((c) => c.id === id);
  if (!isLoggedIn) return null;

  if (!cat) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 pb-16 text-center">
          <p className="text-muted-foreground">{t("cats.notFound")}</p>
          <button onClick={() => navigate("/cats")} className="mt-4 text-sm font-semibold text-primary">{t("cats.backToList")}</button>
        </div>
        <BottomNav />
      </PageTransition>
    );
  }

  const isOwned = cat.ownerId === "u1";
  const photo = getCatPhoto(cat.id);
  const genderLabel = cat.gender === "female" ? "♀" : "♂";
  const bp = cat.behavioralProfile;
  const ha = cat.heartAdoption;
  const isHeart = isHeartAdoption(cat);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={cat.name} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Photo */}
          <div className="flex justify-center relative">
            {photo ? (
              <img src={photo} alt={cat.name} className="h-48 w-48 rounded-3xl object-cover shadow-lg" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-3xl font-extrabold text-primary">
                {cat.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            {isHeart && (
              <span className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white text-sm shadow-lg">❤️</span>
            )}
          </div>

          {/* Heart Adoption Badge */}
          {isHeart && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-1 text-center">
              <span className="text-xs font-bold text-destructive">❤️ {t("heartAdoption.badge")}</span>
            </div>
          )}

          {/* Info card */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <Cat className="mx-auto mb-1 h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">{t("cats.breed")}</p>
                <p className="text-sm font-bold text-foreground">{cat.breed}</p>
              </div>
              <div>
                <Calendar className="mx-auto mb-1 h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">{t("cats.ageLabel")}</p>
                <p className="text-sm font-bold text-foreground">{t("cats.age", { count: cat.age })}</p>
              </div>
              <div>
                <span className="mx-auto mb-1 block text-center text-base text-primary">{genderLabel}</span>
                <p className="text-xs text-muted-foreground">{t("cats.gender")}</p>
                <p className="text-sm font-bold text-foreground">{t(`cats.${cat.gender}`)}</p>
              </div>
            </div>
          </section>

          {cat.description && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm leading-relaxed text-foreground">{cat.description}</p>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{t("cats.vaccinated")}</span>
              <span className={`ml-auto text-sm font-bold ${cat.vaccinated ? "text-primary" : "text-destructive"}`}>
                {cat.vaccinated ? t("cats.yes") : t("cats.no")}
              </span>
            </div>
          </section>

          {/* Health Record Link */}
          {(isOwned || cat.status === "sheltered" || cat.status === "adoption") && (
            <button
              onClick={() => navigate(`/cats/${cat.id}/health`)}
              className="flex w-full items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{t("health.title")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("health.viewRecord")}</p>
                </div>
              </div>
              <span className="text-primary text-lg">→</span>
            </button>
          )}

          {/* Heart Adoption Story */}
          {isHeart && ha && (
            <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" /> {t("heartAdoption.storyTitle")}
              </h3>
              {ha.narrative && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{t("heartAdoption.narrative")}</p>
                  <p className="text-sm leading-relaxed text-foreground italic">"{ha.narrative}"</p>
                </div>
              )}
              {ha.challenges && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{t("heartAdoption.challenges")}</p>
                  <p className="text-sm leading-relaxed text-foreground">{ha.challenges}</p>
                </div>
              )}
              {ha.lookingFor && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{t("heartAdoption.lookingFor")}</p>
                  <p className="text-sm leading-relaxed text-foreground">{ha.lookingFor}</p>
                </div>
              )}
              {ha.smallVictories && (
                <div className="rounded-xl bg-background/60 p-3">
                  <p className="text-xs font-semibold text-primary mb-1">🌟 {t("heartAdoption.smallVictories")}</p>
                  <p className="text-sm leading-relaxed text-foreground">{ha.smallVictories}</p>
                </div>
              )}
            </section>
          )}

          {/* Behavioral Profile */}
          {bp && (
            <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> {t("behavioral.title")}
              </h3>
              <BehavioralProfileForm profile={bp} readOnly />
            </section>
          )}

          {!isOwned && cat.status === "adoption" && (
            <button
              onClick={() => navigate(`/cats/${cat.id}/adopt`)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
            >
              <Heart className="h-4 w-4" />
              {t("cats.adoptButton")}
            </button>
          )}
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default CatDetail;
