// Core types for Forge CLI

export interface ForgeConfig {
  database: {
    type: 'postgres' | 'mysql' | 'sqlite';
    url: string;
  };
  generate: {
    outputDir: string;
    clean: boolean;
  };
  dev: {
    port: number;
    host: string;
    reload: boolean;
  };
  build: {
    release: boolean;
    target?: string;
  };
}

export interface ModelField {
  type: string;
  primary?: boolean;
  unique?: boolean;
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
  references?: {
    table: string;
    column: string;
  };
}

export interface ModelDefinition {
  name: string;
  fields: Record<string, ModelField>;
  relationships: Record<string, Relationship>;
}

export interface Relationship {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  model: string;
  foreignKey?: string;
  localKey?: string;
}

export interface RouteDefinition {
  method: string;
  path: string;
  params?: Record<string, string>;
  body?: string;
  response: string;
  handler: string; // Will be converted to Rust
}

export interface GenerationContext {
  models: ModelDefinition[];
  routes: RouteDefinition[];
  config: ForgeConfig;
}