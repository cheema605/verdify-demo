'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workspace } from '@/types';

interface WorkspaceContextType {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    setCurrentWorkspace: (workspace: Workspace) => void;
    createWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt'>) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Mock initial data
const INITIAL_WORKSPACES: Workspace[] = [
    {
        id: 'ws-1',
        name: 'Default Workspace',
        description: 'Your default workspace',
        createdAt: new Date().toISOString(),
    },
];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
        INITIAL_WORKSPACES[0]
    );

    // Load from local storage on mount
    useEffect(() => {
        const storedWorkspaces = localStorage.getItem('verdify_workspaces');
        const storedCurrent = localStorage.getItem('verdify_current_workspace');

        if (storedWorkspaces) {
            try {
                const parsed = JSON.parse(storedWorkspaces);
                setWorkspaces(parsed.length > 0 ? parsed : INITIAL_WORKSPACES);
            } catch (e) {
                console.error("Failed to parse workspaces", e);
            }
        }

        if (storedCurrent) {
            try {
                const parsed = JSON.parse(storedCurrent);
                setCurrentWorkspace(parsed);
            } catch (e) {
                console.error("Failed to parse current workspace", e);
            }
        }
    }, []);

    // Sync workspaces to local storage
    useEffect(() => {
        localStorage.setItem('verdify_workspaces', JSON.stringify(workspaces));
    }, [workspaces]);

    // Sync current workspace
    useEffect(() => {
        if (currentWorkspace) {
            localStorage.setItem('verdify_current_workspace', JSON.stringify(currentWorkspace));
        }
    }, [currentWorkspace]);

    const createWorkspace = (newWorkspaceData: Omit<Workspace, 'id' | 'createdAt'>) => {
        const newWorkspace: Workspace = {
            ...newWorkspaceData,
            id: `ws-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setWorkspaces((prev) => [...prev, newWorkspace]);
        setCurrentWorkspace(newWorkspace); // Auto-switch to new workspace
    };

    return (
        <WorkspaceContext.Provider
            value={{
                workspaces,
                currentWorkspace,
                setCurrentWorkspace,
                createWorkspace,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}
