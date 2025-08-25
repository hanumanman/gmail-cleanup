import {
  DeleteMailsRequest,
  DeleteMailsResponse,
  GetLabelsResponse,
  GetMailsResponse,
  ILabel,
} from "@/types/gmail"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const MAIL_QUERY_KEY = "getMails"

export const useGetMails = (
  pageToken?: string,
  labels?: string[],
  inverse?: boolean
) => {
  const queryFn = async () => {
    const res = await axios.get<GetMailsResponse>(`/api/gmail/messages`, {
      params: {
        pageToken,
        labels: labels?.length ? labels.join(",") : undefined,
        inverse: inverse || undefined,
      },
    })
    return res.data
  }

  return useQuery({
    queryKey: [MAIL_QUERY_KEY, pageToken, labels, inverse],
    queryFn,
  })
}

const LABELS_QUERY_KEY = "getLabels"

export const useGetLabels = () => {
  const queryFn = async (): Promise<ILabel[]> => {
    const res = await axios.get<GetLabelsResponse>("/api/gmail/labels")
    return res.data.labels
  }

  return useQuery({
    queryKey: [LABELS_QUERY_KEY],
    queryFn,
  })
}

export const useDeleteMails = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageIds, labels, inverse }: DeleteMailsRequest) => {
      const res = await axios.delete<DeleteMailsResponse>(
        "/api/gmail/messages",
        {
          data: { messageIds, labels, inverse },
        }
      )
      return res.data
    },
    onSuccess: () => {
      // Invalidate and refetch mail queries to update the UI
      queryClient.invalidateQueries({ queryKey: [MAIL_QUERY_KEY] })
    },
  })
}

export const useDeleteAllFilteredMails = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      labels,
      inverse,
    }: {
      labels: string[]
      inverse?: boolean
    }) => {
      // For bulk delete, we send a dummy messageId array (required by API)
      // but the actual deletion is based on labels
      const res = await axios.delete<DeleteMailsResponse>(
        "/api/gmail/messages",
        {
          data: { messageIds: ["dummy"], labels, inverse },
        }
      )
      return res.data
    },
    onSuccess: () => {
      // Invalidate and refetch mail queries to update the UI
      queryClient.invalidateQueries({ queryKey: [MAIL_QUERY_KEY] })
    },
  })
}
