import Banner from "@/components/Banner";
import Row from "@/components/Row";
import requests from "@/services/requests";

export default function TVShowsPage() {
  return (
    <main className="relative pb-24 lg:space-y-24">
      <Banner />

      <section className="md:space-y-24 mt-10">
        <Row title="Originals" fetchUrl={requests.fetchNetflixOriginals} />
        <Row title="Trending TV" fetchUrl={requests.fetchTrendingTV} />
        <Row title="Action & Adventure" fetchUrl={requests.fetchActionAdventureTV} />
      </section>
    </main>
  );
}