import { Button } from '@mui/material'

type props = {
    onClick: () => void,
    text: string
}

export default function GenericBtn(props: props) {

    return (
        <Button variant="contained" color='secondary' size="large" onClick={props.onClick}>{props.text}</Button>
    )
}
