import GenericBtn from './GenericBtn';
import { requestAuthorisation } from '../api/spotifyAuth';

export default function LoginBtn() {

    const logIn = async () => {
        requestAuthorisation()
    }

    return (
        <GenericBtn onClick={logIn} text='Login' />
    )
}
