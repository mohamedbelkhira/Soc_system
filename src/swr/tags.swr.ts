import useSWR from 'swr';
import { tagsApi } from '@/api/tags.api';
import { TagResponse, CreateTagDTO, UpdateTagDTO } from '@/dto/tag.dto';
import { showToast } from '@/utils/showToast';

const TAGS_KEY = '/api/tags';

// Fetcher function for SWR
const tagsFetcher = async (): Promise<TagResponse[]> => {
    const response = await tagsApi.getAll();
    if (response.status === 'success') {
        return response.data;
    }
    throw new Error(response.message || 'Failed to fetch tags');
};

// Hook to get all tags
export function useTags() {
    const { data, error, isLoading, mutate } = useSWR<TagResponse[]>(
        TAGS_KEY,
        tagsFetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    return {
        tags: data || [],
        isLoading,
        error,
        mutate,
    };
}

// Hook to create a tag
export function useCreateTag() {
    const { mutate } = useTags();

    const createTag = async (data: CreateTagDTO): Promise<TagResponse> => {
        try {
            const response = await tagsApi.create(data);
            if (response.status === 'success') {
                showToast('success', 'Tag créé avec succès');
                await mutate();
                return response.data;
            }
            throw new Error(response.message || 'Failed to create tag');
        } catch (error) {
            showToast('error', 'Erreur lors de la création du tag');
            throw error;
        }
    };

    return { createTag };
}

// Hook to update a tag
export function useUpdateTag() {
    const { mutate } = useTags();

    const updateTag = async (tagId: string, data: UpdateTagDTO): Promise<TagResponse> => {
        try {
            const response = await tagsApi.update(tagId, data);
            if (response.status === 'success') {
                showToast('success', 'Tag mis à jour avec succès');
                await mutate();
                return response.data;
            }
            throw new Error(response.message || 'Failed to update tag');
        } catch (error) {
            showToast('error', 'Erreur lors de la mise à jour du tag');
            throw error;
        }
    };

    return { updateTag };
}

// Hook to delete a tag
export function useDeleteTag() {
    const { mutate } = useTags();

    const deleteTag = async (tagId: string): Promise<void> => {
        try {
            const response = await tagsApi.delete(tagId);
            if (response.status === 'success') {
                showToast('success', 'Tag supprimé avec succès');
                await mutate();
                return;
            }
            throw new Error(response.message || 'Failed to delete tag');
        } catch (error) {
            showToast('error', 'Erreur lors de la suppression du tag');
            throw error;
        }
    };

    return { deleteTag };
}
