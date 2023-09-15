import { atom, useRecoilState, } from 'recoil';
import { getTopItems } from '../api/spotifyQueries';
import { TimeRangeDataObject, RecoilSetter, DefaultDataObject, ProfileObject } from '../types/types';
import { UserProfile } from '../types/spotifyTypes';

const authState = atom({
    key: 'auth',
    default: {
        token: '',
        expiresAt: new Date().setSeconds(new Date().getSeconds() + 3600)
    },
    effects: [
        ({ setSelf }) => {
            if (localStorage.getItem('auth')) {
                setSelf(JSON.parse(localStorage.getItem('auth')!));
            }
        },
        // ({ onSet }) => {
        //     onSet(auth => { localStorage.setItem('auth', JSON.stringify(auth)) });
        // },
    ],
})

const defaultDataObject: TimeRangeDataObject = {
    artists: [],
    tracks: [],
}

const defaultUserObject: UserProfile = {
    display_name: '',
    email: '',
    external_urls: { spotify: '' },
    followers: { href: null, total: 0 },
    href: '',
    id: '',
    images: [],
    type: '',
    uri: '',
    country: '',
    explicit_content: {
        filter_enabled: false,
        filter_locked: false,
    },
    product: '',
}

const defaultProfileObject: ProfileObject = {
    user: defaultUserObject,
    playlists: [],
    following: []
}

const profileData = atom({
    key: 'profile',
    default: defaultProfileObject,
})

const currentData = atom({
    key: 'currentData',
    default: defaultDataObject,
})

const shortTermData = atom({
    key: 'shortTermData',
    default: defaultDataObject,
})

const mediumTermData = atom({
    key: 'mediumTermData',
    default: defaultDataObject,
})

const longTermData = atom({
    key: 'longTermData',
    default: defaultDataObject,
})

// Hook for using Recoil global state
export const useGlobalState = () => {

    const [auth, setAuth] = useRecoilState(authState)
    const [profile, setProfile]: [ProfileObject, RecoilSetter<ProfileObject>] = useRecoilState(profileData)
    const [data, setData]: [TimeRangeDataObject, RecoilSetter<TimeRangeDataObject>] = useRecoilState(currentData)

    const [shortData, setShortData]: [TimeRangeDataObject, RecoilSetter<TimeRangeDataObject>] = useRecoilState(shortTermData)
    const [mediumData, setMediumData]: [TimeRangeDataObject, RecoilSetter<TimeRangeDataObject>] = useRecoilState(mediumTermData)
    const [longData, setLongData]: [TimeRangeDataObject, RecoilSetter<TimeRangeDataObject>] = useRecoilState(longTermData)

    const isAuth = (): boolean => {
        if (auth.token && JSON.parse(localStorage.getItem('auth')!)?.token) {
            let expiresAt = new Date(auth.expiresAt);
            let currentDate = new Date();

            return expiresAt > currentDate;
        }

        return false;
    }

    // data: TimeRangeDataObject, setData: RecoilSetter<TimeRangeDataObject>
    async function makeApiCall(types: string[], timeRange: string, limit: number = 50, offset: number = 0) {
        let termData: TimeRangeDataObject;
        let setTermData: RecoilSetter<TimeRangeDataObject>;

        // Select state storage backup
        switch (timeRange) {
            case 'medium_term':
                termData = mediumData;
                setTermData = setMediumData;
                break;
            case 'long_term':
                termData = longData;
                setTermData = setLongData;
                break;
            default:
                termData = shortData;
                setTermData = setShortData;
                break;
        }

        // Create an array of promises for each type
        const promises = types.map((type) => {
            if (!(termData[type] as DefaultDataObject).length) {
                return getTopItems(type, limit, offset, timeRange);
            } else {
                return Promise.resolve({ items: termData[type] }); // Resolve with the existing data
            }
        });

        // Use Promise.all to fetch data concurrently
        const results = await Promise.all(promises);

        // Update the data in state for each type
        results.forEach((res, index) => {
            const type = types[index];
            setData((prev) => ({ ...prev, [type]: res.items }));
            setTermData((prev) => ({ ...prev, [type]: res.items }));
        });
    }

    const checkEmpty = (): boolean => {
        let isEmpty = true;

        for (let value of Object.values(data)) {
            if (Array.isArray(value) && value.length) {
                isEmpty = false;
            }
        }

        return isEmpty
    }

    return { auth, setAuth, isAuth, makeApiCall, data, setData, checkEmpty, profile, setProfile }
}