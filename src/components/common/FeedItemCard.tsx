import React from 'react';
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
  Rss
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

interface FeedItemCardProps {
  item: FeedItemResponse;
  onReadStatusChange?: (itemId: string, status: boolean) => void;
  onDelete?: (itemId: string) => void;
}

const FeedItemCard = ({ item, onReadStatusChange, onDelete }: FeedItemCardProps) => {
  const handleReadToggle = () => {
    onReadStatusChange?.(item.itemId, !item.readStatus);
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
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <div className="text-center">
            <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-2">No image available</p>
          </div>
        </div>
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
              Mark as {item.readStatus ? 'unread' : 'read'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(item.itemId)}
              >
                Delete
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
  );
};

export default FeedItemCard;