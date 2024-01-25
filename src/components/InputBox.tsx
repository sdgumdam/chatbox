import React, { useEffect, useRef, useState, MutableRefObject } from 'react'
import { Stack, Grid, Button, ButtonGroup, MenuItem, ListItemIcon, Typography, Divider, TextField, Tooltip } from '@mui/material'
import { Message, createMessage ,FileInputRef} from '../stores/types'
import { useTranslation } from 'react-i18next'
import SendIcon from '@mui/icons-material/Send'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Label } from '@mui/icons-material'

export default function InputBox(props: {
    onSubmit: (newMsg: Message, needGenerating?: boolean) => void
    quoteCache: string
    setQuotaCache(cache: string): void
    textareaRef: MutableRefObject<HTMLTextAreaElement | null>
}) {
    const { t } = useTranslation()
    const [messageInput, setMessageInput] = useState('')
    const [imageInput,setImageInput] = useState('')
    const fileInputRef = useRef(null) as FileInputRef;

    useEffect(() => {
        if (props.quoteCache !== '') {
            setMessageInput(props.quoteCache)
            props.setQuotaCache('')
            props.textareaRef?.current?.focus()
        }
    }, [props.quoteCache])
    
    useEffect(() => {
        function keyboardShortcut(e: KeyboardEvent) {
            if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
                props.textareaRef?.current?.focus()
            }
        }
        window.addEventListener('keydown', keyboardShortcut)
        return () => {
            window.removeEventListener('keydown', keyboardShortcut)
        }
    }, [])

    const submit = (needGenerating = true) => {
        if (messageInput.trim() === '') {
            return
        }
        props.onSubmit(createMessage('user', messageInput), needGenerating)
        setMessageInput('')
    }

    const handleClick = () => {
        // trigger the file input click event
        // use the as keyword to access the current property
        fileInputRef.current?.click();
      };
    
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // handle the file input change event
        // use the optional chaining operator to access the files property
            if(event.target?.files == null)
            {
                return;
            }
            const file = event.target?.files[0]; // get the selected file
            const reader = new FileReader(); // create a file reader
            reader.onload = (e) => {
            // when the reader is loaded
            const dataUrl = e.target?.result as string; // get the data URL
            setImageInput(dataUrl); // set the state
            };
            reader.readAsDataURL(file); // read the file as data URL
         
      };
    

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                submit()
            }}
        >
            <Stack direction="column" spacing={1}>
                <Grid container spacing={1}>
                    <Grid item xs>
                        <TextField
                            inputRef={props.textareaRef}
                            multiline
                            label="Prompt"
                            value={messageInput}
                            onChange={(event) => setMessageInput(event.target.value)}
                            fullWidth
                            maxRows={12}
                            autoFocus
                            id="message-input"
                            onKeyDown={(event) => {
                                if (
                                    event.keyCode === 13 &&
                                    !event.shiftKey &&
                                    !event.ctrlKey &&
                                    !event.altKey &&
                                    !event.metaKey
                                ) {
                                    event.preventDefault()
                                    submit()
                                    return
                                }
                                if (event.keyCode === 13 && event.ctrlKey) {
                                    event.preventDefault()
                                    submit(false)
                                    return
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <Button type="submit" variant="contained" size="large" style={{ padding: '15px 16px' }}>
                            <SendIcon />
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs = "auto">
                    <input type="file" id ="imageinput" style={{display: "none"}} ref={fileInputRef} // assign the ref to the file input
                         onChange={handleFileChange}/>
                            <Tooltip title={t("Add an image")}>
                                    <Button variant="contained" size="small" onClick={handleClick}>
                                        <PhotoCameraIcon />
                                    </Button>
                            </Tooltip>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="caption" style={{ opacity: 0.3 }}>
                            {t('[Enter] send, [Shift+Enter] line break, [Ctrl+Enter] send without generating')}
                        </Typography>
                    </Grid>

                </Grid>
                
            </Stack>
        </form>
    )
}
