import { makeStyles, MaskColorVar } from '@masknet/theme'
import { Typography, FormControlLabel, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkIcon from '@mui/icons-material/Link'
import Checkbox from '@mui/material/Checkbox'
import DescriptionIcon from '@mui/icons-material/Description'

import type { ScamResult } from '../detector'
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'
import { PluginScamRPC } from '../messages'
import { useAsync } from 'react-use'
import { useState, useCallback } from 'react'
import { openWindow } from '@masknet/shared-base-ui'

// import Avatar from 'boring-avatars'
// import { useAsyncRetry } from 'react-use'
const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        padding: theme.spacing(1),
    },
    icon: {
        verticalAlign: '-6px',
        marginRight: '12px',
    },
    list: {
        padding: 0,
        borderTop: '1px solid rgb(51, 51, 51)',
        borderBottom: '1px solid rgb(51, 51, 51)',
    },
    scam: {
        padding: theme.spacing(2),
        background: MaskColorVar.infoBackground,
        borderRadius: '10px',
    },
    reportWrapper: {
        marginTop: '5px',
    },
    report: {
        // fontSize: '13px',
        '& span': { fontSize: 13, color: MaskColorVar.normalText, lineHeight: 1.75 },
    },
    desc: {
        margin: '15px 0 7px',
        color: MaskColorVar.normalText,
        fontSize: '14px',
        textAlign: 'center',
    },
    highlight: {
        color: MaskColorVar.linkText,
    },
    title: {
        fontFamily: 'Poppins',
        fontWeight: 800,
        margin: '10px 0 18px 0',
        fontSize: '17px',
        lineHeight: '17px',
        width: '350px',
        textAlign: 'center',
        wordBreak: 'break-word',
        color: MaskColorVar.redMain,
    },
}))
const ScamAlert = ({ result }: { result: ScamResult }) => {
    const { classes } = useStyles()
    const [autoReport, setAutoReport] = useState(false)

    useCallback(() => {
        if (autoReport) {
            PluginScamRPC.reportScam(result)
        }
        PluginScamRPC.enableAutoReport(autoReport)
    }, [autoReport])

    useAsync(async () => {
        const enabled = await PluginScamRPC.isAutoReportEnabled()
        if (enabled) {
            PluginScamRPC.reportScam(result)
        }
        if (autoReport !== enabled) setAutoReport(enabled)
    }, [])
    return (
        <div className={classes.root}>
            <div className={classes.scam}>
                <Typography variant="body2" className={classes.title}>
                    <CrisisAlertIcon className={classes.icon} />
                    Scam Alert
                </Typography>
                <List className={classes.list}>
                    <ListItemButton>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText className={classes.highlight} primary={result.name} />
                    </ListItemButton>
                    <ListItemButton onClick={() => openWindow(`https://twitter.com/${result.twitterUsername}`)}>
                        <ListItemIcon>
                            <TwitterIcon />
                        </ListItemIcon>
                        <ListItemText className={classes.highlight} primary={result.twitterUsername} />
                    </ListItemButton>
                    {result.externalUrl ? (
                        <ListItemButton onClick={() => openWindow(result.externalUrl)}>
                            <ListItemIcon>
                                <LinkIcon />
                            </ListItemIcon>
                            <ListItemText className={classes.highlight} primary={result.externalUrl} />
                        </ListItemButton>
                    ) : null}
                </List>
                <Typography className={classes.desc}>Be careful what you visit and sign !</Typography>
            </div>
            <div className={classes.reportWrapper}>
                {!autoReport ? (
                    <FormControlLabel
                        className={classes.report}
                        control={
                            <Checkbox checked={autoReport} onChange={(event) => setAutoReport(event.target.checked)} />
                        }
                        label="Auto report the scam links to MetaMask phishing-detect"
                    />
                ) : null}
            </div>
        </div>
    )
}

export default ScamAlert
