import { useEffect } from 'react';

export const useKeyboardShortcuts = ({ 
  selectedItemId, 
  items, 
  onReorder, 
  onPriorityChange, 
  onToggleExpand,
  onEdit,
  isInputFocused 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (isInputFocused || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const selectedIndex = items.findIndex(item => item.id === selectedItemId);
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (selectedIndex > 0 && !e.shiftKey) {
            // Move selection up
            const prevItem = items[selectedIndex - 1];
            document.getElementById(prevItem.id)?.focus();
          } else if (e.shiftKey && selectedIndex > 0) {
            // Reorder item up
            onReorder(selectedIndex, selectedIndex - 1);
          }
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          if (selectedIndex < items.length - 1 && !e.shiftKey) {
            // Move selection down
            const nextItem = items[selectedIndex + 1];
            document.getElementById(nextItem.id)?.focus();
          } else if (e.shiftKey && selectedIndex < items.length - 1) {
            // Reorder item down
            onReorder(selectedIndex, selectedIndex + 1);
          }
          break;
          
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (selectedItemId) {
            onToggleExpand(selectedItemId);
          }
          break;
          
        case 'e':
        case 'E':
          e.preventDefault();
          if (selectedItemId) {
            onEdit(selectedItemId);
          }
          break;
          
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          e.preventDefault();
          if (selectedItemId) {
            const priorityLevels = [
              { level: 1, color: '#EF4444', label: 'Critical' },
              { level: 2, color: '#F97316', label: 'Urgent' },
              { level: 3, color: '#EAB308', label: 'High' },
              { level: 4, color: '#3B82F6', label: 'Medium' },
              { level: 5, color: '#8B5CF6', label: 'Ongoing' }
            ];
            onPriorityChange(selectedItemId, priorityLevels[parseInt(e.key) - 1]);
          }
          break;
          
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, items, onReorder, onPriorityChange, onToggleExpand, onEdit, isInputFocused]);
};