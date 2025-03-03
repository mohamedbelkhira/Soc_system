import React from "react";
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
import { X } from "lucide-react";
import SearchInput from "@/components/common/SearchInput";
import { useDebounce } from "@/hooks/use-debounce";

interface FeedItemsFiltersProps {
  filters: FeedItemFilteringParams;
  setFilter: (key: keyof FeedItemFilteringParams, value: string | boolean | Date | null | undefined) => void;
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

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    // Update the controlled input value immediately
    setSearchInputValue(value);
  };

  // Use the debounce hook with the controlled value
  useDebounce(
    searchInputValue,
    400,
    (debouncedValue) => {
      // Only update the filter if the debounced value is different from current filter
      setFilter("searchTerm", debouncedValue || null);
    }
  );

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
              label="starting day"
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

          {/* Search Term */}
          <div className="flex flex-col space-y-1 col-span-full">
            <SearchInput
              value={searchInputValue}
              onChange={handleSearchChange}
              label="Recherche"
              placeholder="Chercher par mot dans le titre ou description..."
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value !== undefined && value !== null) {
                let displayValue: string;
                
                if (key === "readStatus") {
                  displayValue = value ? "Read" : "Unread";
                } else if (key === "feedId") {
                  const feed = feeds.find(f => f.feedId === value);
                  displayValue = feed ? (feed.title || feed.url) : value as string;
                } else if (key === "startDate" || key === "endDate") {
                  displayValue = new Date(value as Date).toLocaleDateString();
                } else {
                  displayValue = String(value);
                }

                return (
                  <Badge key={key} className="flex items-center gap-1 px-2 py-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {displayValue}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setFilter(key as keyof FeedItemFilteringParams, null)}
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