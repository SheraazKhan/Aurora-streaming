"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useModalStore } from "@/store/modalStore";
import Image from "next/image";
import { X, Play, Plus, ThumbsUp, ArrowLeft, ChevronRight, Star } from "lucide-react";
import requests from "@/services/requests";
import NextEpisodeCountdown from "@/components/player/NextEpisodeCountdown";
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import type { MediaItem, TVDetails, CastMember } from "../../types/movie";

export default function MovieModal() {
  const { isOpen, closeModal, selectedMovie, isPlaying, setPlaying, openModal } = useModalStore();
  const [details, setDetails] = useState<TVDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<MediaItem[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "episodes" | "similar" | "details">("overview");
  const countdownTriggered = useRef(false);

  const movieId = selectedMovie?.id;
  const isTV = !!(selectedMovie?.first_air_date || selectedMovie?.name);
  const backdrop = selectedMovie?.backdrop_path || selectedMovie?.poster_path;
  const movieTitle = selectedMovie?.title || selectedMovie?.name;

  useEffect(() => {
    if (typeof movieId !== "number") return;
    async function fetchData() {
      const type = isTV ? "tv" : "movie";
      setIsLoadingSimilar(true);
      try {
        const [detailRes, similarRes, creditsRes] = await Promise.all([
          axios.get(requests.fetchDetails(type, movieId!)),
          axios.get(requests.fetchSimilar(type, movieId!)),
          axios.get(requests.fetchCredits(type, movieId!)),
        ]);
        setDetails(detailRes.data);
        setSimilarMovies(similarRes.data.results.slice(0, 12));
        setCast(creditsRes.data.cast?.slice(0, 10) || []);
        setSeason(1);
        setEpisode(1);
        setActiveTab("overview");
      } catch (error) {
        console.error("Failed to fetch modal details:", error);
      } finally {
        setIsLoadingSimilar(false);
      }
    }
    fetchData();
  }, [selectedMovie, movieId, isTV]);

  const currentSeasonEpisodes = details?.seasons?.find((s) => s.season_number === season)?.episode_count || 1;

  const hasNextEpisode = !!(isTV && details && (
    episode < currentSeasonEpisodes || season < details.number_of_seasons
  ));

  const playNextEpisode = useCallback(() => {
    if (!isTV || !details) return;
    setShowCountdown(false);
    countdownTriggered.current = false;
    if (episode < currentSeasonEpisodes) {
      setEpisode((prev) => prev + 1);
    } else if (season < details.number_of_seasons) {
      setSeason((prev) => prev + 1);
      setEpisode(1);
    }
  }, [episode, currentSeasonEpisodes, season, details, isTV]);

  // Reset countdown state when episode changes
  useEffect(() => {
    countdownTriggered.current = false;
    setShowCountdown(false);
  }, [season, episode]);

  // Listen for "ended" event from our same-origin player page
  useEffect(() => {
    if (!isPlaying || !isTV || !hasNextEpisode) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "PLAYER_EVENT" && event.data?.event === "ended") {
        if (!countdownTriggered.current) {
          countdownTriggered.current = true;
          setShowCountdown(true);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isPlaying, isTV, hasNextEpisode]);

  const getNextEpisodeLabel = () => {
    if (episode < currentSeasonEpisodes) return `Season ${season}, Episode ${episode + 1}`;
    if (details && season < details.number_of_seasons) return `Season ${season + 1}, Episode 1`;
    return "";
  };

  const getPlayerUrl = () => {
    if (typeof movieId !== "number") return "";
    return isTV
      ? `/player?id=${movieId}&type=tv&s=${season}&e=${episode}`
      : `/player?id=${movieId}&type=movie`;
  };

  const handleClose = () => {
    setShowCountdown(false);
    countdownTriggered.current = false;
    closeModal();
  };

  const year = selectedMovie?.release_date?.split("-")[0] || selectedMovie?.first_air_date?.split("-")[0];
  const rating = selectedMovie?.vote_average ? Math.round(selectedMovie.vote_average * 10) : null;

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    ...(isTV ? [{ key: "episodes" as const, label: "Episodes" }] : []),
    { key: "similar" as const, label: "More Like This" },
    { key: "details" as const, label: "Details" },
  ];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-60" onClose={handleClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto scrollbar-hide">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-surface-1 shadow-2xl border border-white/5">
                {selectedMovie && (
                  <>
                    <button onClick={handleClose} className="absolute right-4 top-4 z-70 h-9 w-9 bg-surface-1/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/10 border border-white/10 transition">
                      <X className="text-white" size={18} />
                    </button>

                    {isPlaying && (
                      <>
                        <button onClick={() => { setPlaying(false); setShowCountdown(false); }} className="absolute left-4 top-4 z-70 h-9 w-9 bg-surface-1/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/10 border border-white/10 transition">
                          <ArrowLeft className="text-white" size={18} />
                        </button>

                        {isTV && hasNextEpisode && (
                          <button
                            onClick={playNextEpisode}
                            className="absolute right-16 top-4 z-70 flex items-center gap-2 bg-accent/90 hover:bg-accent px-4 py-1.5 rounded-full text-black text-xs font-bold transition"
                          >
                            Next Episode <ChevronRight size={14} />
                          </button>
                        )}
                      </>
                    )}

                    <div className="relative pt-[56.25%] bg-black">
                      {isPlaying ? (
                        <>
                          <iframe
                            src={getPlayerUrl()}
                            className="absolute top-0 left-0 h-full w-full border-none"
                            allowFullScreen
                            allow="autoplay"
                            title="movie-player"
                          />
                          {showCountdown && isTV && hasNextEpisode && (
                            <NextEpisodeCountdown
                              onPlay={playNextEpisode}
                              onCancel={() => { setShowCountdown(false); countdownTriggered.current = false; }}
                              episodeLabel={getNextEpisodeLabel()}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {backdrop && (
                            <Image
                              src={`https://image.tmdb.org/t/p/original${backdrop}`}
                              alt="poster"
                              fill
                              className="object-cover"
                              priority
                            />
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-surface-1 via-surface-1/30 to-transparent" />
                          <div className="absolute bottom-8 left-8 flex items-center gap-3">
                            <button onClick={() => setPlaying(true)} className="flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-lg font-bold text-black hover:bg-gray-200 transition">
                              <Play fill="black" size={20} /> Play
                            </button>
                            <button className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/60 hover:bg-white/20 transition">
                              <Plus className="text-white" size={20} />
                            </button>
                            <button className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/60 hover:bg-white/20 transition">
                              <ThumbsUp className="text-white" size={18} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-6 md:p-8 text-white">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        {rating && <Badge variant="accent">{rating}% Match</Badge>}
                        {year && <Badge>{year}</Badge>}
                        <Badge>HD</Badge>
                        {isTV && details && (
                          <Badge>{details.number_of_seasons} Season{details.number_of_seasons > 1 ? "s" : ""}</Badge>
                        )}
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{movieTitle}</h2>

                      <div className="flex gap-1 mt-4 border-b border-white/10 mb-6">
                        {tabs.map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                              activeTab === tab.key
                                ? "text-accent"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {tab.label}
                            {activeTab === tab.key && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>

                      {activeTab === "overview" && (
                        <div className="space-y-6 animate-fade-in">
                          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">
                            {selectedMovie.overview}
                          </p>
                          {cast.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Cast</h3>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                {cast.map((member) => (
                                  <div key={member.id} className="flex-none w-20 text-center">
                                    <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-surface-2">
                                      {member.profile_path ? (
                                        <Image src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} alt={member.name} fill className="object-cover" sizes="64px" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">{member.name[0]}</div>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-white mt-1.5 truncate">{member.name}</p>
                                    <p className="text-[9px] text-gray-500 truncate">{member.character}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "episodes" && isTV && (
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex items-center gap-3">
                            <Dropdown
                              value={season}
                              options={Array.from({ length: details?.number_of_seasons || 1 }, (_, i) => ({ label: `Season ${i + 1}`, value: i + 1 }))}
                              onChange={(v) => { setSeason(v); setEpisode(1); }}
                            />
                            <span className="text-gray-400 text-sm">{currentSeasonEpisodes} episodes</span>
                          </div>
                          <div className="grid gap-2 max-h-96 overflow-y-auto scrollbar-hide">
                            {Array.from({ length: currentSeasonEpisodes }, (_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => { setEpisode(i + 1); setPlaying(true); }}
                                className={`flex items-center gap-4 p-3 rounded-xl transition text-left w-full ${
                                  episode === i + 1 && isPlaying ? "bg-accent/15 border border-accent/30" : "bg-surface-2/50 hover:bg-surface-2 border border-transparent"
                                }`}
                              >
                                <span className="text-gray-500 text-sm font-medium w-8 text-center">{i + 1}</span>
                                <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium">Episode {i + 1}</p></div>
                                <Play size={16} className="text-gray-400 flex-none" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === "similar" && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in">
                          {isLoadingSimilar ? (
                            [...Array(8)].map((_, i) => (<div key={i} className="aspect-video bg-surface-2 rounded-xl animate-pulse" />))
                          ) : (
                            similarMovies.map((m) => (
                              <div key={m.id} onClick={() => { openModal(m); document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group/card relative aspect-video bg-surface-2 rounded-xl overflow-hidden cursor-pointer">
                                {m.backdrop_path && (<Image src={`https://image.tmdb.org/t/p/w500${m.backdrop_path}`} alt="poster" fill className="object-cover transition group-hover/card:opacity-60" />)}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition"><Play className="fill-white text-white" size={28} /></div>
                                <div className="absolute bottom-0 w-full p-2 bg-linear-to-t from-black/80 to-transparent">
                                  <p className="text-[11px] text-white font-medium truncate">{m.title || m.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-accent text-[9px]">{m.vote_average ? `${Math.round(m.vote_average * 10)}%` : ""}</span>
                                    <span className="text-gray-400 text-[9px]">{m.release_date?.split("-")[0] || m.first_air_date?.split("-")[0]}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {activeTab === "details" && (
                        <div className="space-y-4 text-sm animate-fade-in">
                          <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-gray-500 block mb-1">Type</span><span className="text-white">{isTV ? "TV Series" : "Movie"}</span></div>
                            <div><span className="text-gray-500 block mb-1">Rating</span><span className="text-white flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" />{selectedMovie.vote_average?.toFixed(1) || "N/A"} / 10</span></div>
                            {year && (<div><span className="text-gray-500 block mb-1">Year</span><span className="text-white">{year}</span></div>)}
                            {isTV && details && (<div><span className="text-gray-500 block mb-1">Seasons</span><span className="text-white">{details.number_of_seasons}</span></div>)}
                          </div>
                          <div className="pt-4 border-t border-white/10">
                            <span className="text-gray-500 text-xs block mb-2">Subtitles are available via the player&apos;s built-in CC controls</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
