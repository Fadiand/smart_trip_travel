import Image from "next/image";
import Link from 'next/link';
import "@/styles/style.css";


export default function Home() {

    return (
        <>
            <main className="home">
                <div>
                    <Image src={"/images/plane-pic.jpg"}
                        alt="view pic"
                        height={600}
                        width={1536} />
                </div>
                <p>
                    Welcome to <span>Trip Planner</span> — your personal guide to the perfect trip.
                    We’ll help you find the best travel options based on price, weather, and unforgettable experiences.
                </p>
                <Link href="about" >
                  <button>More Information</button>
                </Link>
                
            </main>
        </>
    );
};