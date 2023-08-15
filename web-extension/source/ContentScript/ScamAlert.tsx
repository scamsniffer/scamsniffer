import {
  Typography,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import type {ScamResult} from '@scamsniffer/detector';
import {useAsync} from 'react-use';
import {useState, useEffect} from 'react';
import urlcat from 'urlcat';

import {createMakeStyles} from 'tss-react';

import {useTranslation} from 'react-i18next';
import {RPC} from '../core/message/client';

export const {makeStyles} = createMakeStyles({useTheme});

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    padding: theme.spacing(2),
  },
  icon: {
    verticalAlign: '-6px',
    marginRight: '12px',
  },
  list: {
    padding: 0,
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  scam: {
    padding: theme.spacing(2),
    background: '#d75a63',
    borderRadius: '10px',
  },
  reportWrapper: {
    marginTop: '5px',
  },
  desc: {
    margin: '15px 10px 7px',
    color: '#ddd',
    fontSize: '14px',
    textAlign: 'center',
  },
  highlight: {
    color: '#f4f4f4',
  },
  link: {
    color: '#eee',
    marginLeft: '3px',
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
  },
}));

function openWebPage(url: string) {
  window.open(url);
}

const ScamAlert = ({result}: {result: ScamResult}) => {
  const {classes} = useStyles();
  const [autoReport, setAutoReport] = useState(false);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (autoReport) {
      RPC.sendReportScam(result);
    }
  }, [autoReport, result]);

  const openTwitter = () => {
    const link = urlcat('https://twitter.com', '/:username', {
      username: result.twitterUsername,
    });
    openWebPage(link);
  };

  const openSite = () => {
    if (result.externalUrl) openWebPage(result.externalUrl);
  };

  useAsync(async () => {
    const enabled = await RPC.isAutoReportEnabled();
    setAutoReport(enabled);
  }, []);

  const isMismatch = result.matchType === 'mismatch-card';

  return (
    <div className={classes.root}>
      {isMismatch ? (
        <div className={classes.scam}>
          <Typography variant="body2" className={classes.title}>
            {t('misMatch')}
          </Typography>
          <List className={classes.list}>
            <ListItemButton>
              <ListItemIcon>
                <DescriptionIcon className={classes.highlight} />
              </ListItemIcon>
              <ListItemText
                className={classes.highlight}
                primary={(result as any).domain}
              />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <DescriptionIcon className={classes.highlight} />
              </ListItemIcon>
              <ListItemText
                className={classes.highlight}
                primary={(result as any).title}
              />
            </ListItemButton>
          </List>
          <Typography className={classes.desc}>{t('tipOne')}</Typography>
          <Typography className={classes.desc}>{t('topTwo')}</Typography>
          <Typography className={classes.desc}>
            More:{' '}
            <a
              href="https://harrydenley.com/faking-twitter-unfurling-part-2/"
              target="_blank"
              className={classes.link}
              rel="noreferrer"
            >
              Spoofing Twitter unfurling to phish you
            </a>
          </Typography>
        </div>
      ) : (
        <div className={classes.scam}>
          {result.matchType === 'domain-blocked' ? (
            <Typography variant="body2" className={classes.title}>
              {t('siteBlocked')}
            </Typography>
          ) : (
            <Typography variant="body2" className={classes.title}>
              {t('simProject')}
            </Typography>
          )}
          <List className={classes.list}>
            {result.matchType === 'domain-blocked' ? null : (
              <ListItemButton>
                <ListItemIcon>
                  <DescriptionIcon className={classes.highlight} />
                </ListItemIcon>
                <ListItemText
                  className={classes.highlight}
                  primary={result.name}
                />
              </ListItemButton>
            )}
            {result.twitterUsername ? (
              <ListItemButton onClick={() => openTwitter()}>
                <ListItemIcon>
                  <TwitterIcon className={classes.highlight} />
                </ListItemIcon>
                <ListItemText
                  className={classes.highlight}
                  primary={result.twitterUsername}
                />
              </ListItemButton>
            ) : null}
            {result.externalUrl ? (
              <ListItemButton onClick={() => openSite()}>
                <ListItemIcon>
                  <LinkIcon className={classes.highlight} />
                </ListItemIcon>
                <ListItemText
                  className={classes.highlight}
                  primary={result.externalUrl}
                />
              </ListItemButton>
            ) : null}
          </List>
          <Typography className={classes.desc}>{t('tipOne')}</Typography>
          <Typography className={classes.desc}>{t('topTwo')}</Typography>
        </div>
      )}
    </div>
  );
};

export default ScamAlert;
