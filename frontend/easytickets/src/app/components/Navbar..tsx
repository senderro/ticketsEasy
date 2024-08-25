import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link href="/" style={styles.logoLink}>
          EasyTickets
        </Link>
      </div>
      <div style={styles.navLinks}>
        <Link href="/pages/meusIngressos" style={styles.link}>Meus Ingressos</Link>
        <Link href="/pages/shows" style={styles.link}>Shows</Link>
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
    backgroundColor: 'transparent', // Fundo transparente
    color: '#fff', // Texto branco
    width: '100%', // Para ocupar toda a largura da tela
    top: 0, // Fixa no topo da página
    zIndex: 1000, // Garante que a navbar fique acima de outros elementos
  },
  logo: {
    fontSize: '24px',
    flex: 1,
  },
  logoLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '48px',
    fontWeight: 'bold',
    
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
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '8px 16px',
    borderRadius: '8px', // Letras arredondadas
    backgroundColor: 'transparent', // Fundo transparente para os links também
  },
  connectButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '5px', // Ajuste o padding conforme necessário
  }
};
