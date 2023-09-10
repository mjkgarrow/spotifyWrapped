import { Menu } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react';

type props = {
    set: any,
    get: string,
}

export default function TimeSelector(props: props) {
    const { set, get } = props

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick = (event: any) => {
        setAnchorEl(null);
        if (event.target.value) {
            set(event.target.value)
        }
    };

    return (
        <>
            <div className='hidden sm:block min-w-max'>
                <ButtonGroup variant="outlined" color='secondary' aria-label="outlined secondary text button group" className='h-fit'>
                    <Button onClick={handleClick} value='short_term' variant={get === 'short_term' ? 'contained' : 'outlined'} >4 weeks</Button>
                    <Button onClick={handleClick} value='medium_term' variant={get === 'medium_term' ? 'contained' : 'outlined'}>6 months</Button>
                    <Button onClick={handleClick} value='long_term' variant={get === 'long_term' ? 'contained' : 'outlined'}>All time</Button>
                </ButtonGroup>
            </div>

            <div className='sm:hidden'>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant='contained'
                    onClick={handleOpen}
                    className='w-32'
                    color='secondary'
                >
                    Time period
                </Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClick}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div className='flex flex-col'>
                        <button value='short_term' onClick={handleClick} className='hover:bg-green-600 py-2 px-4'>4 weeks</button>
                        <button value='medium_term' onClick={handleClick} className='hover:bg-green-600 py-2 px-4'>6 months</button>
                        <button value='long_term' onClick={handleClick} className='hover:bg-green-600 py-2 px-4'>All time</button>
                    </div>
                </Menu>
            </div>
        </>
    );
}