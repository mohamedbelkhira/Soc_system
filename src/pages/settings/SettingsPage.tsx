import React from 'react';
import WorkerStatusCard from './components/WorkerStatusCard';

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
                <p className="text-muted-foreground">
                    Gérer les paramètres du système et les processus d'arrière-plan.
                </p>
            </div>

            <div className="grid gap-6">
                <WorkerStatusCard />
            </div>
        </div>
    );
};

export default SettingsPage;
