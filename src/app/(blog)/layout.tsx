import Navbar from '@/components/global/Navbar';
import Rightbar from '@/components/global/Rightbar';
import Sidebar from '@/components/global/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import '@/styles/globals.css';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex'>
      <Sidebar />
      <ScrollArea className='flex flex-col w-full h-screen overflow-y-auto'>
        <Navbar />
        {/* Mirrors the portfolio layout: content + rail capped at 1440px and
            centred, so very wide screens get even outer margins. */}
        <div className='w-screen md:w-full mx-auto max-w-[1440px] px-gutter pt-8 pb-section-sm flex flex-col xl:flex-row space-x-0 max-xl:space-y-section xl:space-x-12'>
          <div className='min-w-0 flex-1'>{children}</div>
          <Rightbar />
        </div>
      </ScrollArea>
    </div>
  );
}
