import {redirectToSignInIfNotLoggedInSSR} from "@/app/lib/redirectToSignInIfNotLoggedInSSR";
import {GoBackBtn} from "@/app/components/GoBackBtn";
import {SavedItemsPageTabs} from "@/app/components/SavedItemsPageTabs";

async function SavedItemsPage() {
    await redirectToSignInIfNotLoggedInSSR();

    return (
        <div className={'container'}>
            <div className="py-16">
                <GoBackBtn className={"mb-5"}></GoBackBtn>
                <p className={"font-bold text-4xl"}>Saved</p>
                <SavedItemsPageTabs></SavedItemsPageTabs>
            </div>
        </div>

    );
}

export default SavedItemsPage;
