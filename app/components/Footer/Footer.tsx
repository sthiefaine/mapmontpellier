import Link from 'next/link'
import styles from './footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link href="https://thiefaine.dev" >dev Thiefaine</Link>
    </footer>
  )
}