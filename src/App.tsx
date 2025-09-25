import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { usePrefsStore } from "@/store/prefsStore";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { profile } = usePrefsStore();
  
  useEffect(() => {
    // Apply profile to body on mount and when it changes
    document.body.setAttribute('data-profile', profile);
  }, [profile]);

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProfileProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<Demo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ProfileProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
