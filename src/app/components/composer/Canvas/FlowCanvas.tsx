import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';

import TriggerNode from '../Nodes/TriggerNode';
import ConditionNode from '../Nodes/ConditionNode';
import ActionNode from '../Nodes/ActionNode';
import IntegrationNode from '../Nodes/IntegrationNode';
import PolicyNode from '../Nodes/PolicyNode';
import CategoryLimitsNode from '../Nodes/CategoryLimitsNode';
import MCCCheckNode from '../Nodes/MCCCheckNode';
import VelocityLimitNode from '../Nodes/VelocityLimitNode';
import GeoRestrictionNode from '../Nodes/GeoRestrictionNode';
import TimeRestrictionNode from '../Nodes/TimeRestrictionNode';
import ReceiptRequirementNode from '../Nodes/ReceiptRequirementNode';
import BudgetTrackerNode from '../Nodes/BudgetTrackerNode';
import NotificationNode from '../Nodes/NotificationNode';
import LogicAndNode from '../Nodes/LogicAndNode';
import LogicOrNode from '../Nodes/LogicOrNode';
import LogicXorNode from '../Nodes/LogicXorNode';
import LogicNotNode from '../Nodes/LogicNotNode';
import CustomEdge from '../Edges/CustomEdge';
import SidePanel from '../UI/SidePanel';

import type { PolicyWorkflow, NodeType } from '../types/flow';

interface FlowCanvasProps {
  workflow: PolicyWorkflow;
}

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  integration: IntegrationNode,
  policy: PolicyNode,
  category_limits: CategoryLimitsNode,
  mcc_check: MCCCheckNode,
  velocity_limit: VelocityLimitNode,
  geo_restriction: GeoRestrictionNode,
  time_restriction: TimeRestrictionNode,
  receipt_requirement: ReceiptRequirementNode,
  budget_tracker: BudgetTrackerNode,
  notification: NotificationNode,
  logic_and: LogicAndNode,
  logic_or: LogicOrNode,
  logic_xor: LogicXorNode,
  logic_not: LogicNotNode,
};

const edgeTypes = {
  default: CustomEdge,
};

export default function FlowCanvas({ workflow }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges as Edge[]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  const handleAddNode = useCallback((type: NodeType, label: string) => {
    // Calculate a position that avoids overlapping with existing nodes AND edges
    const gridSize = 20;
    const baseX = 250;
    const baseY = 150;
    const spacing = 900; // MASSIVE horizontal spacing
    const verticalSpacing = 650; // MASSIVE vertical spacing
    
    // Find an empty spot
    let x = baseX;
    let y = baseY;
    let found = false;
    
    // Try to find a position that doesn't overlap
    for (let row = 0; row < 10 && !found; row++) {
      for (let col = 0; col < 10 && !found; col++) {
        x = baseX + col * spacing;
        y = baseY + row * verticalSpacing;
        
        // Check if any node is close to this position
        const hasOverlap = nodes.some(node => {
          const dx = Math.abs(node.position.x - x);
          const dy = Math.abs(node.position.y - y);
          return dx < 750 && dy < 550; // MASSIVE overlap detection area
        });
        
        if (!hasOverlap) {
          found = true;
        }
      }
    }
    
    // Snap to grid
    x = Math.round(x / gridSize) * gridSize;
    y = Math.round(y / gridSize) * gridSize;
    
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: { x, y },
      data: { 
        label: label || `New ${type}`,
        ...(type === 'integration' && { service: label.toLowerCase() as any }),
        ...(type === 'condition' && { conditions: [] }),
        ...(type === 'category_limits' && { categories: [] }),
        ...(type === 'policy' && { items: [] }),
        ...(type === 'mcc_check' && { metadata: { allowedMCCs: [] } }),
        ...(type === 'velocity_limit' && { metadata: { transactionLimit: 10, period: 'day' } }),
        ...(type === 'geo_restriction' && { metadata: { allowedCountries: [], restrictionType: 'allow' } }),
        ...(type === 'time_restriction' && { metadata: { startTime: '09:00', endTime: '17:00', allowedDays: ['Mon-Fri'] } }),
        ...(type === 'receipt_requirement' && { metadata: { threshold: 1000, alwaysRequired: false } }),
        ...(type === 'budget_tracker' && { metadata: { totalBudget: 100000, spent: 0, period: 'month' } }),
        ...(type === 'notification' && { metadata: { recipients: [], channels: ['email'] } }),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);
  
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);
  
  const handleNodesDelete = useCallback((nodesToDelete: Node[]) => {
    const nodeIds = nodesToDelete.map((node) => node.id);
    nodeIds.forEach(handleDeleteNode);
  }, [handleDeleteNode]);
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const data = event.dataTransfer.getData('application/reactflow');
    if (!data) return;
    
    const nodeTemplate = JSON.parse(data);
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    
    // Snap to grid
    const gridSize = 20;
    const snappedPosition = {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
    
    const newNode: Node = {
      id: `${Date.now()}`,
      type: nodeTemplate.type,
      position: snappedPosition,
      data: { 
        label: nodeTemplate.label || `New ${nodeTemplate.type}`,
        ...(nodeTemplate.type === 'integration' && { service: nodeTemplate.label.toLowerCase() as any }),
        ...(nodeTemplate.type === 'condition' && { conditions: [] }),
        ...(nodeTemplate.type === 'category_limits' && { categories: [] }),
        ...(nodeTemplate.type === 'policy' && { items: [] }),
        ...(nodeTemplate.type === 'mcc_check' && { metadata: { allowedMCCs: [] } }),
        ...(nodeTemplate.type === 'velocity_limit' && { metadata: { transactionLimit: 10, period: 'day' } }),
        ...(nodeTemplate.type === 'geo_restriction' && { metadata: { allowedCountries: [], restrictionType: 'allow' } }),
        ...(nodeTemplate.type === 'time_restriction' && { metadata: { startTime: '09:00', endTime: '17:00', allowedDays: ['Mon-Fri'] } }),
        ...(nodeTemplate.type === 'receipt_requirement' && { metadata: { threshold: 1000, alwaysRequired: false } }),
        ...(nodeTemplate.type === 'budget_tracker' && { metadata: { totalBudget: 100000, spent: 0, period: 'month' } }),
        ...(nodeTemplate.type === 'notification' && { metadata: { recipients: [], channels: ['email'] } }),
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [screenToFlowPosition, setNodes]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <SidePanel onAddNode={handleAddNode} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={handleNodesDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        proOptions={proOptions}
        minZoom={0.1}
        maxZoom={1.5}
        snapToGrid={true}
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
        }}
        nodeExtent={[[-1000, -1000], [10000, 10000]]}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          className="bg-[#F8F9FA] dark:bg-[#1E1E1E]"
        />
        <Controls
          className="!shadow-lg !border !border-gray-300 dark:!border-gray-700 !bg-white dark:!bg-[#2A2A2A]"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
