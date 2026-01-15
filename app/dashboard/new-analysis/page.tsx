'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import NewAnalysisWizard from '@/components/views/NewAnalysisWizard';
import ProcessingScreen from '@/components/views/ProcessingScreen';

export default function NewAnalysisPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [selectedGeoJSON, setSelectedGeoJSON] = React.useState<GeoJSON.Feature | null>(null);

    if (isProcessing) {
        return (
            <ProcessingScreen
                onFinish={() => router.push('/dashboard')}
                initialGeoJSON={selectedGeoJSON}
            />
        );
    }

    return (
        <NewAnalysisWizard
            onCancel={() => router.push('/dashboard')}
            onStart={(geojson) => {
                console.log('Analysis started with', geojson);
                setSelectedGeoJSON(geojson);
                setIsProcessing(true);
            }}
        />
    );
}
