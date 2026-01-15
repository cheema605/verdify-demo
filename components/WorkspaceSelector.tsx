import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Workspace } from '@/types';

interface WorkspaceSelectorProps {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    onSelectWorkspace: (workspace: Workspace) => void;
    onCreateWorkspace: () => void;
}

export function WorkspaceSelector({
    workspaces,
    currentWorkspace,
    onSelectWorkspace,
    onCreateWorkspace,
}: WorkspaceSelectorProps) {
    return (
        <Select
            value={currentWorkspace?.id}
            onValueChange={(value) => {
                const selected = workspaces.find((w) => w.id === value);
                if (selected) {
                    onSelectWorkspace(selected);
                }
            }}
        >
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Workspaces</SelectLabel>
                    {workspaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                            {workspace.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
                <SelectSeparator />
                <div className="p-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-8 px-2 text-xs"
                        onClick={(e) => {
                            e.preventDefault();
                            onCreateWorkspace();
                        }}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Workspace
                    </Button>
                </div>
            </SelectContent>
        </Select>
    );
}
