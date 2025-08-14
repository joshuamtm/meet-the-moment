export const parseBriefingText = (text) => {
  const lines = text.split('\n');
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

  const cleanTitle = (title) => {
    // Remove priority brackets and clean up
    return title.replace(/\[.*?\]/g, '').trim();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (!trimmedLine) continue;

    // Check for numbered items (1. 2. 3. etc)
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/);
    // Check for bullet points
    const bulletMatch = trimmedLine.match(/^[\*\-]\s+(.+)/);
    // Check for headers with #
    const headerMatch = trimmedLine.match(/^#+\s*(.+)/);

    if (numberedMatch || bulletMatch || headerMatch) {
      // Save previous item if exists
      if (currentItem) {
        items.push(currentItem);
      }

      let rawTitle = numberedMatch ? numberedMatch[2] : 
                    bulletMatch ? bulletMatch[1] : 
                    headerMatch[1];
      
      // Split title at common delimiters to separate title from description
      let title = rawTitle;
      let description = '';
      
      // Check for dash separator (common pattern)
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        title = parts[0];
        description = parts.slice(1).join(' - ');
      } else if (rawTitle.includes(': ')) {
        const parts = rawTitle.split(': ');
        title = parts[0];
        description = parts.slice(1).join(': ');
      }

      const priority = detectPriority(rawTitle);
      title = cleanTitle(title);
      
      currentItem = {
        id: `item-${itemId++}`,
        title: title,
        description: description,
        rationale: '',
        targetOutcome: '',
        priority: priority,
        status: 'open',
        order: items.length
      };
    } else if (currentItem) {
      // Check for special sections
      const lowerLine = trimmedLine.toLowerCase();
      
      if (lowerLine.startsWith('rationale:')) {
        currentItem.rationale = trimmedLine.substring(10).trim();
      } else if (lowerLine.startsWith('target outcome:') || lowerLine.startsWith('outcome:')) {
        currentItem.targetOutcome = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
      } else if (lowerLine.startsWith('description:')) {
        currentItem.description = trimmedLine.substring(12).trim();
      } else if (!lowerLine.startsWith('rationale:') && 
                 !lowerLine.includes('outcome:') &&
                 !lowerLine.startsWith('description:')) {
        // If we don't have a description yet and this is indented or follows the title
        if (!currentItem.description && i > 0) {
          currentItem.description = trimmedLine;
        } else if (currentItem.description && !currentItem.rationale && !currentItem.targetOutcome) {
          // Continue building description if it's multi-line
          currentItem.description += ' ' + trimmedLine;
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
    const lines = text.trim().split('\n');
    items.push({
      id: 'item-1',
      title: lines[0] || 'Agenda Item',
      description: lines.slice(1).join(' ').trim(),
      rationale: '',
      targetOutcome: '',
      priority: { level: 3, color: '#3b82f6', label: 'Medium' },
      status: 'open',
      order: 0
    });
  }

  return items;
};