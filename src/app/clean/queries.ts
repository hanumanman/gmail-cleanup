import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { IGmail } from "./types"

interface GetMailsResponse {
  messages: IGmail[]
  nextPageToken: string | null
}

const MAIL_QUERY_KEY = "getMails"

export const useGetMails = (pageToken?: string, labels?: string) => {
  const queryFn = async () => {
    const res = await axios.get<GetMailsResponse>(`/api/gmail/messages`, {
      params: {
        pageToken,
        labels,
      },
    })
    return res.data
  }

  return useQuery({
    queryKey: [MAIL_QUERY_KEY, pageToken, labels],
    queryFn,
  })
}

interface ILabel {
  id: string
  name: string
  messageListVisibility: string
  labelListVisibility: string
  type: string
}

const LABELS_QUERY_KEY = "getLabels"

export const useGetLabels = () => {
  const queryFn = async () => {
    const res = await axios.get<ILabel[]>("/api/gmail/labels")
    return res.data
  }

  return useQuery({
    queryKey: [LABELS_QUERY_KEY],
    queryFn,
  })
}
