import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <h1>EasyTickets</h1>
      </div>
      <div style={styles.navLinks}>
        <Link href="/meusIngressos" style={styles.link}>Meus Ingressos</Link>
        <Link href="/buscarShows" style={styles.link}>Buscar Shows</Link>
      </div>
      <div style={styles.connectButton}>
        <ConnectButton/>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  logo: {
    fontSize: '24px',
    flex: 1,
  },
  navLinks: {
    display: 'flex',
    justifyContent: 'center',
    flex: 2,
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
  connectButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '5px', // Ajuste o padding conforme necessário
  }
};
