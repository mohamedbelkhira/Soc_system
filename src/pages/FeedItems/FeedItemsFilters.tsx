import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomDatePicker from "@/components/CustomDatePicker";
import { FeedResponse } from "@/dto/feed.dto";
import { FeedItemFilteringParams } from "./useFeedItemsFilters";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";
import TagsMultiSelect from "@/components/common/TagsMultiSelect";
import { useTags } from "@/swr/tags.swr";

interface FeedItemsFiltersProps {
  filters: FeedItemFilteringParams;
  setFilter: (key: keyof FeedItemFilteringParams, value: string | boolean | Date | string[] | null | undefined) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  feeds: FeedResponse[];
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
}

const READ_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "true", label: "Read" },
  { value: "false", label: "Unread" },
];

export default function FeedItemsFilters({
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
  feeds,
  searchInputValue,
  setSearchInputValue,
}: FeedItemsFiltersProps) {
  // Get available tags for the filter
  const { tags } = useTags();

  // Local state for search input with submit functionality
  const [localSearchValue, setLocalSearchValue] = useState(searchInputValue);

  // Update local search when props change
  useEffect(() => {
    setLocalSearchValue(searchInputValue);
  }, [searchInputValue]);

  const handleFeedChange = (value: string) => {
    setFilter("feedId", value === "all" ? null : value);
  };

  const handleReadStatusChange = (value: string) => {
    if (value === "all") {
      setFilter("readStatus", null);
    } else {
      setFilter("readStatus", value === "true");
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date && filters.endDate && date > filters.endDate) {
      setFilter("startDate", filters.endDate);
      setFilter("endDate", date);
    } else {
      setFilter("startDate", date || null);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && filters.startDate && date < filters.startDate) {
      setFilter("endDate", filters.startDate);
      setFilter("startDate", date);
    } else {
      setFilter("endDate", date || null);
    }
  };

  // Handle local search input changes
  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
  };

  // Submit search filter directly (no debounce)
  const handleSubmitSearch = () => {
    setSearchInputValue(localSearchValue);
    setFilter("searchTerm", localSearchValue || null);
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitSearch();
    }
  };

  // Clear a specific filter
  const handleClearFilter = (key: keyof FeedItemFilteringParams) => {
    if (key === "searchTerm") {
      setLocalSearchValue("");
      setSearchInputValue("");
    }
    setFilter(key, null);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feed Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">
              Filter by Feed
            </label>
            <Select
              value={filters.feedId || "all"}
              onValueChange={handleFeedChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Feed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feeds</SelectItem>
                {feeds.map((feed) => (
                  <SelectItem key={feed.feedId} value={feed.feedId}>
                    {feed.title || feed.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Read Status Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">
              Filter by Status
            </label>
            <Select
              value={filters.readStatus !== undefined ? String(filters.readStatus) : "all"}
              onValueChange={handleReadStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {READ_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date Filter */}
          <div className="flex flex-col space-y-1">
            <CustomDatePicker
              label="Starting day"
              date={filters.startDate}
              onChange={handleStartDateChange}
            />
          </div>

          {/* End Date Filter */}
          <div className="flex flex-col space-y-1">
            <CustomDatePicker
              label="End day"
              date={filters.endDate}
              onChange={handleEndDateChange}
            />
          </div>

          {/* Tags Filter */}
          <div className="flex flex-col space-y-1 lg:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Filter by Tags
            </label>
            <TagsMultiSelect
              value={filters.tagIds || []}
              onChange={(tagIds) => setFilter("tagIds", tagIds.length > 0 ? tagIds : null)}
              placeholder="Select tags..."
            />
          </div>

          {/*change this component with a shadcn component*/}
          <div className="flex flex-col space-y-1 col-span-full">
            <label className="text-sm font-medium text-foreground">
              Search
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={localSearchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by word in title or description..."
                  className="w-full px-3 py-2 border text-foreground bg-background border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                />
              </div>
              <Button
                onClick={handleSubmitSearch}
                type="button"
                variant="secondary"
                className="flex gap-1 items-center"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value !== undefined && value !== null) {
                let displayValue: string;
                let displayKey: string = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                if (key === "readStatus") {
                  displayValue = value ? "Read" : "Unread";
                  displayKey = "Status";
                } else if (key === "feedId") {
                  const feed = feeds.find(f => f.feedId === value);
                  displayValue = feed ? (feed.title || feed.url) : value as string;
                  displayKey = "Feed";
                } else if (key === "startDate") {
                  displayValue = new Date(value as Date).toLocaleDateString();
                  displayKey = "From";
                } else if (key === "endDate") {
                  displayValue = new Date(value as Date).toLocaleDateString();
                  displayKey = "To";
                } else if (key === "tagIds") {
                  const tagNames = (value as string[]).map(tagId => {
                    const tag = tags.find(t => t.tagId === tagId);
                    return tag?.name || tagId;
                  });
                  displayValue = tagNames.join(", ");
                  displayKey = "Tags";
                } else if (key === "searchTerm") {
                  displayValue = String(value);
                  displayKey = "Search";
                } else {
                  displayValue = String(value);
                }

                return (
                  <Badge key={key} className="flex items-center gap-1 px-2 py-1">
                    {displayKey}: {displayValue}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleClearFilter(key as keyof FeedItemFilteringParams)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              }
              return null;
            })}

            <Button
              variant="destructive"
              size="sm"
              onClick={clearFilters}
              className="ml-auto"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}