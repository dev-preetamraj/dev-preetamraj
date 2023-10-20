import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Provider from '@/providers/Provider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Preetam Raj',
  description: 'A fullstack web developer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Provider>
            <div className='flex'>
              <Sidebar />
              <ScrollArea className='flex flex-col w-full h-screen overflow-y-auto'>
                <Navbar />
                <div className='w-screen md:w-full px-2 sm:px-4 md:px-10 py-4'>
                  {children}
                </div>
              </ScrollArea>
            </div>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
