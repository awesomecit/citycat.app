import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import { useAuthStore } from "./stores/authStore";
import { useDelegationStore } from "./stores/delegationStore";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import Settings from "./pages/Settings";
import Cats from "./pages/Cats";
import CatDetail from "./pages/CatDetail";
import AdoptionWizard from "./pages/AdoptionWizard";
import MyAdoptions from "./pages/MyAdoptions";
import AdopterProfile from "./pages/AdopterProfile";
import ExploreMap from "./pages/ExploreMap";
import CommunityFeed from "./pages/CommunityFeed";
import ShelterCampaigns from "./pages/ShelterCampaigns";
import ComingSoon from "./pages/ComingSoon";
import ShelterCatManagement from "./pages/ShelterCatManagement";
import VolunteerTasks from "./pages/VolunteerTasks";
import VolunteerCalendar from "./pages/VolunteerCalendar";
import RelayLegs from "./pages/RelayLegs";
import VolunteerProfile from "./pages/VolunteerProfile";
import ShelterProfile from "./pages/ShelterProfile";
import MunicipalityProfile from "./pages/MunicipalityProfile";
import TerritorialMap from "./pages/TerritorialMap";
import MunicipalityStats from "./pages/MunicipalityStats";
import MunicipalityReports from "./pages/MunicipalityReports";
import AdminUsers from "./pages/AdminUsers";
import AuditLog from "./pages/AuditLog";
import AdminBroadcast from "./pages/AdminBroadcast";
import FeatureFlags from "./pages/FeatureFlags";
import AdminFeedback from "./pages/AdminFeedback";
import EntityDelegation from "./pages/EntityDelegation";
import Roadmap from "./pages/Roadmap";
import NotFound from "./pages/NotFound";
import DemoBanner from "./components/DemoBanner";
import BetaFeedbackFab from "./components/BetaFeedbackFab";
import CatHealthRecord from "./pages/CatHealthRecord";
import MissingCats from "./pages/MissingCats";
import MatchingWizard from "./pages/MatchingWizard";
import PremiumWallet from "./pages/PremiumWallet";
import PremiumCalendar from "./pages/PremiumCalendar";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import PremiumShop from "./pages/PremiumShop";
import FosterApply from "./pages/FosterApply";
import PremiumServices from "./pages/PremiumServices";
import SearchAutomations from "./pages/SearchAutomations";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import TutorialEnte from "./pages/TutorialEnte";
import TutorialAdottante from "./pages/TutorialAdottante";
import TutorialVolontario from "./pages/TutorialVolontario";

const queryClient = new QueryClient();

const ProfileRouter = () => {
  const user = useAuthStore((s) => s.user);
  if (user?.activeRole === "volunteer") return <VolunteerProfile />;
  if (user?.activeRole === "shelter") return <ShelterProfile />;
  if (user?.activeRole === "municipality") return <MunicipalityProfile />;
  return <AdopterProfile />;
};

const CatsRouter = () => {
  const user = useAuthStore((s) => s.user);
  const affiliations = useDelegationStore((s) => s.affiliations);
  const hasEditCats = user && affiliations.some(
    (a) => a.userEmail === user.email && a.status === "accepted" && a.permissions.includes("edit_cats")
  );
  if (user?.activeRole === "shelter" || hasEditCats) return <ShelterCatManagement />;
  return <Cats />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/cats" element={<CatsRouter />} />
          <Route path="/cats/:id" element={<CatDetail />} />
          <Route path="/cats/:id/adopt" element={<AdoptionWizard />} />
          <Route path="/cats/:id/health" element={<CatHealthRecord />} />
          <Route path="/profile" element={<ProfileRouter />} />
          <Route path="/explore-map" element={<ExploreMap />} />
          <Route path="/adoptions" element={<MyAdoptions />} />
          <Route path="/campaigns" element={<ShelterCampaigns />} />
          <Route path="/tasks" element={<VolunteerTasks />} />
          <Route path="/calendar" element={<VolunteerCalendar />} />
          <Route path="/relays" element={<RelayLegs />} />
          <Route path="/management" element={<EntityDelegation />} />
          <Route path="/map" element={<TerritorialMap />} />
          <Route path="/statistics" element={<MunicipalityStats />} />
          <Route path="/reports" element={<MunicipalityReports />} />
          <Route path="/agenda" element={<ComingSoon />} />
          <Route path="/records" element={<ComingSoon />} />
          <Route path="/patients" element={<ComingSoon />} />
          <Route path="/sessions" element={<ComingSoon />} />
          <Route path="/followup" element={<ComingSoon />} />
          <Route path="/stays" element={<ComingSoon />} />
          <Route path="/payments" element={<ComingSoon />} />
          <Route path="/my-legs" element={<ComingSoon />} />
          <Route path="/history" element={<ComingSoon />} />
          <Route path="/fostered-cats" element={<ComingSoon />} />
          <Route path="/journal" element={<ComingSoon />} />
           <Route path="/matching" element={<MatchingWizard />} />
           <Route path="/automations" element={<SearchAutomations />} />
           <Route path="/wallet" element={<PremiumWallet />} />
           <Route path="/premium-calendar" element={<PremiumCalendar />} />
           <Route path="/loyalty" element={<LoyaltyProgram />} />
           <Route path="/premium-shop" element={<PremiumShop />} />
           <Route path="/foster-apply" element={<FosterApply />} />
           <Route path="/premium-services" element={<PremiumServices />} />
           <Route path="/cattery" element={<ComingSoon />} />
           <Route path="/kittens" element={<ComingSoon />} />
           <Route path="/transactions" element={<ComingSoon />} />
           <Route path="/shop" element={<ComingSoon />} />
           <Route path="/orders" element={<ComingSoon />} />
           <Route path="/earnings" element={<ComingSoon />} />
           <Route path="/users" element={<AdminUsers />} />
           <Route path="/moderation" element={<AuditLog />} />
           <Route path="/system" element={<AdminBroadcast />} />
           <Route path="/feedback" element={<AdminFeedback />} />
          <Route path="/wallet" element={<ComingSoon />} />
          <Route path="/community" element={<CommunityFeed />} />
          <Route path="/marketplace" element={<ComingSoon />} />
          <Route path="/marketplace-b2b" element={<ComingSoon />} />
          <Route path="/missing-cats" element={<MissingCats />} />
          <Route path="/foster-apply" element={<ComingSoon />} />
          <Route path="/shelters" element={<ComingSoon />} />
          <Route path="/volunteers" element={<ComingSoon />} />
          <Route path="/drives" element={<ComingSoon />} />
          <Route path="/fundraising" element={<ComingSoon />} />
          <Route path="/analytics" element={<ComingSoon />} />
          <Route path="/verification" element={<ComingSoon />} />
           <Route path="/feature-flags" element={<FeatureFlags />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/about" element={<About />} />
             <Route path="/pricing" element={<Pricing />} />
             <Route path="/tutorial/ente" element={<TutorialEnte />} />
             <Route path="/tutorial/adottante" element={<TutorialAdottante />} />
             <Route path="/tutorial/volontario" element={<TutorialVolontario />} />
           <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <BetaFeedbackFab />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoBanner />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
