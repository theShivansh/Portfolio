import type { Metadata } from "next";
import { About } from "@/components/about/About";
import { Principles } from "@/components/architecture/Principles";
import { Contact } from "@/components/contact/Contact";
import styles from "../subpage.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Shivansh Shukla: AI engineer and full-stack builder. What I build, what I care about, and how I think.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <About as="h1" />
      <section className="section" aria-labelledby="principles-title">
        <div className="page sheet">
          <div className="margin" />
          <div className="body">
            <h2 id="principles-title" className={styles.h2}>
              How I think
            </h2>
            <Principles level="h3" />
          </div>
        </div>
      </section>
      <Contact />
    </main>
  );
}
