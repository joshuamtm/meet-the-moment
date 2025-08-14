import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  FileText, 
  Copy, 
  Download, 
  RefreshCw, 
  CheckCircle,
  Info,
  Keyboard
} from 'lucide-react';

import AgendaCard from './components/AgendaCard';
import FileUpload from './components/FileUpload';
import { parseBriefingText } from './utils/textParser';
import { exportToMarkdown, copyToClipboard, downloadMarkdown } from './utils/exportUtils';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [inputText, setInputText] = useState('');
  const [agendaItems, setAgendaItems] = useState([]);
  const [parkingLotItems, setParkingLotItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showShortcuts, setShowShortcuts] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTextParse = useCallback(() => {
    if (inputText.trim()) {
      const items = parseBriefingText(inputText);
      setAgendaItems(items);
      setParkingLotItems([]);
    }
  }, [inputText]);

  const handleFileUpload = useCallback((content) => {
    setInputText(content);
    const items = parseBriefingText(content);
    setAgendaItems(items);
    setParkingLotItems([]);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setAgendaItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const handleItemUpdate = (itemId, updates) => {
    setAgendaItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const handleStatusChange = (itemId, newStatus) => {
    if (newStatus === 'deferred') {
      const item = agendaItems.find((i) => i.id === itemId);
      if (item) {
        setParkingLotItems((prev) => [...prev, item]);
        setAgendaItems((items) => items.filter((i) => i.id !== itemId));
      }
    } else {
      handleItemUpdate(itemId, { status: newStatus });
    }
  };

  const handleExport = async (format) => {
    const { markdown, meetingId } = exportToMarkdown(agendaItems, parkingLotItems);
    
    if (format === 'clipboard') {
      const success = await copyToClipboard(markdown);
      if (success) {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      }
    } else {
      downloadMarkdown(markdown, meetingId);
    }
  };

  const handleClear = () => {
    setInputText('');
    setAgendaItems([]);
    setParkingLotItems([]);
    setSelectedItemId(null);
    setExpandedItems(new Set());
  };

  const handleReorder = (fromIndex, toIndex) => {
    setAgendaItems((items) => {
      const newItems = arrayMove(items, fromIndex, toIndex);
      return newItems.map((item, index) => ({ ...item, order: index }));
    });
  };

  const handlePriorityChange = (itemId, priority) => {
    handleItemUpdate(itemId, { priority });
  };

  const handleToggleExpand = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleEdit = (itemId) => {
    // This would trigger edit mode in the AgendaCard component
    // Implementation depends on how you want to handle this
  };

  useKeyboardShortcuts({
    selectedItemId,
    items: agendaItems,
    onReorder: handleReorder,
    onPriorityChange: handlePriorityChange,
    onToggleExpand: handleToggleExpand,
    onEdit: handleEdit,
    isInputFocused,
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container mx-auto max-w-6xl p-6">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-gray-700" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Executive Meeting Agenda
            </h1>
          </div>
          <p className="text-gray-600 text-sm mb-4 px-4">
            Transform your executive briefing into an interactive meeting agenda
          </p>
          <div className="flex justify-end px-4">
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Keyboard size={16} />
              Shortcuts
            </button>
          </div>
        </header>

        {showShortcuts && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-soft">
            <h3 className="font-semibold mb-2 text-primary-dark">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
              <div>↑/↓ - Navigate items</div>
              <div>Shift + ↑/↓ - Reorder items</div>
              <div>Space/Enter - Expand/Collapse</div>
              <div>E - Edit mode</div>
              <div>1-5 - Set priority level</div>
            </div>
          </div>
        )}

        {agendaItems.length === 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-text-primary">
                Paste Your Briefing Text
              </h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Paste your meeting briefing here...

Example format:
1. [URGENT] Budget Review
   Rationale: Q4 spending needs approval
   Target Outcome: Approved budget allocation

2. Product Launch Timeline
   Description: Review launch milestones
   Target Outcome: Confirmed launch date"
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleTextParse}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] font-medium"
                  aria-label="Generate agenda from text"
                >
                  Generate Agenda
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors min-h-[44px] flex items-center gap-2"
                  aria-label="Clear input text"
                >
                  <RefreshCw size={16} />
                  Clear
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-text-primary">
                Or Upload a File
              </h2>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-700" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Meeting Agenda ({agendaItems.length} items)
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => handleExport('clipboard')}
                  className="px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm sm:text-base min-h-[44px]"
                  aria-label="Copy agenda to clipboard"
                >
                  <Copy size={16} />
                  <span className="hidden sm:inline">Copy to Clipboard</span>
                  <span className="sm:hidden">Copy</span>
                </button>
                <button
                  onClick={() => handleExport('download')}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base min-h-[44px]"
                  aria-label="Export agenda as markdown"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export Markdown</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors min-h-[44px] flex items-center justify-center"
                  aria-label="Clear all items"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {showCopiedMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} />
                Agenda copied to clipboard!
              </div>
            )}

            <div className="bg-white bg-opacity-95 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={agendaItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {agendaItems.map((item) => (
                    <div
                      key={item.id}
                      id={item.id}
                      tabIndex={0}
                      onFocus={() => setSelectedItemId(item.id)}
                      className="focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-lg"
                    >
                      <AgendaCard
                        item={item}
                        onUpdate={handleItemUpdate}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                      />
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
              </div>

              {parkingLotItems.length > 0 && (
                <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">
                    🅿️ Parking Lot ({parkingLotItems.length} deferred items)
                  </h3>
                  <div className="space-y-2">
                    {parkingLotItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded border border-orange-200"
                      >
                        <h4 className="font-medium text-gray-700">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Meet the Moment Dashboard - Stateless Meeting Facilitation</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <Info size={14} />
            No data is stored. All information is processed locally in your browser.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;