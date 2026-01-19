import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { feedItemsApi } from '@/api/feedItems.api';
import { showToast } from '@/utils/showToast';

interface SummaryDialogProps {
    itemId: string;
    itemTitle: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    cachedSummary?: string;
}

const SummaryDialog: React.FC<SummaryDialogProps> = ({
    itemId,
    itemTitle,
    isOpen,
    onOpenChange,
    cachedSummary,
}) => {
    const [summary, setSummary] = useState<string | null>(cachedSummary || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const isMobile = useIsMobile();
    const width = window.innerWidth - 2 * 16;

    useEffect(() => {
        if (isOpen && !summary && !isLoading) {
            generateSummary(false);
        }
    }, [isOpen]);

    const generateSummary = async (forceRegenerate: boolean) => {
        setIsLoading(true);
        try {
            const response = await feedItemsApi.summarize(itemId, forceRegenerate);
            if (response.status === 'success') {
                setSummary(response.data.summary);
                if (forceRegenerate) {
                    showToast('success', 'Summary regenerated successfully');
                }
            } else {
                throw new Error(response.message || 'Failed to generate summary');
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
            showToast('error', 'Failed to generate AI summary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (summary) {
            await navigator.clipboard.writeText(summary);
            setIsCopied(true);
            showToast('success', 'Summary copied to clipboard');
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleRegenerate = () => {
        generateSummary(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent style={isMobile ? { width: width } : { minWidth: 500 }}>
                <DialogHeader className="px-6 py-4 bg-muted text-foreground">
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Summary
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-5 text-foreground">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {itemTitle}
                    </p>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Generating AI summary...
                            </p>
                            <p className="text-muted-foreground/60 text-xs">
                                Analyzing article content with Gemini
                            </p>
                        </div>
                    ) : summary ? (
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                {summary.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-3 last:mb-0 text-sm leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                            <p>No summary available</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t">

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                disabled={!summary || isLoading}
                            >
                                {isCopied ? (
                                    <Check className="h-4 w-4 mr-2" />
                                ) : (
                                    <Copy className="h-4 w-4 mr-2" />
                                )}
                                {isCopied ? 'Copied' : 'Copy'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRegenerate}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Regenerate
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SummaryDialog;
