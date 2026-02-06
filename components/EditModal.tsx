import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface EditModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: Project) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ project, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Project>(project);
  
  useEffect(() => {
    setFormData(project);
  }, [project]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000000]">
        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
            <h2 className="font-['Rajdhani'] text-3xl font-bold uppercase text-black">Edit Node_DATA</h2>
            <button onClick={onClose} className="text-2xl font-bold hover:text-red-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
            <div>
                <label className="block font-bold mb-1">PROJECT IMAGE (UPLOAD)</label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border-2 border-black p-2 bg-gray-100"
                />
                {formData.imageUrl && (
                    <div className="mt-2 h-32 w-full border-2 border-black bg-gray-100 overflow-hidden">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover grayscale" />
                    </div>
                )}
            </div>

            <div>
                <label className="block font-bold mb-1">PROJECT LINK</label>
                <input 
                    type="url"
                    value={formData.projectLink || ''}
                    onChange={(e) => setFormData({...formData, projectLink: e.target.value})}
                    placeholder="https://..."
                    className="w-full border-2 border-black p-2"
                />
            </div>

            <div>
                <label className="block font-bold mb-1">DESCRIPTION</label>
                <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border-2 border-black p-2 h-24 focus:outline-none focus:bg-gray-50"
                />
            </div>
            
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-bold mb-1">YEAR</label>
                    <input 
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full border-2 border-black p-2"
                    />
                </div>
                <div>
                    <label className="block font-bold mb-1">TYPE</label>
                    <input 
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full border-2 border-black p-2"
                    />
                </div>
            </div>

            <div className="pt-4 flex gap-4">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 border-2 border-black py-3 font-bold hover:bg-black hover:text-white transition-colors"
                >
                    CANCEL
                </button>
                <button 
                    type="submit" 
                    className="flex-1 bg-black text-white border-2 border-black py-3 font-bold hover:bg-white hover:text-black transition-colors"
                >
                    SAVE CHANGES
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};