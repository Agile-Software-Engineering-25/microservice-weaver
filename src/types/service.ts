export interface Connection {
  method: string;
  url: string;
  description: string;
  file: string;
  line: number;
  confidence: string;
  team: number;
  service_name: string;
}

export interface Service {
  team: number;
  type: "frontend" | "backend" | null | "infra";
  reposiory: string;
  connetions: Connection[];
  position?: { x: number; y: number };
}
