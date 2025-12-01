import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/legacy/UserAuth";
import Dashboard from "./pages/legacy/UserDashboard";
import Locations from "./pages/Locations";
import Leaderboard from "./pages/legacy/UserLeaderboard";
import History from "./pages/legacy/UserHistory";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CompanyAuth from "./pages/CompanyAuth";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyPortal from "./pages/CompanyPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/company-auth" element={<CompanyAuth />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/company-register" element={<CompanyRegister />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/portal/:slug" element={<CompanyPortal />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
