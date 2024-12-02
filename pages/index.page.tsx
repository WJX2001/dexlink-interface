import { MainLayout } from "@/layouts/MainLayout";



export default function Home() {
  return <>1111111111</>;
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
