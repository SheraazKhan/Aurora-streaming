"use client";
import requests from "@/services/requests";
import Row from "@/components/Row";
import Banner from "@/components/Banner";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";

export default function Home() {
  return (
    <main className="relative bg-background min-h-screen">
      <Banner />

      <div className="relative z-10 -mt-20 pb-20">
        <ContinueWatchingRow />
        <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
        <Row title="Top 10 Today" fetchUrl={requests.fetchTrendingDay} variant="top10" />
        <Row title="Originals" fetchUrl={requests.fetchNetflixOriginals} variant="poster" />
        <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
        <Row title="New Releases" fetchUrl={requests.fetchNewest} />
        <Row title="Upcoming" fetchUrl={requests.fetchUpcomingMovies} />
      </div>
    </main>
  );
}
