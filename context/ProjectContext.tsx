'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types';

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Project) => void;
    updateProject: (project: Project) => void;
    getProjectsByWorkspace: (workspaceId: string) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Initial Mock Data (same as in DashboardPage, but centralized here)
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        workspaceId: 'ws-1',
        name: 'Amazon Rainforest Monitoring',
        client: 'GreenEarth NGO',
        startDate: '2024-03-20',
        deadline: '2024-05-04',
        status: 'Active',
        progress: 30,
        type: 'NDVI',
        selectedIndices: ['NDVI', 'NDWI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[-60.5, -3.2], [-60.5, -3.8], [-59.8, -3.8], [-59.8, -3.2], [-60.5, -3.2]]] },
            properties: {}
        }
    },
    {
        id: '2',
        workspaceId: 'ws-1',
        name: 'Iowa Corn Yield Prediction',
        client: 'AgriCorp Global',
        startDate: '2024-03-15',
        deadline: '2024-04-10',
        status: 'Canceled',
        progress: 60,
        type: 'EVI',
        selectedIndices: ['NVI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[-95.5, 41.7], [-95.5, 41.3], [-94.9, 41.3], [-94.9, 41.7], [-95.5, 41.7]]] },
            properties: {}
        }
    },
    {
        id: '3',
        workspaceId: 'ws-1',
        name: 'Sahara Desert Boundary Study',
        client: 'United Nations Env',
        startDate: '2024-03-01',
        deadline: '2024-04-01',
        status: 'Completed',
        progress: 100,
        type: 'Custom',
        selectedIndices: ['NDVI', 'NDWI', 'NVI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[2.5, 25.2], [2.5, 24.6], [3.2, 24.6], [3.2, 25.2], [2.5, 25.2]]] },
            properties: {}
        }
    },
    {
        id: '4',
        workspaceId: 'ws-2',
        name: 'California Vineyard Hydration',
        client: 'Napa Valley Vintners',
        startDate: '2024-03-20',
        deadline: '2024-05-20',
        status: 'Pending',
        progress: 50,
        type: 'SAVI',
        selectedIndices: ['NDWI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[-122.5, 38.5], [-122.5, 38.2], [-122.2, 38.2], [-122.2, 38.5], [-122.5, 38.5]]] },
            properties: {}
        }
    },
    {
        id: '5',
        workspaceId: 'ws-2',
        name: 'Urban Expansion Tokyo',
        client: 'City Planning Dept',
        startDate: '2024-04-01',
        deadline: '2024-06-01',
        status: 'Active',
        progress: 45,
        type: 'NDVI',
        selectedIndices: ['NDVI'],
        geojson: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[[139.7, 35.7], [139.7, 35.6], [139.8, 35.6], [139.8, 35.7], [139.7, 35.7]]] },
            properties: {}
        }
    }
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

    // Load from local storage on mount
    useEffect(() => {
        const storedProjects = localStorage.getItem('verdify_projects');
        if (storedProjects) {
            try {
                const parsed = JSON.parse(storedProjects);
                // Merge with mocks if needed, or just use parsed. 
                // For simplicity, we'll assume if storage exists, it's the source of truth, 
                // but we might want to ensure mocks are present for the demo first time run.
                if (parsed.length > 0) {
                    setProjects(parsed);
                }
            } catch (e) {
                console.error("Failed to parse projects", e);
            }
        }
    }, []);

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem('verdify_projects', JSON.stringify(projects));
    }, [projects]);

    const addProject = (project: Project) => {
        setProjects((prev) => [project, ...prev]);
    };

    const updateProject = (updatedProject: Project) => {
        setProjects((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const getProjectsByWorkspace = (workspaceId: string) => {
        return projects.filter(p => p.workspaceId === workspaceId);
    };

    return (
        <ProjectContext.Provider
            value={{
                projects,
                addProject,
                updateProject,
                getProjectsByWorkspace,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}
