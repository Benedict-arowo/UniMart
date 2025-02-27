import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const authToken = cookieStore.get("authToken")

  if (authToken) {
    // In a real application, you would validate the token and fetch the user data
    const user = {
      id: "1",
      name: "John Doe",
      email: "user@example.com",
      role: "buyer",
    }

    return NextResponse.json(user)
  }

  return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
}

