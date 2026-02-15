import type { Node, Edge } from 'reactflow';

export type NodeType = 'trigger' | 'condition' | 'action' | 'integration' | 'policy' | 'category_limits' | 'mcc_check' | 'velocity_limit' | 'geo_restriction' | 'time_restriction' | 'receipt_requirement' | 'budget_tracker' | 'notification' | 'logic_and' | 'logic_or' | 'logic_xor' | 'logic_not';

export type IntegrationService = 'slack' | 'sheets' | 'calendar' | 'email' | 'salesforce' | 'jira';

export type ConditionOperator = '>' | '<' | '=' | '>=' | '<=' | 'contains' | 'in';

export type ValueType = 'number' | 'string' | 'list' | 'currency';

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value: any;
  valueType: ValueType;
}

export interface CategoryLimit {
  name: string;
  limit: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  period: 'transaction' | 'day' | 'month' | 'year' | 'calendar_year';
}

export interface PolicyItem {
  name: string;
  category: string;
  metadata?: Record<string, any>;
}

export interface PolicyNodeData {
  label: string;
  description?: string;
  
  // Trigger data
  event?: string;
  frequency?: string;
  
  // Condition data
  conditions?: Condition[];
  logic?: 'AND' | 'OR';
  
  // Policy data
  policyType?: 'vendor_list' | 'spending_limit' | 'approval_required';
  items?: PolicyItem[];
  
  // Category limits data
  categories?: CategoryLimit[];
  
  // Integration data
  service?: IntegrationService;
  config?: {
    channel?: string;
    template?: string;
    recipient?: string;
    spreadsheet?: string;
    sheet?: string;
  };
  
  // Action data
  actionType?: 'approve' | 'reject' | 'request_approval' | 'notify';
  message?: string;
  
  // Common
  icon?: string;
  editable?: boolean;
  metadata?: Record<string, any>;
}

export interface PolicyNode extends Node<PolicyNodeData> {
  type: NodeType;
}

export interface PolicyEdge extends Edge {
  label?: string;
  animated?: boolean;
}

export interface PolicyWorkflow {
  nodes: PolicyNode[];
  edges: PolicyEdge[];
  metadata?: {
    name: string;
    version?: string;
    description?: string;
    policyType?: 'expense' | 'travel' | 'tuition' | 'general';
    createdAt?: string;
    updatedAt?: string;
  };
}

export type Theme = 'light' | 'dark';
