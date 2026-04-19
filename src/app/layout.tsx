import { Toaster } from '@/components/ui/sonner';
import Provider from '@/providers/Provider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SanityLive } from '@/sanity/lib/live';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang='en' suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </ThemeProvider>
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
