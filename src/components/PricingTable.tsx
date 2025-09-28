'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface LineItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isOptional: boolean;
  isSelected: boolean;
}
interface PricingTableProps {
  id: string;
  initialItems?: LineItem[];
  onUpdate?: (id: string, items: LineItem[]) => void;
}

export default function PricingTable({ id, initialItems = [], onUpdate }: PricingTableProps) {
  const [items, setItems] = useState<LineItem[]>(initialItems || []);
  const total = items.reduce((sum: number, item: LineItem) => (!item.isOptional || item.isSelected ? sum + item.price : sum), 0);

  // Syncs incoming prop changes to local state
  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(id, items);
    }
  };

  const handleItemChange = (itemId: string, field: keyof LineItem, value: string | number | boolean) => {
    const updatedItems = items.map((item: LineItem) => item.id === itemId ? { ...item, [field]: value } : item);
    setItems(updatedItems);
  };

  const addRow = () => {
    const newRow: LineItem = { id: uuidv4(), name: 'New Service', description: '', price: 0, isOptional: false, isSelected: true, };
    const newItems = [...items, newRow];
    setItems(newItems);
    if (onUpdate) {
        onUpdate(id, newItems);
    }
  };
  
  const removeRow = useCallback((rowId: string) => {
    const newItems = items.filter(item => item.id !== rowId);
    setItems(newItems);
    if (onUpdate) {
        onUpdate(id, newItems);
    }
  }, [items, id, onUpdate]);

  return (
    <div className="border rounded-lg my-6 bg-white overflow-x-auto">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/2">Description</th><th className="px-6 py-3 text-right font-semibold text-gray-700">Price</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item: LineItem) => (
            <tr key={item.id} className={`${item.isOptional && !item.isSelected ? 'opacity-50' : ''}`}>
              <td className="px-6 py-4">
                <div className="flex items-start">
                  {onUpdate && item.isOptional && (
                    <input type="checkbox" checked={item.isSelected} onChange={(e) => handleItemChange(item.id, 'isSelected', e.target.checked)} onBlur={handleSave} className="h-4 w-4 mt-1 mr-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  )}
                  <div className={onUpdate && item.isOptional ? '' : 'ml-8'}>
                    {onUpdate ? (
                      <>
                        <input type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} onBlur={handleSave} className="font-medium text-gray-900 w-full border-none p-0 focus:ring-0" placeholder="Item name"/>
                        <input type="text" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} onBlur={handleSave} className="text-gray-500 w-full border-none p-0 focus:ring-0" placeholder="Description"/>
                      </>
                    ) : (
                      <>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-gray-500">{item.description}</div>
                      </>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex justify-end items-center">
                    {onUpdate ? (
                      <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} onBlur={handleSave} className="w-24 text-right border-none p-0 focus:ring-0"/>
                    ) : (
                      <span>{`$${item.price.toLocaleString()}`}</span>
                    )}
                    {onUpdate && (
                        <button onClick={() => removeRow(item.id)} className="ml-4 text-gray-400 hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50"><td className="px-6 py-4 text-right font-bold text-gray-900 text-lg">Total</td><td className="px-6 py-4 text-right font-bold text-gray-900 text-lg">${total.toLocaleString()}</td></tr>
          {onUpdate && (
            <tr className="bg-white"><td colSpan={2} className="px-6 py-3"><button onClick={addRow} className="text-sm font-semibold text-blue-600 hover:text-blue-800">+ Add Line Item</button></td></tr>
          )}
        </tfoot>
      </table>
    </div>
  );
}