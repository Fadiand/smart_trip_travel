import Link from 'next/link';
import GoogleButton  from '@/componets/google/google_button';

export default function Navbar() {
  
  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li><Link href="/home" style={styles.link}>Home</Link></li>
        <li><Link href="/about" style={styles.link}>About</Link></li>
        <li><Link href="/start-trip" style={styles.link}>Start Trip</Link></li>
        <li><Link href="/result" style={styles.link}>Results</Link></li>
        <li><GoogleButton  /></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#0f172a',
    padding: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  },
  ul: {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#f1f5f9',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
};
