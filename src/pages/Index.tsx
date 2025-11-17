import {useEffect, useState} from 'react';
import ServiceFlowCanvas from '@/components/ServiceFlowCanvas';
import JsonInput from '@/components/JsonInput';
import {Service} from '@/types/service';
import {exampleData} from '@/data/exampleData';
import {Info, Network} from 'lucide-react';
import {Card} from '@/components/ui/card';

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showInput, setShowInput] = useState(true);

  useEffect(() => {
    setServices(exampleData);
    setShowInput(false);
  }, []);

  const handleDataLoaded = (data: Service[]) => {
    setServices(data);
    setShowInput(false);
  };

  const handleLoadExample = () => {
    setServices(exampleData);
    setShowInput(false);
  };

  const handleReset = () => {
    setServices([]);
    setShowInput(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Network className="w-8 h-8 text-primary"/>
              <div>
                <h1 className="text-2xl font-bold">Microservice Architecture Visualizer</h1>
                <p className="text-sm text-muted-foreground">
                  Interactive service dependency graph
                </p>
              </div>
            </div>
            {services.length > 0 && (
              <button
                onClick={handleReset}
                className="text-sm text-primary hover:underline"
              >
                Load New Data
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {showInput ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-6 bg-card/50 border-primary/20">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"/>
                <div className="text-sm space-y-2">
                  <p className="font-semibold">How to use:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Paste your JSON service data or load the example</li>
                    <li>Nodes are color-coded: <span
                      className="text-[hsl(var(--node-frontend))]">Blue (Frontend)</span>, <span
                      className="text-[hsl(var(--node-backend))]">Green (Backend)</span>, <span
                      className="text-[hsl(var(--node-null))]">Gray (Other)</span></li>
                    <li>Drag nodes to rearrange, zoom and pan to explore</li>
                    <li>Connection labels show API methods and descriptions</li>
                  </ul>
                </div>
              </div>
            </Card>

            <JsonInput
              onDataLoaded={handleDataLoaded}
              onLoadExample={handleLoadExample}
            />
          </div>
        ) : (
          <div className="h-[calc(100vh-180px)] border border-border rounded-lg overflow-hidden bg-card">
            <ServiceFlowCanvas services={services}/>
          </div>
        )}
      </main>

      {/* Stats Footer */}
      {services.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="container mx-auto px-6 py-3">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">{services.length}</span> Services
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {services.filter(s => s.type === 'frontend').length}
                </span> Frontend
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {services.filter(s => s.type === 'backend').length}
                </span> Backend
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {services.reduce((acc, s) => acc + s.connetions.length, 0)}
                </span> Connections
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
