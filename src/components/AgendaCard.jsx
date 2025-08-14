import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit2, Check, X, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AgendaCard = ({ item, onUpdate, onStatusChange, onPriorityChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
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
    { level: 1, color: '#e74c3c', label: 'IMMEDIATE', bgClass: 'bg-red-500' },
    { level: 2, color: '#e67e22', label: 'BY AUG 31', bgClass: 'bg-orange-500' },
    { level: 3, color: '#f39c12', label: 'SEPT', bgClass: 'bg-yellow-500' },
    { level: 4, color: '#3498db', label: 'OCT', bgClass: 'bg-blue-500' },
    { level: 5, color: '#9b59b6', label: 'ONGOING', bgClass: 'bg-purple-500' },
    { level: 6, color: '#27ae60', label: 'Q4', bgClass: 'bg-green-500' }
  ];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'cursor-grabbing' : ''
      } relative`}
      onMouseEnter={() => !isExpanded && !isEditing && setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div 
        className="border-l-4 rounded-l-lg h-full"
        style={{ borderColor: item.priority.color }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 cursor-grab mt-1"
            >
              <GripVertical size={18} />
            </div>
            
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: '#2c3e50' }}
            >
              {item.order + 1}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary-teal text-sm font-semibold"
                    autoFocus
                  />
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary-teal text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-primary-teal text-white rounded hover:bg-primary-dark transition-colors text-sm"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-800">{item.title}</h3>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 relative">
                    <button
                      onClick={handlePriorityClick}
                      className="px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: item.priority.color + 'dd' }}
                    >
                      {item.priority.label}
                    </button>
                    
                    {isEditingPriority && (
                      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-2 min-w-[120px]">
                        {priorityOptions.map((priority) => (
                          <button
                            key={priority.level}
                            onClick={() => handlePrioritySelect(priority)}
                            className="block w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 mb-1"
                            style={{ color: priority.color }}
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
            
            {!isEditing && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}
          </div>
          
          {isExpanded && !isEditing && (
            <div className="mt-4 pl-14 space-y-3 text-xs">
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
                <span className="text-xs text-gray-500">Status:</span>
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className={`px-2 py-1 rounded text-xs font-medium ${statusColors[item.status]}`}
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
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4"
          style={{ minWidth: '300px' }}
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