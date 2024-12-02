import { ContentContainer } from "@/components/ContentContainer";
import { MainLayout } from "@/layouts/MainLayout";



export default function Home() {
  return <ContentContainer>1</ContentContainer>;
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
