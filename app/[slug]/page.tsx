import ViewCard from "@/components/ViewCard";

const Page = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <ViewCard slug={slug} />;
};

export default Page;