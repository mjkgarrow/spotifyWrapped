import api from './axiosConfig';
import { Artist, SimplifiedPlaylist, UserProfile, AudioFeaturesCollection } from '../types/spotifyTypes';

export async function getProfile(): Promise<UserProfile> {
    const response = await api.get('v1/me')
    return response.data
}

export async function getPlaylists(): Promise<SimplifiedPlaylist[]> {
    const response = await api.get('v1/me/playlists')
    return response.data.items
}

export async function getFollowedArtists(): Promise<Artist[]> {
    const response = await api.get('v1/me/following?type=artist')
    return response.data.artists.items
}

export async function getAllUserData(): Promise<{ user: UserProfile, playlists: SimplifiedPlaylist[], following: Artist[] }> {
    try {
        const [user, playlists, following] = await Promise.all([
            getProfile(),
            getPlaylists(),
            getFollowedArtists(),
        ])

        return { user, playlists, following }

    } catch (error) {
        throw error;
    }
}


export async function getTopItems(type: string, limit: number, offset: number, timeRange: string) {
    // long_term (calculated from several years of data and including all new data as it becomes available)
    // medium_term (approximately last 6 months)
    // short_term (approximately last 4 weeks). Default: medium_term

    // Define the base URI
    let uri = `v1/me/top/${type}`;

    // Create an array to store query parameters
    const queryParams = [];

    // Add 'limit' to the query parameters if it's provided and greater than 0
    if (limit && limit > 0) {
        queryParams.push(`limit=${limit}`);
    }

    // Add 'offset' to the query parameters if it's provided and greater than 0
    if (offset && offset > 0) {
        queryParams.push(`offset=${offset}`);
    }

    // Add 'timeRange' to the query parameters if it's provided
    if (timeRange) {
        queryParams.push(`time_range=${timeRange}`);
    }

    // If there are query parameters, construct the URI with a '?' and join the parameters with '&'
    if (queryParams.length > 0) {
        uri += `?${queryParams.join('&')}`;
    }

    // Make the API request
    const response = await api.get(uri);

    return response.data;
}

export async function getTracksFeatures(ids: string[]): Promise<AudioFeaturesCollection> {
    let uri = `v1/audio-features?ids=${ids.join()}`

    // Make the API request
    const response = await api.get(uri);

    return response.data;
}