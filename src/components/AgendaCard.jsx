import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Check, X, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AgendaCard = ({ item, onUpdate, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleSave = () => {
    onUpdate(item.id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(item.title);
    setEditedDescription(item.description);
    setIsEditing(false);
  };

  const getPreviewText = () => {
    const text = item.description || item.rationale || item.targetOutcome || 'No details available';
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-soft hover:shadow-md transition-all duration-200 mb-3 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseEnter={() => !isExpanded && setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div 
        className="border-l-4 rounded-l-lg"
        style={{ borderColor: item.priority.color }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <div
                {...attributes}
                {...listeners}
                className="mt-1 mr-3 text-gray-400 hover:text-gray-600 cursor-grab"
              >
                <GripVertical size={20} />
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary-teal"
                      autoFocus
                    />
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary-teal"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-primary-teal text-white rounded hover:bg-primary-dark transition-colors"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-text-primary">{item.title}</h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: item.priority.color + '20', color: item.priority.color }}
                      >
                        {item.priority.label}
                      </span>
                      
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
                  </>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            )}
          </div>
          
          {isExpanded && !isEditing && (
            <div className="mt-4 pl-8 space-y-2 text-sm text-text-secondary">
              {item.description && (
                <div>
                  <span className="font-medium text-text-primary">Description:</span>
                  <p className="mt-1">{item.description}</p>
                </div>
              )}
              {item.rationale && (
                <div>
                  <span className="font-medium text-text-primary">Rationale:</span>
                  <p className="mt-1">{item.rationale}</p>
                </div>
              )}
              {item.targetOutcome && (
                <div>
                  <span className="font-medium text-text-primary">Target Outcome:</span>
                  <p className="mt-1">{item.targetOutcome}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {showPreview && !isExpanded && !isEditing && (
        <div className="absolute z-10 mt-1 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg max-w-sm">
          {getPreviewText()}
        </div>
      )}
    </div>
  );
};

export default AgendaCard;