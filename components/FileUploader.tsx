'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileJson, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from './UI';

interface FileUploaderProps {
    onFileLoad: (geojson: GeoJSON.Feature | GeoJSON.FeatureCollection) => void;
    className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoad, className = '' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateGeoJSON = (data: any): { valid: boolean; error?: string } => {
        // Check if it's a valid GeoJSON structure
        if (!data || typeof data !== 'object') {
            return { valid: false, error: 'Invalid JSON structure' };
        }

        // Check for Feature or FeatureCollection
        if (data.type === 'Feature') {
            if (!data.geometry || !data.geometry.type) {
                return { valid: false, error: 'Feature missing geometry' };
            }

            const geomType = data.geometry.type;
            if (!['Polygon', 'MultiPolygon'].includes(geomType)) {
                return { valid: false, error: `Only Polygon or MultiPolygon supported, got ${geomType}` };
            }
        } else if (data.type === 'FeatureCollection') {
            if (!Array.isArray(data.features)) {
                return { valid: false, error: 'FeatureCollection missing features array' };
            }

            if (data.features.length === 0) {
                return { valid: false, error: 'FeatureCollection is empty' };
            }

            // Check if at least one feature has a Polygon/MultiPolygon
            const hasValidGeometry = data.features.some((f: any) =>
                f.geometry && ['Polygon', 'MultiPolygon'].includes(f.geometry.type)
            );

            if (!hasValidGeometry) {
                return { valid: false, error: 'No valid Polygon or MultiPolygon found in FeatureCollection' };
            }
        } else {
            return { valid: false, error: 'Must be a GeoJSON Feature or FeatureCollection' };
        }

        return { valid: true };
    };

    const processFile = async (file: File) => {
        setError(null);
        setSuccess(null);

        // Check file extension
        if (!file.name.endsWith('.json') && !file.name.endsWith('.geojson')) {
            setError('Only .json or .geojson files are supported');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File too large. Maximum size is 5MB');
            return;
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const validation = validateGeoJSON(data);
            if (!validation.valid) {
                setError(validation.error || 'Invalid GeoJSON');
                return;
            }

            // Success!
            onFileLoad(data);
            setSuccess(`${file.name} loaded successfully`);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            if (err instanceof SyntaxError) {
                setError('Invalid JSON syntax');
            } else {
                setError('Failed to read file');
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,.geojson"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 transition-all ${isDragging
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
            >
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'
                        }`}>
                        <FileJson className={`w-6 h-6 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-900">
                            Drop GeoJSON file here
                        </p>
                        <p className="text-xs text-slate-500">
                            or click to browse
                        </p>
                    </div>

                    <Button variant="outline" size="sm" onClick={openFilePicker}>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                    </Button>

                    <p className="text-xs text-slate-400">
                        Supports .json and .geojson (max 5MB)
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-medium text-rose-900">Error</p>
                        <p className="text-xs text-rose-700">{error}</p>
                    </div>
                    <button onClick={clearError} className="text-rose-400 hover:text-rose-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-emerald-900">{success}</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
