import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit2, Check, X, GripVertical, MoreVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AgendaCard = ({ item, onUpdate, onStatusChange, onPriorityChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const detailsRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusOptions = ['open', 'discussed', 'complete', 'deferred'];
  
  const statusColors = {
    open: 'bg-gray-100 text-gray-700',
    discussed: 'bg-blue-100 text-blue-700',
    complete: 'bg-green-100 text-green-700',
    deferred: 'bg-orange-100 text-orange-700'
  };

  const priorityOptions = [
    { level: 1, color: '#dc2626', label: 'Critical', bgClass: 'bg-red-600' },
    { level: 2, color: '#ea580c', label: 'High', bgClass: 'bg-orange-600' },
    { level: 3, color: '#3b82f6', label: 'Medium', bgClass: 'bg-blue-600' },
    { level: 4, color: '#10b981', label: 'Low', bgClass: 'bg-green-600' },
    { level: 5, color: '#8b5cf6', label: 'Ongoing', bgClass: 'bg-purple-600' }
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSave = () => {
    onUpdate(item.id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(item.title);
    setEditedDescription(item.description);
    setIsEditing(false);
  };

  const handlePriorityClick = (e) => {
    e.stopPropagation();
    setIsEditingPriority(!isEditingPriority);
  };

  const handlePrioritySelect = (priority) => {
    onPriorityChange(item.id, priority);
    setIsEditingPriority(false);
  };

  const handleDetailsToggle = () => {
    if (isMobile) {
      setShowDetails(!showDetails);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };

    if (showDetails && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails, isMobile]);

  // Priority label for accessibility
  const getPriorityLabel = () => {
    const priority = item.priority;
    return `Priority: ${priority.label}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'cursor-grabbing' : ''
      } relative`}
      onMouseEnter={() => !isMobile && !isExpanded && !isEditing && setShowDetails(true)}
      onMouseLeave={() => !isMobile && setShowDetails(false)}
      onClick={handleDetailsToggle}
      role="article"
      aria-label={`Agenda item ${item.order + 1}: ${item.title}`}
    >
      <div 
        className="border-l-4 rounded-l-lg h-full"
        style={{ borderColor: item.priority.color }}
        aria-hidden="true"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 cursor-grab mt-1 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Drag to reorder"
            >
              <GripVertical size={20} />
            </button>
            
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: '#2c3e50' }}
              aria-label={`Item number ${item.order + 1}`}
            >
              {item.order + 1}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <label htmlFor={`title-${item.id}`} className="sr-only">Item title</label>
                  <input
                    id={`title-${item.id}`}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                    autoFocus
                  />
                  <label htmlFor={`desc-${item.id}`} className="sr-only">Item description</label>
                  <textarea
                    id={`desc-${item.id}`}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm min-h-[44px] flex items-center gap-2"
                      aria-label="Save changes"
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm min-h-[44px] flex items-center gap-2"
                      aria-label="Cancel editing"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-800 flex-1">{item.title}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                          className={`text-gray-400 hover:text-gray-600 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                            isMobile ? '' : 'opacity-0 group-hover:opacity-100'
                          }`}
                          aria-label="Edit item"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={handlePriorityClick}
                      className="px-3 py-2 rounded text-xs font-bold text-white uppercase tracking-wider transition-all hover:scale-105 cursor-pointer min-h-[32px]"
                      style={{ backgroundColor: item.priority.color + 'dd' }}
                      aria-label={getPriorityLabel()}
                      aria-expanded={isEditingPriority}
                      aria-haspopup="true"
                    >
                      {item.priority.label}
                    </button>
                    
                    {isMobile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetails(!showDetails);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Show more details"
                        aria-expanded={showDetails}
                      >
                        <MoreVertical size={20} />
                      </button>
                    )}
                    
                    {isEditingPriority && (
                      <div 
                        className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-2 min-w-[140px]"
                        role="menu"
                        aria-label="Select priority"
                      >
                        {priorityOptions.map((priority) => (
                          <button
                            key={priority.level}
                            onClick={() => handlePrioritySelect(priority)}
                            className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 mb-1 min-h-[36px]"
                            style={{ color: priority.color }}
                            role="menuitem"
                          >
                            {priority.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {!isEditing && !isMobile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            )}
          </div>
          
          {isExpanded && !isEditing && (
            <div className="mt-4 pl-12 sm:pl-14 space-y-3 text-xs" role="region" aria-label="Item details">
              {item.rationale && (
                <div>
                  <span className="font-semibold text-gray-700 uppercase text-xs tracking-wider">Rationale</span>
                  <p className="mt-1 text-gray-600 leading-relaxed">{item.rationale}</p>
                </div>
              )}
              {item.targetOutcome && (
                <div>
                  <span className="font-semibold text-gray-700 uppercase text-xs tracking-wider">Target Outcome</span>
                  <p className="mt-1 text-gray-600 leading-relaxed">{item.targetOutcome}</p>
                </div>
              )}
              
              <div className="flex items-center gap-3 pt-2">
                <label htmlFor={`status-${item.id}`} className="text-xs text-gray-500">Status:</label>
                <select
                  id={`status-${item.id}`}
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className={`px-3 py-2 rounded text-xs font-medium min-h-[36px] ${statusColors[item.status]}`}
                  aria-label="Change status"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showDetails && !isExpanded && !isEditing && (item.rationale || item.targetOutcome) && (
        <div 
          ref={detailsRef}
          className={`${
            isMobile 
              ? 'relative mt-2 mx-4 mb-4' 
              : 'absolute top-full left-0 right-0 mt-2'
          } bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4`}
          style={{ minWidth: isMobile ? 'auto' : '300px' }}
          role="tooltip"
          aria-label="Additional details"
        >
          <h4 className="font-semibold text-sm text-gray-800 mb-3">{item.title}</h4>
          
          {item.rationale && (
            <div className="mb-3">
              <div className="font-semibold text-gray-600 uppercase text-xs tracking-wider mb-1">Rationale</div>
              <div className="text-xs text-gray-700 leading-relaxed">{item.rationale}</div>
            </div>
          )}
          
          {item.targetOutcome && (
            <div className="mb-3">
              <div className="font-semibold text-gray-600 uppercase text-xs tracking-wider mb-1">Target Outcome</div>
              <div className="text-xs text-gray-700 leading-relaxed">{item.targetOutcome}</div>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <span 
              className="px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider"
              style={{ backgroundColor: item.priority.color + 'dd' }}
              aria-label={getPriorityLabel()}
            >
              {item.priority.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaCard;