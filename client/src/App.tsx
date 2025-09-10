import { Router as WouterRouter, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsProvider } from "@/hooks/use-analytics";
import usePerformanceMonitoring from "@/hooks/use-performance";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <WouterRouter base="/">
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  // Initialize performance monitoring
  usePerformanceMonitoring();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnalyticsProvider>
          <Toaster />
          <AppRouter />
        </AnalyticsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
