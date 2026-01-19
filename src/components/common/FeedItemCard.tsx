import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  MoreHorizontal,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Link as LinkIcon,
  Image,
  Rss,
  Tag,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FeedItemResponse } from '@/dto/feedItem.dto';
import certBE from '@/assets/images/feeds/cert_belgium.png';
import Anssi from '@/assets/images/feeds/ansii_image.png';
import canada from '@/assets/images/feeds/candaiamage.jpeg';
import cisa from '@/assets/images/feeds/CISA-logo-B.jpeg';
import itconnect from '@/assets/images/feeds/it-connect.png';
import cerist from '@/assets/images/feeds/cerist.png';
import ncsc from '@/assets/images/feeds/nscsd.webp';
import austria from '@/assets/images/feeds/cert_at.png';
import defaultFeedImage from '@/assets/images/feeds/default.jpeg';
import ManageTagsDialog from '@/pages/FeedItems/ManageTagsDialog';
import SummaryDialog from '@/pages/FeedItems/SummaryDialog';
import AlertBulletinDialog from '@/pages/FeedItems/AlertBulletinDialog';

interface FeedItemCardProps {
  item: FeedItemResponse;
  onReadStatusChange?: (itemId: string, status: boolean) => void;
  onDelete?: (itemId: string) => void;
  onTagsUpdated?: (updatedItem: FeedItemResponse) => void;
}

const FeedItemCard = ({ item, onReadStatusChange, onDelete, onTagsUpdated }: FeedItemCardProps) => {
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isBulletinDialogOpen, setIsBulletinDialogOpen] = useState(false);

  const handleReadToggle = () => {
    onReadStatusChange?.(item.itemId, !item.readStatus);
  };
  const feedImageMap = useMemo(() => ({
    // Map specific feed IDs to specific images
    'c68dd070-79f8-4681-b495-6391fd789576': certBE,
    '5580d533-64d5-4d15-946f-a850a87d1ad7': canada,
    'd129e7a5-8665-4e26-b564-3d0d7fa5785d': Anssi,
    'dc93ea7c-af92-4acf-9ff8-5f998b3f0867': cisa,
    '3e002689-b8a1-4326-959d-2ef371d66151': itconnect,
    'bdc7aea6-aabb-4c92-a273-09bd584858c0': cerist,
    'bbd60a30-fab4-42d3-a97f-44b6ae2e85ad': cisa,
    'd85205e7-8c41-47d6-a4d0-f6aaa27b0fa6': ncsc,
    'a044601d-c060-4f80-b696-5ac4db42149c': austria,

    // Add more mappings as needed
  }), []);

  const getFeedImage = () => {
    const feedId = item.feedId;


    if (feedId && feedImageMap[feedId]) {
      return feedImageMap[feedId];
    }

    return defaultFeedImage;
  };


  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No date';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(item.link);
  };

  const ImageContainer = () => (
    <div className="w-full h-48 relative">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title || 'Feed item'}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = getFeedImage();
          }}
        />
      ) : (
        <img
          src={getFeedImage()}
          alt={item.title || 'Feed item'}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      )}

      {/* Status indicator and dropdown - Positioned over the image/placeholder */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-background/80 rounded-full p-1">
              {item.readStatus ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {item.readStatus ? 'Read' : 'Unread'}
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleReadToggle}>
              Marquer comme {item.readStatus ? 'non lu' : 'lu'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copier le lien
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsTagsDialogOpen(true)}>
              <Tag className="mr-2 h-4 w-4" />
              Gérer les tags
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsSummaryDialogOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Résumer avec l'IA
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsBulletinDialogOpen(true)}>
              <ShieldAlert className="mr-2 h-4 w-4" />
              Générer Bulletin d'Alerte
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(item.itemId)}
              >
                Supprimer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Source badge - Positioned over the image/placeholder */}
      <div className="absolute bottom-2 left-2 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className="bg-background/80 hover:bg-background/90 transition-colors flex items-center gap-1"
            >
              <Rss className="h-3 w-3" />
              <span className="truncate max-w-[200px]">{item.feed?.title || 'Unknown Feed'}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {item.feed?.title || 'Unknown Feed'}
          </TooltipContent>

        </Tooltip>
      </div>
    </div>
  );

  return (
    <>
      <Card className="group relative hover:shadow-lg transition-all duration-300 overflow-hidden">
        <ImageContainer />

        <CardHeader className="pt-4">
          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
            {item.title || 'Untitled'}
          </CardTitle>

          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(item.publishedDate)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(item.content, 200) || 'No content available'}
          </p>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag) => (
                <Badge
                  key={tag.tagId}
                  variant="secondary"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : undefined,
                    color: tag.color,
                  }}
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(item.link, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            Read More
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReadToggle}
            className={item.readStatus ? 'text-green-500' : 'text-yellow-500'}
          >
            {item.readStatus ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            {item.readStatus ? 'Read' : 'Unread'}
          </Button>
        </CardFooter>
      </Card>

      <ManageTagsDialog
        item={item}
        isOpen={isTagsDialogOpen}
        onOpenChange={setIsTagsDialogOpen}
        onTagsUpdated={onTagsUpdated}
      />

      <SummaryDialog
        itemId={item.itemId}
        itemTitle={item.title || 'Untitled'}
        isOpen={isSummaryDialogOpen}
        onOpenChange={setIsSummaryDialogOpen}
      />

      <AlertBulletinDialog
        itemId={item.itemId}
        itemTitle={item.title || 'Untitled'}
        isOpen={isBulletinDialogOpen}
        onOpenChange={setIsBulletinDialogOpen}
      />
    </>
  );
};

export default FeedItemCard;