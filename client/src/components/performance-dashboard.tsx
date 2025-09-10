import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Eye, Clock } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
  threshold: { good: number; poor: number };
}

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);

  useEffect(() => {
    // Get network information
    if ('connection' in navigator) {
      setConnectionInfo((navigator as any).connection);
    }

    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const perfEntries = list.getEntries();
      
      perfEntries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          updateMetrics([
            {
              name: 'DOM Content Loaded',
              value: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              rating: getDCLRating(navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart),
              description: 'Time for DOM to be fully constructed',
              threshold: { good: 1500, poor: 2500 }
            },
            {
              name: 'Load Complete',
              value: navEntry.loadEventEnd - navEntry.loadEventStart,
              rating: getLoadRating(navEntry.loadEventEnd - navEntry.loadEventStart),
              description: 'Time for page to be fully loaded',
              threshold: { good: 2500, poor: 4000 }
            },
            {
              name: 'First Byte',
              value: navEntry.responseStart - navEntry.requestStart,
              rating: getTTFBRating(navEntry.responseStart - navEntry.requestStart),
              description: 'Time to receive first byte from server',
              threshold: { good: 200, poor: 500 }
            }
          ]);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

    // Memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      setMetrics(prev => [...prev, {
        name: 'Memory Usage',
        value: memoryUsage,
        rating: memoryUsage < 50 ? 'good' : memoryUsage < 80 ? 'needs-improvement' : 'poor',
        description: 'JavaScript heap memory usage',
        threshold: { good: 50, poor: 80 }
      }]);
    }

    return () => observer.disconnect();
  }, []);

  const updateMetrics = (newMetrics: PerformanceMetric[]) => {
    setMetrics(prev => {
      const updated = [...prev];
      newMetrics.forEach(newMetric => {
        const existingIndex = updated.findIndex(m => m.name === newMetric.name);
        if (existingIndex >= 0) {
          updated[existingIndex] = newMetric;
        } else {
          updated.push(newMetric);
        }
      });
      return updated;
    });
  };

  const getDCLRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= 1500) return 'good';
    if (value <= 2500) return 'needs-improvement';
    return 'poor';
  };

  const getLoadRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  };

  const getTTFBRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= 200) return 'good';
    if (value <= 500) return 'needs-improvement';
    return 'poor';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingText = (rating: string) => {
    switch (rating) {
      case 'good': return 'Bom';
      case 'needs-improvement': return 'Precisa Melhorar';
      case 'poor': return 'Ruim';
      default: return 'Desconhecido';
    }
  };

  const formatValue = (metric: PerformanceMetric) => {
    if (metric.name === 'Memory Usage') {
      return `${metric.value.toFixed(1)}%`;
    }
    return `${metric.value.toFixed(0)}ms`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Network Information */}
        {connectionInfo && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Informações de Rede
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <div className="font-medium">{connectionInfo.effectiveType || 'Desconhecido'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Downlink:</span>
                <div className="font-medium">{connectionInfo.downlink || 'N/A'} Mbps</div>
              </div>
              <div>
                <span className="text-muted-foreground">RTT:</span>
                <div className="font-medium">{connectionInfo.rtt || 'N/A'}ms</div>
              </div>
              <div>
                <span className="text-muted-foreground">Economizar dados:</span>
                <div className="font-medium">{connectionInfo.saveData ? 'Sim' : 'Não'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Métricas de Performance
          </h3>
          
          {metrics.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Coletando métricas de performance...
            </div>
          ) : (
            <div className="grid gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <Badge className={getRatingColor(metric.rating)}>
                      {getRatingText(metric.rating)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">
                      {formatValue(metric)}
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={Math.min((metric.value / metric.threshold.poor) * 100, 100)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span className="text-green-600">{metric.threshold.good}</span>
                        <span className="text-red-600">{metric.threshold.poor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            💡 Dicas de Performance
          </h3>
          <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
            <li>• Imagens otimizadas com WebP quando possível</li>
            <li>• Carregamento lazy de imagens implementado</li>
            <li>• Cache agressivo de recursos estáticos</li>
            <li>• Fontes otimizadas com font-display: swap</li>
            <li>• CSS crítico inline para above-the-fold</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceDashboard;