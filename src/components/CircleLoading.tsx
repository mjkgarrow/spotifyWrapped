import CircularProgress from '@mui/material/CircularProgress';

export default function CircleLoading() {
    return (
        <div id='welcome-pattern' className='h-screen w-screen flex justify-center items-center'>
            <CircularProgress color='secondary' />
        </div>
    );
}