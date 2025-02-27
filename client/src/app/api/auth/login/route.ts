import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // In a real application, you would validate the credentials against your database
    if (email === "user@example.com" && password === "password") {
      const user = {
        id: "1",
        name: "John Doe",
        email: "user@example.com",
        role: "buyer",
      }

      const response = NextResponse.json(user)
      response.cookies.set("authToken", "dummy_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour
        path: "/",
      })

      return response
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

