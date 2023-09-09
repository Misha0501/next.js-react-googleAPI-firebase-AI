import ProfilePageMainContent from "@/app/components/ProfilePageMainContent";
import { redirectToSignInIfNotLoggedInSSR } from "@/app/lib/redirectToSignInIfNotLoggedInSSR";

type Props = {
  params: {
    tab: string;
  };
};
export default async function ProfilePage({ params: { tab } }: Props) {
  await redirectToSignInIfNotLoggedInSSR();

  return (
    <div className="container mx-auto">
      <ProfilePageMainContent tab={tab}></ProfilePageMainContent>
    </div>
  );
}