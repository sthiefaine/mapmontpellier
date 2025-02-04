import styles from "./header.module.css";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Montpellier Map</h1>
      <ThemeSwitcher />
    </header>
  );
};
