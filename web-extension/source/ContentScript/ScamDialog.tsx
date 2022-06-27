import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import ButtonBase from "@mui/material/ButtonBase";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createShadowRootForwardedComponent } from "../core/ShadowRoot/Portal";
import { useState, useCallback, useRef, useEffect } from "react";

export const ShadowRootDialog: typeof Dialog =
  createShadowRootForwardedComponent(Dialog) as any;

const WarringDialog = styled(ShadowRootDialog)`
  .MuiPaper-root {
    background-color: #d73a49;
  }
`;

const darkModeTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

import { ScamResult } from "@scamsniffer/detector";
import { useAsync } from "react-use";
import ScamAlert from "./ScamAlert";
import { RPC } from "../core/message";

function getPageMeta() {
  const metaHeads = Array.from(document.querySelectorAll("meta")).reduce(
    (all: any, item: any) => {
      const metaName = item.name || item.getAttribute("property");
      if (metaName) all[metaName] = item.content;
      return all;
    },
    {}
  );

  const canonicalEl = document.querySelectorAll("link[rel=canonical]")[0];
  const canonicalLink = canonicalEl ? (canonicalEl as any).href : null;
  const topSourceDomains = Array.from(document.querySelectorAll("img"))
    .map((img: any) => {
      const a = document.createElement("a");
      a.href = img.src;
      return a.hostname;
    })
    .filter((_) => _)
    .reduce((all: any, domain: string) => {
      all[domain] = all[domain] || 0;
      all[domain]++;
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
  const [scamProject, setScamProject] = useState<ScamResult | null>(null);
  const checked = useRef(false);
  const doDetectScam = useCallback(async () => {
    if (checked.current) return;
    checked.current = true;
    let pageDetails = null;
    try {
      pageDetails = getPageMeta();
    } catch (e) {}
    const postDetail = {
      links: [window.location.href],
      pageDetails,
    };
    const result = await RPC.detectScam(postDetail);
    if (result) {
      setScamProject(result);
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    doDetectScam();
  });

  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

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
        <DialogTitle id="alert-dialog-title" style={{ color: "white" }}>
          <Grid container spacing={2} style={{ paddingBottom: "8px" }}>
            <Grid item>{t("alertTitle")}</Grid>
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
                sx={{ width: 144, height: 24 }}
                onClick={() =>
                  window.open(
                    "https://scamsniffer.io?utm_source=extension-alert-logo"
                  )
                }
                style={{ marginRight: "-20px", marginTop: "10px" }}
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/scamsniffer/landingpage@main/assets/logo-light.svg"
                  height={21}
                />
              </ButtonBase>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {scamProject && <ScamAlert result={scamProject} />}
        </DialogContent>
      </WarringDialog>
    </ThemeProvider>
  );
};

export default ScamDialog;
