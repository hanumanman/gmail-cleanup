"use server"
import { headers } from "next/headers"
import { auth } from "./auth"

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export async function getAccessToken() {
  return await auth.api.getAccessToken({
    body: {
      providerId: "google",
    },
    headers: await headers(),
  })
}
