export type IntentAction = 'swap' | 'lend' | 'borrow' | 'stake' | 'bridge' | 'transfer' | 'yield';

export type IntentStatus = 'draft' | 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';

export type ConditionType = 'price_above' | 'price_below' | 'time_after' | 'time_before' | 'balance_above' | 'balance_below';

export interface Condition {
  type: ConditionType;
  asset?: string;
  value: string | number;
  comparator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
}

export interface Operation {
  type: 'swap' | 'transfer' | 'contract_call';
  protocol?: string;
  from_asset?: string;
  to_asset?: string;
  amount?: string;
  destination?: string;
  contract_id?: string;
  function_name?: string;
  params?: any[];
}

export interface RouteStep {
  dex: string;
  from_asset: string;
  to_asset: string;
  amount_in: string;
  amount_out: string;
  price_impact: number;
}

export interface ParsedIntent {
  intent_id: string;
  user_address: string;
  raw_text: string;
  parsed_intent: {
    action: IntentAction;
    conditions?: Condition[];
    operations: Operation[];
    route?: RouteStep[];
  };
  status: IntentStatus;
  estimated_gas?: string;
  expected_output?: string;
  slippage_tolerance?: number;
  created_at: string;
  updated_at?: string;
  executed_at?: string;
  transaction_hash?: string;
  error_message?: string;
}

export interface IntentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'swaps' | 'dca' | 'yield' | 'leverage' | 'cross-chain';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  template_text: string;
  parameters: TemplateParameter[];
  icon?: string;
  featured?: boolean;
}

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'asset' | 'address';
  required: boolean;
  default?: any;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface IntentExecutionStep {
  step_number: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: string;
  transaction_hash?: string;
  error?: string;
}
