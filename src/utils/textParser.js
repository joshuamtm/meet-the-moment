export const parseBriefingText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  const items = [];
  let currentItem = null;
  let itemId = 1;

  const priorityMap = {
    'CRITICAL': { level: 1, color: '#dc2626', label: 'Critical' },
    'IMMEDIATE': { level: 1, color: '#dc2626', label: 'Critical' },
    'TODAY': { level: 1, color: '#dc2626', label: 'Critical' },
    'URGENT': { level: 2, color: '#ea580c', label: 'High' },
    'HIGH': { level: 2, color: '#ea580c', label: 'High' },
    'IMPORTANT': { level: 2, color: '#ea580c', label: 'High' },
    'MEDIUM': { level: 3, color: '#3b82f6', label: 'Medium' },
    'NORMAL': { level: 3, color: '#3b82f6', label: 'Medium' },
    'LOW': { level: 4, color: '#10b981', label: 'Low' },
    'MINOR': { level: 4, color: '#10b981', label: 'Low' },
    'ONGOING': { level: 5, color: '#8b5cf6', label: 'Ongoing' },
    'RECURRING': { level: 5, color: '#8b5cf6', label: 'Ongoing' }
  };

  const detectPriority = (text) => {
    const upperText = text.toUpperCase();
    for (const [keyword, config] of Object.entries(priorityMap)) {
      if (upperText.includes(`[${keyword}]`) || upperText.includes(keyword)) {
        return config;
      }
    }
    return { level: 3, color: '#3b82f6', label: 'Medium' };
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
      priority: { level: 3, color: '#3b82f6', label: 'Medium' },
      status: 'open',
      order: 0
    });
  }

  return items;
};