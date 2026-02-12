'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { CreditCard, Type, Circle, Square, Trash2, Move } from 'lucide-react';

interface Element {
  id: number;
  type: 'text' | 'cardNumber' | 'circle' | 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color: string;
  fontSize: number;
  backgroundColor: string;
  opacity: number;
}

interface DraggedElement {
  id: number;
  offsetX: number;
  offsetY: number;
}

interface ComponentType {
  type: 'text' | 'cardNumber' | 'circle' | 'rectangle';
  icon: any;
  label: string;
  defaultValue?: string;
}

export default function CreditCardDesigner() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [draggedElement, setDraggedElement] = useState<DraggedElement | null>(null);
  const [cardColor, setCardColor] = useState<string>('#1a1a2e');
  const canvasRef = useRef<HTMLDivElement>(null);

  const cardWidth = 400;
  const cardHeight = 250;

  // Available components to add
  const components: ComponentType[] = [
    { type: 'text', icon: Type, label: 'Text', defaultValue: 'Double click to edit' },
    { type: 'cardNumber', icon: CreditCard, label: 'Card Number', defaultValue: '•••• •••• •••• 1234' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
  ];

  // Gradient presets
  const gradients = [
    { name: 'Purple Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
    { name: 'Gold', value: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
    { name: 'Dark', value: '#1a1a2e' },
  ];

  const addElement = (type: Element['type'], defaultValue = '') => {
    const newElement: Element = {
      id: Date.now(),
      type,
      x: 50,
      y: 50,
      width: type === 'text' || type === 'cardNumber' ? 200 : 80,
      height: type === 'text' || type === 'cardNumber' ? 30 : 80,
      content: defaultValue,
      color: type === 'text' || type === 'cardNumber' ? '#ffffff' : '#ffffff',
      fontSize: type === 'cardNumber' ? 20 : 16,
      backgroundColor: type === 'circle' || type === 'rectangle' ? '#ffffff' : 'transparent',
      opacity: type === 'circle' || type === 'rectangle' ? 0.2 : 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, elementId: number) => {
    if ((e.target as HTMLElement).classList.contains('editable-text')) return;

    const canvas = canvasRef.current?.getBoundingClientRect();
    if (!canvas) return;

    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setSelectedElement(elementId);
    setDraggedElement({
      id: elementId,
      offsetX: e.clientX - canvas.left - element.x,
      offsetY: e.clientY - canvas.top - element.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggedElement || !canvasRef.current) return;

    const canvas = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(cardWidth - 50, e.clientX - canvas.left - draggedElement.offsetX));
    const newY = Math.max(0, Math.min(cardHeight - 50, e.clientY - canvas.top - draggedElement.offsetY));

    setElements(elements.map(el =>
      el.id === draggedElement.id ? { ...el, x: newX, y: newY } : el
    ));
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const updateElement = (id: number, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: number) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const handleTextDoubleClick = (e: MouseEvent<HTMLDivElement>, elementId: number) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const newContent = prompt('Edit text:', element.content);
    if (newContent !== null) {
      updateElement(elementId, { content: newContent });
    }
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Credit Card Designer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Components */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Components</h2>
              <div className="space-y-2">
                {components.map(comp => {
                  const IconComponent = comp.icon;
                  return (
                    <button
                      key={comp.type}
                      onClick={() => addElement(comp.type, comp.defaultValue || '')}
                      className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{comp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Card Background</h2>
              <div className="grid grid-cols-2 gap-2">
                {gradients.map(gradient => (
                  <button
                    key={gradient.name}
                    onClick={() => setCardColor(gradient.value)}
                    className="h-12 rounded-lg border-2 border-slate-700 hover:border-white transition-colors"
                    style={{ background: gradient.value }}
                    title={gradient.name}
                  />
                ))}
              </div>
            </div>

            {/* Properties Panel */}
            {selectedElementData && (
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Properties</h2>
                  <button
                    onClick={() => deleteElement(selectedElement!)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {(selectedElementData.type === 'text' || selectedElementData.type === 'cardNumber') && (
                    <>
                      <div>
                        <label className="block text-sm mb-2">Color</label>
                        <input
                          type="color"
                          value={selectedElementData.color}
                          onChange={(e) => updateElement(selectedElement!, { color: e.target.value })}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Font Size</label>
                        <input
                          type="range"
                          min="12"
                          max="48"
                          value={selectedElementData.fontSize}
                          onChange={(e) => updateElement(selectedElement!, { fontSize: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <div className="text-sm text-slate-400 mt-1">{selectedElementData.fontSize}px</div>
                      </div>
                    </>
                  )}

                  {(selectedElementData.type === 'circle' || selectedElementData.type === 'rectangle') && (
                    <>
                      <div>
                        <label className="block text-sm mb-2">Color</label>
                        <input
                          type="color"
                          value={selectedElementData.backgroundColor}
                          onChange={(e) => updateElement(selectedElement!, { backgroundColor: e.target.value })}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Opacity</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedElementData.opacity}
                          onChange={(e) => updateElement(selectedElement!, { opacity: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <div className="text-sm text-slate-400 mt-1">{(selectedElementData.opacity * 100).toFixed(0)}%</div>
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Size</label>
                        <input
                          type="range"
                          min="40"
                          max="200"
                          value={selectedElementData.width}
                          onChange={(e) => {
                            const size = parseInt(e.target.value);
                            updateElement(selectedElement!, { width: size, height: size });
                          }}
                          className="w-full"
                        />
                        <div className="text-sm text-slate-400 mt-1">{selectedElementData.width}px</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg p-8">
              <div className="flex justify-center">
                <div
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    background: cardColor,
                  }}
                >
                  {/* Card template overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-4 right-4 text-white/30 text-xs">VISA</div>
                  </div>

                  {/* Rendered elements */}
                  {elements.map(element => (
                    <div
                      key={element.id}
                      onMouseDown={(e) => handleMouseDown(e, element.id)}
                      onDoubleClick={(e) => {
                        if (element.type === 'text' || element.type === 'cardNumber') {
                          handleTextDoubleClick(e, element.id);
                        }
                      }}
                      className={`absolute cursor-move ${selectedElement === element.id ? 'ring-2 ring-blue-400' : ''}`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                      }}
                    >
                      {(element.type === 'text' || element.type === 'cardNumber') && (
                        <div
                          className="editable-text w-full h-full flex items-center"
                          style={{
                            color: element.color,
                            fontSize: element.fontSize,
                            fontFamily: element.type === 'cardNumber' ? 'monospace' : 'inherit',
                            fontWeight: element.type === 'cardNumber' ? '500' : 'normal',
                          }}
                        >
                          {element.content}
                        </div>
                      )}

                      {element.type === 'circle' && (
                        <div
                          className="w-full h-full rounded-full"
                          style={{
                            backgroundColor: element.backgroundColor,
                            opacity: element.opacity,
                          }}
                        />
                      )}

                      {element.type === 'rectangle' && (
                        <div
                          className="w-full h-full rounded-lg"
                          style={{
                            backgroundColor: element.backgroundColor,
                            opacity: element.opacity,
                          }}
                        />
                      )}

                      {selectedElement === element.id && (
                        <div className="absolute -top-2 -right-2 bg-blue-400 rounded-full p-1">
                          <Move className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-400">
                Click components to add • Drag to move • Double-click text to edit • Select to customize
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}