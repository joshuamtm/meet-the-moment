export const parseBriefingText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  const items = [];
  let currentItem = null;
  let itemId = 1;

  const priorityMap = {
    'CRITICAL': { level: 1, color: '#e74c3c', label: 'IMMEDIATE' },
    'IMMEDIATE': { level: 1, color: '#e74c3c', label: 'IMMEDIATE' },
    'TODAY': { level: 1, color: '#e74c3c', label: 'TODAY' },
    'URGENT': { level: 2, color: '#e67e22', label: 'URGENT' },
    'HIGH': { level: 3, color: '#f39c12', label: 'HIGH' },
    'SEPT': { level: 3, color: '#f39c12', label: 'SEPT' },
    'OCT': { level: 4, color: '#3498db', label: 'OCT' },
    'MEDIUM': { level: 4, color: '#3498db', label: 'MEDIUM' },
    'ONGOING': { level: 5, color: '#9b59b6', label: 'ONGOING' },
    'Q4': { level: 6, color: '#27ae60', label: 'Q4' },
    'LOW': { level: 6, color: '#27ae60', label: 'LOW' }
  };

  const detectPriority = (text) => {
    const upperText = text.toUpperCase();
    for (const [keyword, config] of Object.entries(priorityMap)) {
      if (upperText.includes(`[${keyword}]`) || upperText.includes(keyword)) {
        return config;
      }
    }
    return { level: 4, color: '#3B82F6', label: 'Medium' };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for numbered items (1. 2. 3. etc)
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/);
    // Check for bullet points
    const bulletMatch = trimmedLine.match(/^[\*\-]\s+(.+)/);
    // Check for headers with priority
    const headerMatch = trimmedLine.match(/^#+\s*(.+)/);

    if (numberedMatch || bulletMatch || headerMatch) {
      // Save previous item if exists
      if (currentItem) {
        items.push(currentItem);
      }

      const title = numberedMatch ? numberedMatch[2] : 
                   bulletMatch ? bulletMatch[1] : 
                   headerMatch[1];

      const priority = detectPriority(title);
      
      currentItem = {
        id: `item-${itemId++}`,
        title: title.replace(/\[.*?\]/g, '').trim(),
        description: '',
        rationale: '',
        targetOutcome: '',
        priority: priority,
        status: 'open',
        order: items.length
      };
    } else if (currentItem) {
      // Check for special sections
      if (trimmedLine.toLowerCase().startsWith('rationale:')) {
        currentItem.rationale = trimmedLine.substring(10).trim();
      } else if (trimmedLine.toLowerCase().startsWith('target outcome:') || 
                 trimmedLine.toLowerCase().startsWith('outcome:')) {
        currentItem.targetOutcome = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
      } else if (trimmedLine.toLowerCase().startsWith('description:')) {
        currentItem.description = trimmedLine.substring(12).trim();
      } else {
        // Add to description if not a special section
        if (!trimmedLine.toLowerCase().startsWith('rationale:') && 
            !trimmedLine.toLowerCase().includes('outcome:')) {
          currentItem.description += (currentItem.description ? ' ' : '') + trimmedLine;
        }
      }
    }
  }

  // Add the last item
  if (currentItem) {
    items.push(currentItem);
  }

  // If no items were parsed, create a default item from the text
  if (items.length === 0 && text.trim()) {
    items.push({
      id: 'item-1',
      title: 'Agenda Item',
      description: text.trim().substring(0, 200),
      rationale: '',
      targetOutcome: '',
      priority: { level: 4, color: '#3B82F6', label: 'Medium' },
      status: 'open',
      order: 0
    });
  }

  return items;
};