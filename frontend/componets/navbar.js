import Link from 'next/link';
import GoogleButton from '@/componets/google/google_button';

export default function Navbar() {
  
  return (
    <nav className="navbar">
  <div className="nav_style">
    <ul className="ul_nav_style">
      <li><Link href="/home" >Home</Link></li>
      <li><Link href="/about" >About</Link></li>
      <li><Link href="/start-trip" >Start Trip</Link></li>
      <li><Link href="/result" >Results</Link></li>
    </ul>

    <div className='nav_google'>
      <GoogleButton />
    </div>
  </div>
</nav>

  );
}
