import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-green sm:text-5xl">
          MAAVITRAM
        </h1>
        <p className="text-lg text-muted">
          Rooted in Nature, Blended with Care.
        </p>
      </Container>
    </main>
  );
}
