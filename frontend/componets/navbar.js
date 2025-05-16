import Link from 'next/link';
import GoogleButton from '@/componets/google/google_button';

export default function Navbar() {
  
  return (
    <nav style={styles.nav}>
  <div style={styles.container}>
    <ul style={styles.ul}>
      <li><Link href="/home" style={styles.link}>Home</Link></li>
      <li><Link href="/about" style={styles.link}>About</Link></li>
      <li><Link href="/start-trip" style={styles.link}>Start Trip</Link></li>
      <li><Link href="/result" style={styles.link}>Results</Link></li>
    </ul>

    <div style={styles.googleButtonWrapper}>
      <GoogleButton />
    </div>
  </div>
</nav>

  );
}
const styles = {
  nav: {
    background: '#0f172a',
    padding: '15px',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    marginLeft : '215px',
  },
  ul: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    listStyle: 'none',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    paddingLeft: 0,
    flexGrow: 1,
    gap: '1.5rem',
    fontSize: '1.2rem', 

  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  googleButtonWrapper: {
    marginLeft: 'auto',
  },
};
