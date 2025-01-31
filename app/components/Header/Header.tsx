import styles from './header.module.css'

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Montpellier Map</h1>
      <button className={styles.button}>Click me</button>
    </header>
  )
}