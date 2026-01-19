import React, { useState, useEffect } from 'react';
import { Loader2, ShieldAlert, Copy, Check, FileText } from 'lucide-react';
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

interface AlertBulletinDialogProps {
    itemId: string;
    itemTitle: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const AlertBulletinDialog: React.FC<AlertBulletinDialogProps> = ({
    itemId,
    itemTitle,
    isOpen,
    onOpenChange,
}) => {
    const [bulletin, setBulletin] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const isMobile = useIsMobile();
    const width = window.innerWidth - 2 * 16;

    useEffect(() => {
        if (isOpen && !bulletin && !isLoading) {
            generateBulletin();
        }
    }, [isOpen]);

    const generateBulletin = async () => {
        setIsLoading(true);
        try {
            const response = await feedItemsApi.generateBulletin(itemId);
            if (response.status === 'success') {
                setBulletin(response.data.bulletin);
            } else {
                throw new Error(response.message || 'Failed to generate alert bulletin');
            }
        } catch (error) {
            console.error('Failed to generate bulletin:', error);
            showToast('error', 'Failed to generate Alert Bulletin. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (bulletin) {
            await navigator.clipboard.writeText(bulletin);
            setIsCopied(true);
            showToast('success', 'Bulletin copied to clipboard');
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent style={isMobile ? { width: width } : { minWidth: 600 }}>
                <DialogHeader className="px-6 py-4 bg-red-950/20 text-foreground border-b border-red-900/20">
                    <DialogTitle className="flex items-center gap-2 text-red-500">
                        <ShieldAlert className="h-5 w-5" />
                        Bulletin d'Alerte de Sécurité
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-5 text-foreground pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-medium">
                        {itemTitle}
                    </p>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                                <ShieldAlert className="h-10 w-10 animate-spin text-red-500 relative z-10" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Génération du bulletin en cours...
                            </p>
                            <p className="text-muted-foreground/60 text-xs">
                                Analyse de la vulnérabilité avec Gemini
                            </p>
                        </div>
                    ) : bulletin ? (
                        <ScrollArea className="h-[400px] w-full rounded-md border p-6 bg-card">
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-red-500 prose-headings:font-bold prose-strong:text-foreground">
                                {/* Use simple rendering since we don't have react-markdown installed yet, or check if it is installed */}
                                {bulletin.split('\n').map((line, i) => {
                                    if (line.startsWith('**') || line.startsWith('#')) {
                                        return <p key={i} className="font-bold text-red-400 mt-4 mb-2">{line.replace(/\*\*/g, '').replace(/#/g, '')}</p>;
                                    }
                                    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                                        return <li key={i} className="ml-4 mb-1 list-disc text-sm">{line.replace(/^[•-]\s*/, '')}</li>;
                                    }
                                    if (line.trim() === '---') {
                                        return <hr key={i} className="my-4 border-red-900/30" />;
                                    }
                                    return <p key={i} className="mb-2 text-sm">{line}</p>;
                                })}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mb-4 opacity-50" />
                            <p>Aucun bulletin disponible</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t">

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                disabled={!bulletin || isLoading}
                                className="border-red-900/30 hover:bg-red-950/20 hover:text-red-400"
                            >
                                {isCopied ? (
                                    <Check className="h-4 w-4 mr-2" />
                                ) : (
                                    <Copy className="h-4 w-4 mr-2" />
                                )}
                                {isCopied ? 'Copié' : 'Copier le bulletin'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AlertBulletinDialog;
