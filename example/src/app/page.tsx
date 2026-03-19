import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>next-nav-guard Example</h1>

        <div>
          <ol>
            <li>
              <Link href="/page1">Page 1</Link>
            </li>
            <li>
              <Link href="/page2">Page 2</Link>
            </li>
            <li>
              <Link href="/page3">Page 3</Link>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
