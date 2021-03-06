import fetch from "node-fetch";
import { Brawler } from "./@types/Brawlers";
import { ClubLog } from "./@types/ClubLog";
import { Events } from "./@types/Events";
import { GameMode, GameModes } from "./@types/GameModes";
import { Icons } from "./@types/Icons";
import { BrawlMap } from "./@types/Map";
import { brawlMaps } from "./@types/Maps";

class APIError extends Error {
  public status: number;
  public constructor(status: number, text: string) {
    super(text);
    this.status = status;
  }
}

type trophyRange = "0-299" | "300-599" | "600+";

class Client {
  private baseURL = "https://api.brawlapi.com/v1";
  private userAgent: string;

  constructor(userAgent?: string) {
    this.userAgent = userAgent ?? "BrawlAPI.js node-js app";
  }

  private request = async <T>(ressource: string): Promise<T> => {
    const fetchURL = this.baseURL + ressource;

    const response = await fetch(fetchURL, {
      headers: { "User-Agent": this.userAgent, Accept: "application/json" },
    });

    if (!response.ok) throw new APIError(response.status, response.statusText);

    return response.json();
  };

  /**
   * Do not forget to credit Brawlify.com when using this endpoint!
   *
   * @param range Trophy range
   * @returns Active and Upcoming Events
   */
  public getEvents = async (range?: trophyRange) => {
    if (range) return await this.request<Events>(`/events/${range}`);

    return await this.request<Events>("/events");
  };

  /**
   * Fetch data for a single brawler
   * @param id Brawler id
   * @returns Data about a single brawler
   */
  public getBrawler = async (id: number | string) =>
    await this.request<Brawler>(`/brawlers/${id}`);

  /**
   * Fetch data about all the brawlers
   * @returns The full list of brawlers
   */
  public getBrawlers = async () => await this.request<Brawler>("/brawlers");

  /**
   * Fetch data for all the maps
   *
   * Do not forget to credit Brawlify.com when using this endpoint!
   * @returns List of data about all the maps
   */
  public getMaps = async () => await this.request<brawlMaps>("/maps");

  /**
   * Fetch data about a single map
   *
   * Do not forget to credit Brawlify.com when using this endpoint!
   *
   * @param id Map id. Return data about one map only
   * @param range Map data from a trophy range
   * @returns Data about a single map
   */
  public getMap = async (id: number | string, range?: trophyRange) => {
    if (id && range)
      return await this.request<BrawlMap>(`/maps/${id}/${range}`);
    return await this.request<BrawlMap>(`/maps/${id}`);
  };

  /**
   *
   * @returns Data about all maps
   */
  public getGameModes = async () => await this.request<GameModes>("/gamemodes");

  /**
   *
   * @param id Map id
   * @returns Data about a single map
   */
  public getGameMode = async (id: string | number) =>
    this.request<GameMode>(`/gamemodes/${id}`);

  /**
   *
   * @returns The list of icons
   */
  public getIcons = async () => await this.request<Icons>("/icons");

  /**
   * Not all clubs are tracked. Only few that have tracking enabled on brawlify.com
   * If you request historical data for a club that isn't being tracked,
   * you will get an error back with status code 403 or an outdated response.
   *
   * Do not forget to credit Brawlify.com when using this endpoint!
   *
   * @param tag Club tag
   * @returns Data about a club
   */
  public getClubLog = async (tag: string) =>
    await this.request<ClubLog>(`/clublog/${tag}`);
}

export { Client };
