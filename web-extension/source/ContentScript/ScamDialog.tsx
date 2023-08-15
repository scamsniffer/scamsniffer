import {useTranslation} from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {styled} from '@mui/material';
import Grid from '@mui/material/Grid';
import ButtonBase from '@mui/material/ButtonBase';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {useState, useCallback, useRef, useEffect} from 'react';

import {ScamResult} from '@scamsniffer/detector';
import {createShadowRootForwardedComponent} from '../core/ShadowRoot/Portal';
import ScamAlert from './ScamAlert';
import {RPC} from '../core/message/client';
import {clientQueryTabId} from '../core/tab/idQuery';
const Logo = `data:image/png;base64,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`


export const ShadowRootDialog: typeof Dialog =
  createShadowRootForwardedComponent(Dialog) as any;

const WarringDialog = styled(ShadowRootDialog)`
  .MuiPaper-root {
    background-color: #d73a49;
  }
`;

const darkModeTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function getPageMeta() {
  const metaHeads = Array.from(document.querySelectorAll('meta')).reduce(
    (all: Record<string, string>, item: HTMLMetaElement) => {
      const metaName = item.name || item.getAttribute('property');
      if (metaName) all[metaName] = item.content;
      return all;
    },
    {}
  );

  const canonicalEl = document.querySelectorAll<HTMLLinkElement>(
    'link[rel=canonical]'
  )[0];
  const canonicalLink = canonicalEl ? canonicalEl.href : null;
  const topSourceDomains = Array.from(document.querySelectorAll('img'))
    .map((img: HTMLImageElement) => {
      const a = document.createElement('a');
      a.href = img.src;
      return a.hostname;
    })
    .filter((_) => _)
    .reduce((all: Record<string, number>, domain: string) => {
      all[domain] = (all[domain] || 0) + 1;
      return all;
    }, {});

  return {
    title: document.title,
    metaHeads,
    canonicalLink,
    topSourceDomains: Object.keys(topSourceDomains)
      .map((domain) => {
        return {
          domain,
          count: topSourceDomains[domain],
        };
      })
      .sort((b, a) => a.count - b.count),
  };
}

const ScamDialog = () => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();
  const [scamProject, setScamProject] = useState<ScamResult | null>(null);
  const checked = useRef(false);
  const doDetectScam = useCallback(async () => {
    if (checked.current) return;
    checked.current = true;
    try {
      let pageDetails = null;
      try {
        pageDetails = getPageMeta();
      } catch {
        pageDetails = null;
      }
      const postDetail = {
        links: [window.location.href],
        pageDetails,
      };
      const tabId = await clientQueryTabId();
      const mismatchCardInfo = await RPC.checkTabIsMismatch(
        tabId,
        window.location.href
      );
      if (mismatchCardInfo) {
        setScamProject({
          slug: 'mismatch',
          name: 'mismatch',
          matchType: 'mismatch-card',
          externalUrl: null,
          twitterUsername: null,
          ...mismatchCardInfo,
          post: postDetail,
        });
        setOpen(true);
      }
    } catch(error) {
      // 
    }
  }, []);

  useEffect(() => {
    doDetectScam();
  });

  const handleReject = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={darkModeTheme}>
      <WarringDialog
        open={open}
        onClose={handleReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        style={{}}
      >
        {/* <DialogTitle id="alert-dialog-title" style={{color: 'white'}}>
          <Grid container spacing={2} style={{paddingBottom: '8px'}}>
            <Grid item>{t('alertTitle')}</Grid>
            <Grid
              container
              item
              xs={12}
              sm
              direction="row"
              spacing={1}
              justifyContent="flex-end"
            >
              <ButtonBase
                sx={{width: 144, height: 24}}
                onClick={() =>
                  window.open(
                    'https://scamsniffer.io?utm_source=extension-alert-logo'
                  )
                }
                style={{marginRight: '-20px', marginTop: '10px'}}
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/scamsniffer/landingpage@main/assets/logo-light.svg"
                  height={21}
                  alt="logo"
                />
              </ButtonBase>
            </Grid>
          </Grid>
        </DialogTitle> */}

        <DialogTitle
          id="alert-dialog-title"
          style={{ color: "white", textAlign: "center" }}
        >
          <ButtonBase
            sx={{ width: 200, height: 45 }}
            onClick={() =>
              window.open("https://scamsniffer.io?utm_source=firewall-logo")
            }
            style={{ marginRight: "-20px", marginTop: "0px" }}
          >
            <img
              src={Logo}
              height={32}
            />
          </ButtonBase>
        </DialogTitle>
        <DialogContent dividers>
          {scamProject && <ScamAlert result={scamProject} />}
        </DialogContent>
      </WarringDialog>
    </ThemeProvider>
  );
};

export default ScamDialog;
