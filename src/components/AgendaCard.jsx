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

  // Check if item has additional details
  const hasDetails = item.description || item.rationale || item.targetOutcome;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'cursor-grabbing' : ''
      } relative group`}
      onMouseEnter={() => !isMobile && !isExpanded && !isEditing && hasDetails && setShowDetails(true)}
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
        <div className="p-3">
          <div className="flex items-start gap-2">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 cursor-grab mt-0.5 p-1 touch-manipulation opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Drag to reorder"
            >
              <GripVertical size={16} />
            </button>
            
            <div 
              className="flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: '#2c3e50' }}
              aria-label={`Item number ${item.order + 1}`}
            >
              {item.order + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <label htmlFor={`title-${item.id}`} className="sr-only">Item title</label>
                  <input
                    id={`title-${item.id}`}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                    autoFocus
                  />
                  <label htmlFor={`desc-${item.id}`} className="sr-only">Item description</label>
                  <textarea
                    id={`desc-${item.id}`}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs flex items-center gap-1"
                      aria-label="Save changes"
                    >
                      <Check size={12} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs flex items-center gap-1"
                      aria-label="Cancel editing"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-800 leading-tight truncate">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {!item.description && !hasDetails && (
                        <p className="text-xs text-gray-400 mt-0.5 italic">
                          No description available
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                      aria-label="Edit item"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={handlePriorityClick}
                      className="px-2 py-0.5 rounded text-xs font-bold text-white uppercase tracking-wide transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: item.priority.color + 'dd' }}
                      aria-label={getPriorityLabel()}
                      aria-expanded={isEditingPriority}
                      aria-haspopup="true"
                    >
                      {item.priority.label}
                    </button>
                    
                    {isEditingPriority && (
                      <div 
                        className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-1 min-w-[120px]"
                        role="menu"
                        aria-label="Select priority"
                      >
                        {priorityOptions.map((priority) => (
                          <button
                            key={priority.level}
                            onClick={() => handlePrioritySelect(priority)}
                            className="block w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100"
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
            
            {!isEditing && hasDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
          
          {isExpanded && !isEditing && hasDetails && (
            <div className="mt-3 pl-9 space-y-2 text-xs border-t pt-3" role="region" aria-label="Item details">
              {item.rationale && (
                <div>
                  <span className="font-semibold text-gray-700">Rationale:</span>
                  <p className="text-gray-600 mt-0.5">{item.rationale}</p>
                </div>
              )}
              {item.targetOutcome && (
                <div>
                  <span className="font-semibold text-gray-700">Target Outcome:</span>
                  <p className="text-gray-600 mt-0.5">{item.targetOutcome}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2 pt-2">
                <label htmlFor={`status-${item.id}`} className="text-xs text-gray-500">Status:</label>
                <select
                  id={`status-${item.id}`}
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className={`px-2 py-1 rounded text-xs font-medium ${statusColors[item.status]}`}
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
      
      {showDetails && !isExpanded && !isEditing && hasDetails && (
        <div 
          ref={detailsRef}
          className={`${
            isMobile 
              ? 'relative mt-2 mx-3 mb-3' 
              : 'absolute top-full left-0 right-0 mt-1'
          } bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3`}
          style={{ minWidth: isMobile ? 'auto' : '280px' }}
          role="tooltip"
          aria-label="Additional details"
        >
          <h4 className="font-semibold text-xs text-gray-800 mb-2">{item.title}</h4>
          
          {item.description && (
            <div className="mb-2">
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          )}
          
          {item.rationale && (
            <div className="mb-2">
              <div className="font-semibold text-gray-600 text-xs mb-0.5">Rationale:</div>
              <div className="text-xs text-gray-600">{item.rationale}</div>
            </div>
          )}
          
          {item.targetOutcome && (
            <div className="mb-2">
              <div className="font-semibold text-gray-600 text-xs mb-0.5">Target Outcome:</div>
              <div className="text-xs text-gray-600">{item.targetOutcome}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgendaCard;