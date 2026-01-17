import { useWorkerConfigs, useWorkerControl } from '@/swr/workerConfig.swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/formatters/formatDate';
import { EditWorkerConfigDialog } from './EditWorkerConfigDialog';

export default function WorkerStatusCard() {
    const { configs, isLoading } = useWorkerConfigs();
    const { startWorker, stopWorker, pauseWorker, updatePollInterval } = useWorkerControl();

    // Use the first config or default
    const config = configs.length > 0 ? configs[0] : null;

    if (isLoading) {
        return <Skeleton className="w-full h-[200px]" />;
    }

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'RUNNING': return 'bg-green-500 hover:bg-green-600';
            case 'PAUSED': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'STOPPED': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            RSS Worker Status
                        </CardTitle>
                        <CardDescription>
                            Control the background RSS feed collection process
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {config?.status === 'RUNNING' && (
                            <span className="relative flex h-3 w-3 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        )}
                        {config && (
                            <Badge className={`${getStatusColor(config.status)} text-white`}>
                                {config.status}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div>
                                <p className="text-muted-foreground">Poll Interval</p>
                                <p className="font-medium">{config?.pollInterval || 300} seconds</p>
                            </div>
                            {config && (
                                <EditWorkerConfigDialog
                                    config={config}
                                    onUpdate={updatePollInterval}
                                />
                            )}
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Run</p>
                            <p className="font-medium">{config?.lastRun ? formatDate(new Date(config.lastRun), "MMM d, yyyy HH:mm") : 'Never'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Next Run</p>
                            <p className="font-medium">{config?.nextRun ? formatDate(new Date(config.nextRun), "MMM d, yyyy HH:mm") : 'Not scheduled'}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20 border-green-200"
                            onClick={startWorker}
                            disabled={config?.status === 'RUNNING'}
                        >
                            <Play className="h-4 w-4" /> Start
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 border-yellow-200"
                            onClick={pauseWorker}
                            disabled={config?.status !== 'RUNNING'}
                        >
                            <Pause className="h-4 w-4" /> Pause
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200"
                            onClick={stopWorker}
                            disabled={config?.status === 'STOPPED'}
                        >
                            <Square className="h-4 w-4" /> Stop
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
