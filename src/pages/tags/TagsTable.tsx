import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TagResponse } from '@/dto/tag.dto';
import { useAuth } from '@/contexts/auth-provider';
import CheckPermission from '@/components/common/CheckPermission';
import { Permission } from '@/types/permission.enum';
import TableWrapper from '@/components/common/TableWrapper';
import UpdateTagDialog from './update/UpdateTagDialog';
import DeleteTagDialog from './delete/DeleteTagDialog';
import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon } from 'lucide-react';

interface TagsTableProps {
    isLoading: boolean;
    tags: TagResponse[];
    onRefresh: () => void;
}

const TagsTable: React.FC<TagsTableProps> = ({ isLoading, tags, onRefresh }) => {
    const { user } = useAuth();

    if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

    return (
        <TableWrapper>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Aperçu</TableHead>
                        <TableHead className="w-[300px]">Nom</TableHead>
                        <TableHead className="w-[150px]">Couleur</TableHead>
                        <TableHead className="text-right w-[150px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tags.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-12">
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <TagIcon className="h-12 w-12 opacity-20" />
                                    <p>Aucun tag trouvé</p>
                                    <p className="text-sm">Créez votre premier tag pour organiser vos flux</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        tags.map((tag) => (
                            <TableRow key={tag.tagId}>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        style={{
                                            backgroundColor: tag.color ? `${tag.color}20` : undefined,
                                            color: tag.color || undefined,
                                            borderColor: tag.color || undefined,
                                        }}
                                        className="border"
                                    >
                                        {tag.name}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full border border-border shadow-sm"
                                            style={{ backgroundColor: tag.color || '#6B7280' }}
                                        />
                                        {tag.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                        {tag.color || 'Non définie'}
                                    </code>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <CheckPermission
                                            requiredPermission={Permission.SETTINGS_EDIT}
                                            grantedPermissions={user?.permissions}
                                        >
                                            <UpdateTagDialog tag={tag} onSuccess={onRefresh} />
                                        </CheckPermission>
                                        <CheckPermission
                                            requiredPermission={Permission.SETTINGS_DELETE}
                                            grantedPermissions={user?.permissions}
                                        >
                                            <DeleteTagDialog tag={tag} onSuccess={onRefresh} />
                                        </CheckPermission>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableWrapper>
    );
};

export default TagsTable;
