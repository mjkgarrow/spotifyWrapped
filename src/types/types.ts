import { SetterOrUpdater } from "recoil";
import { Artist, SimplifiedPlaylist, Track, UserProfile } from "./spotifyTypes";

export interface DataObject {
    [key: string]: {}
}

export interface TimeRangeDataObject extends DataObject {
    artists: Artist[],
    tracks: Track[],
}

export interface ProfileObject extends DataObject {
    user: UserProfile,
    playlists: SimplifiedPlaylist[],
    following: Artist[]
}

export interface DefaultDataObject extends DataObject {
    short_term: TimeRangeDataObject,
    medium_term: TimeRangeDataObject,
    long_term: TimeRangeDataObject,
}

// Define a type for the setter function
export type RecoilSetter<T> = SetterOrUpdater<T>;