import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ui } from "@/components/ui";
import { site, type InfoPageKey } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(site.pages).map((page) => ({ page }));
}

function pageFor(key: string) {
  return key in site.pages ? site.pages[key as InfoPageKey] : null;
}

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
  const { page } = await params;
  const content = pageFor(page);
  return content ? { title: content.title, alternates: { canonical: `/${page}` } } : {};
}

export default async function InfoPage({ params }: PageProps<"/[page]">) {
  const { page } = await params;
  const content = pageFor(page);
  if (!content) {
    notFound();
  }

  return (
    <article className={`${ui.container} max-w-3xl py-10`}>
      <h1 className={ui.h1}>{content.title}</h1>
      <div className="mt-8 grid gap-4 text-lg">
        {content.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {page === "contact" && (
        <p className="mt-8">
          <a className={ui.buttonPrimary} href={`mailto:${site.supportEmail}`}>E-mail {site.supportEmail}</a>
        </p>
      )}
    </article>
  );
}
