import { ContentContainer } from '@/components/ContentContainer';
import { MainLayout } from '@/layouts/MainLayout';
import DashboardTopPanel from '@/modules/dashboard/DashboardTopPanel';

export default function Home() {
  return (
    <>
      <DashboardTopPanel />
      <ContentContainer>4444</ContentContainer>
    </>
  )
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
