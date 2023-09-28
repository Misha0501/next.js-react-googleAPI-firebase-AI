// import headerImg from '@/public/header-hero.jpg'
import headerImg from '@/public/header-hero.jpg'
import Image from 'next/image'
import {HomeHeroHeaderSearch} from "@/app/components/HomeHeroHeaderSearch";

export default async function Home() {
    return (
        <>
            <header className={'hero min-h-[700px] bg-black relative flex justify-center items-center pt-24 pb-16 text-white'}>
                <div className="container z-10">
                    <div className="hero__inner text-center">
                        <h1 className={"mb-16"}>Find your future home with ease TEST</h1>
                        <HomeHeroHeaderSearch></HomeHeroHeaderSearch>
                    </div>
                </div>
                <div className={'hero__img absolute inset-0 opacity-40'}>
                    <Image
                        className={"h-full w-full object-cover"}
                        width={1500}
                        height={1500}
                        src={headerImg}
                        alt="Picture of the author"
                        placeholder="blur" // Optional blur-up while loading
                    />
                </div>
            </header>
            <section className={"bg-amber-500 py-32"}>
                About us
            </section>
            <section className={"bg-gray-500 py-32"}>
                Highlighted properties
            </section>
        </>
    );
}
