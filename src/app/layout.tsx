import "@/assets/styles/globals.css"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import TrpcProvider from "@/components/providers/trpcProvider"
import { ThemeProvider } from "@/components/providers/themeProvider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background p-5 font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TrpcProvider>{children}</TrpcProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
