import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload, FileJson } from 'lucide-react';
import { Service } from '@/types/service';
import { toast } from 'sonner';

interface JsonInputProps {
  onDataLoaded: (services: Service[]) => void;
  onLoadExample: () => void;
}

const JsonInput = ({ onDataLoaded, onLoadExample }: JsonInputProps) => {
  const [jsonText, setJsonText] = useState('');

  const handleParse = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        onDataLoaded(parsed);
        toast.success('JSON data loaded successfully!');
      } else {
        toast.error('JSON must be an array of services');
      }
    } catch (error) {
      toast.error('Invalid JSON format. Please check your input.');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Load Service Data</h2>
        </div>
        <Button onClick={onLoadExample} variant="outline" size="sm">
          Load Example
        </Button>
      </div>
      
      <Textarea
        placeholder="Paste your JSON data here..."
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        className="font-mono text-xs min-h-[200px]"
      />
      
      <Button onClick={handleParse} className="w-full" disabled={!jsonText.trim()}>
        <Upload className="w-4 h-4 mr-2" />
        Parse and Visualize
      </Button>
    </Card>
  );
};

export default JsonInput;
