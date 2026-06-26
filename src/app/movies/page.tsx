import Banner from "@/components/Banner";
import Row from "@/components/Row";
import requests from "@/services/requests";

export default function MoviesPage() {
  return (
    <main className="relative pb-24 lg:space-y-24">
      <Banner />

      <section className="md:space-y-24 mt-10">
        <Row title="Action Thrillers" fetchUrl={requests.fetchActionMovies} />
        <Row title="Comedy Hits" fetchUrl={requests.fetchComedyMovies} />
        <Row title="Horror Favorites" fetchUrl={requests.fetchHorrorMovies} />
        <Row title="Romance" fetchUrl={requests.fetchRomanceMovies} />
        <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
      </section>
    </main>
  );
}