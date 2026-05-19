import NextAuth from "next-auth"

try {
  const { handlers } = NextAuth({
    secret: undefined,
    providers: []
  })
  console.log("No error on initialization!")
} catch (e) {
  console.error("Error on init:", e)
}
