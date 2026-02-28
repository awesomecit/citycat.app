import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, MessageSquare, Megaphone, ThumbsUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getCatPhoto } from "@/lib/catPhotos";

type PostCategory = "story" | "guide" | "post" | "update";

interface CommunityPost {
  id: string;
  category: PostCategory;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  createdAt: string;
  likes: number;
  comments: number;
  image?: string;
}

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "p1",
    category: "story",
    title: "La storia di Whiskers: da randagio a re del divano",
    body: "Tre mesi fa abbiamo adottato Whiskers dal Rifugio Felino Roma. All'inizio era timido e si nascondeva sotto il letto, ma oggi è il padrone di casa! Dorme sul divano, ci segue ovunque e fa le fusa appena ci vede. L'adozione è stata la scelta migliore che abbiamo fatto.",
    author: "Mario Rossi",
    authorRole: "adopter",
    createdAt: "2026-02-20T10:00:00Z",
    likes: 42,
    comments: 8,
    image: "Whiskers",
  },
  {
    id: "p2",
    category: "guide",
    title: "Come preparare casa per il nuovo gatto",
    body: "Guida pratica: 1) Prepara una stanza sicura con cibo, acqua e lettiera. 2) Rimuovi piante tossiche. 3) Acquista tiragraffi e giochi. 4) Dai tempo al gatto di ambientarsi senza forzare il contatto. La pazienza è fondamentale nei primi giorni!",
    author: "Dr. Marco Verdi",
    authorRole: "veterinarian",
    createdAt: "2026-02-18T14:00:00Z",
    likes: 67,
    comments: 15,
  },
  {
    id: "p3",
    category: "update",
    title: "Nuovi arrivi al rifugio: 3 gattini cercano casa!",
    body: "Sono arrivati Romeo, Giulietta e Mercuzio — tre fratellini europei di 4 mesi. Sono già vaccinati e sterilizzati. Vengono affidati anche separatamente. Venite a conoscerli!",
    author: "Rifugio Felino Roma",
    authorRole: "shelter",
    createdAt: "2026-02-22T09:00:00Z",
    likes: 31,
    comments: 5,
    image: "Romeo",
  },
  {
    id: "p4",
    category: "post",
    title: "Il primo giorno con Nala 🥰",
    body: "Oggi Nala è arrivata a casa! Si è subito nascosta dietro il divano ma dopo un'ora è uscita a esplorare. Ha trovato il tiragraffi e sembra già innamorata. Non vedo l'ora dei prossimi giorni insieme!",
    author: "Luna Bianchi",
    authorRole: "adopter",
    createdAt: "2026-02-21T18:30:00Z",
    likes: 28,
    comments: 12,
    image: "Nala",
  },
  {
    id: "p5",
    category: "guide",
    title: "Capire il linguaggio del corpo del gatto",
    body: "Coda dritta = saluto amichevole. Orecchie piatte = paura o aggressività. Pancia esposta = fiducia (ma non è sempre un invito a toccarla!). Occhi semichiusi = rilassamento. Imparate a leggere i segnali per una convivenza migliore.",
    author: "Dr.ssa Sara Neri",
    authorRole: "behaviorist",
    createdAt: "2026-02-17T11:00:00Z",
    likes: 89,
    comments: 22,
  },
  {
    id: "p6",
    category: "update",
    title: "Campagna sterilizzazione gratuita — Marzo 2026",
    body: "Il Comune di Roma in collaborazione con il Rifugio Felino Roma offre sterilizzazioni gratuite per gatti di colonia durante tutto marzo. Prenotazioni aperte dal 25 febbraio.",
    author: "Comune di Roma",
    authorRole: "municipality",
    createdAt: "2026-02-23T08:00:00Z",
    likes: 55,
    comments: 3,
  },
];

const CAT_CONFIG: Record<PostCategory, { icon: typeof Heart; color: string; labelKey: string }> = {
  story: { icon: Heart, color: "340 60% 50%", labelKey: "community.story" },
  guide: { icon: BookOpen, color: "220 70% 55%", labelKey: "community.guide" },
  post: { icon: MessageSquare, color: "142 60% 45%", labelKey: "community.post" },
  update: { icon: Megaphone, color: "25 85% 55%", labelKey: "community.update" },
};

const CommunityFeed = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const [filter, setFilter] = useState<PostCategory | "all">("all");

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const filtered = filter === "all" ? MOCK_POSTS : MOCK_POSTS.filter((p) => p.category === filter);

  const categories: (PostCategory | "all")[] = ["all", "story", "guide", "post", "update"];

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("community.title")} />
        <main className="flex-1 p-4 pt-16 space-y-4 max-w-lg mx-auto">
          {/* Filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide pt-4">
            {categories.map((cat) => {
              const active = cat === filter;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat === "all" ? t("filters.all") : t(CAT_CONFIG[cat].labelKey)}
                </button>
              );
            })}
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {filtered.map((post) => {
              const config = CAT_CONFIG[post.category];
              const Icon = config.icon;
              return (
                <Card key={post.id} className="overflow-hidden">
                  {post.image && (
                    <img
                      src={getCatPhoto(post.image)}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className="text-[10px] gap-0.5"
                        style={{
                          backgroundColor: `hsl(${config.color} / 0.12)`,
                          color: `hsl(${config.color})`,
                        }}
                      >
                        <Icon className="h-2.5 w-2.5" />
                        {t(config.labelKey)}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("it", { day: "2-digit", month: "short" })}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground mb-1">{post.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{post.body}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-foreground">{post.author}</span>
                        <span className="text-[10px] text-muted-foreground">· {t(`roles.${post.authorRole}`)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <button className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                          <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default CommunityFeed;
