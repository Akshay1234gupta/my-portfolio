import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-5">
        This page{" "}
        <span className="serif text-gradient pr-[0.08em]">flew away.</span>
      </h1>
      <p className="lead mt-8 max-w-md">The feather couldn&rsquo;t find what you were looking for. Let&rsquo;s get you back on the path.</p>
      <div className="mt-10 flex gap-4">
        <Link href="/" className="btn btn-primary" data-cursor="link">
          Back home
        </Link>
        <Link href="/blog" className="btn" data-cursor="link">
          Read the blog
        </Link>
      </div>
    </div>
  );
}
