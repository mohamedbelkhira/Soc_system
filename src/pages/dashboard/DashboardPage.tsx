import { useDashboardStats } from '@/swr/dashboard.swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, BookOpen, Layers, Rss } from 'lucide-react';
import { ReadRatioChart } from './components/ReadRatioChart';
import { TimelineChart } from './components/TimelineChart';
import { SourceDistributionChart } from './components/SourceDistributionChart';

export default function DashboardPage() {
    const { stats, isLoading } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[120px] w-full" />
                    ))}
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (!stats) return <div>Failed to load stats</div>;

    const { general, timeline, sources } = stats;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your RSS feed collection.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{general.totalArticles}</div>
                        <p className="text-xs text-muted-foreground">Collected over time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Feeds</CardTitle>
                        <Rss className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{general.activeFeeds}</div>
                        <p className="text-xs text-muted-foreground">Monitored sources</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Read Articles</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{general.readArticles}</div>
                        <p className="text-xs text-muted-foreground">
                            {((general.readArticles / general.totalArticles) * 100).toFixed(1)}% of total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Activity</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{timeline.length > 0 ? timeline[timeline.length - 1].count : 0}</div>
                        <p className="text-xs text-muted-foreground">Articles today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-7">
                <div className="col-span-4 md:col-span-7">
                    <TimelineChart data={timeline} />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3 md:col-span-4 lg:col-span-4">
                    <SourceDistributionChart data={sources} />
                </div>
                <div className="col-span-3 md:col-span-3 lg:col-span-3">
                    <ReadRatioChart read={general.readArticles} unread={general.unreadArticles} />
                </div>
            </div>
        </div>
    );
}
