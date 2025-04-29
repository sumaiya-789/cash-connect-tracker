
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Welcome from "./pages/Welcome";
import Landing from "./pages/Landing";
import ManualMode from "./pages/ManualMode";
import BankConnect from "./pages/BankConnect";
import BankSelection from "./pages/BankSelection";
import ConsentScreen from "./pages/ConsentScreen";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider delayDuration={300}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/manual-mode" element={<ManualMode />} />
            <Route path="/bank-connect" element={<BankConnect />} />
            <Route path="/bank-selection" element={<BankSelection />} />
            <Route path="/consent-screen" element={<ConsentScreen />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
