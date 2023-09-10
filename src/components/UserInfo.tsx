import { Avatar, ListItemText, Menu, List, ListItem, IconButton, } from '@mui/material'
import { getAllUserData } from '../api/spotifyQueries'
import React, { useEffect, useState } from 'react'
import { useGlobalState } from '../context/globalState';


export default function UserInfo() {
    const { profile, setProfile } = useGlobalState()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState<boolean>(true)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getAllUserData().then(data => {
            setProfile({ ...data })
            setLoading(false)
        }).catch(error => console.log(error))
    }, [])

    function capitalise(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className='flex items-center'>

            {!loading &&
                <div>
                    <IconButton
                        size="small"
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <Avatar
                            alt={profile.user.display_name}
                            src={profile.user.images[0].url} sx={{ width: 50, height: 50 }} />
                    </IconButton>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{ 'aria-labelledby': 'basic-button', }}
                    >
                        <List sx={{ width: '100%', maxWidth: 360, }}>
                            <ListItem>
                                <ListItemText primary="Total playlists" secondary={profile.playlists.length} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Followers" secondary={profile.user.followers.total} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Following" secondary={profile.following.length} />
                            </ListItem>
                            {/* <ListItem>
                                <ListItemText primary="Country" secondary={profile.user.country} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Account type" secondary={capitalise(profile.user.product)} />
                            </ListItem> */}
                        </List>
                    </Menu>
                </div>

            }
        </div>
    )
}
