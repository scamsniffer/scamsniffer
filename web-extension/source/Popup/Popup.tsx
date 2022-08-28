import { browser } from "webextension-polyfill-ts";
import { Box } from "@mui/material";
import Setting from "./Setting";
import Config from "./Config";
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Links from "./Links";
import ButtonBase from "@mui/material/ButtonBase";
import { createMakeStyles } from "tss-react";
import { useTheme } from "@mui/material";
export const { makeStyles } = createMakeStyles({ useTheme });
import { useTranslation } from "react-i18next";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  }
});

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    ' .MuiDivider-root': {
      borderColor: '#e9e9e9'
    }
  },
  beta: {
    color: "white",
    "margin-left": "-20px",
    "margin-top": "-12px",
    "font-weight": "bold",
    "font-size": "12px",
    'padding': '3px 4px',
    'background': '#1976d2',
    'border-radius': '5px'
  },
  scam: {
    width: "370px",
    background: "rgb(75 85 99 / 1)",
  },
  slogan: {
    fontSize: "17px",
    color: "#ddd",
  },
  logo: {
    padding: theme.spacing(2),
  },
  links: {
    padding: theme.spacing(1),
  },
}));

const Popup: React.FC = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  return (
    <ThemeProvider theme={lightTheme}>
      <div className={classes.root}>
        <div className={classes.scam}>
          <Box className={classes.logo}>
            <Box>
              <ButtonBase
                aria-label="twitter"
                onClick={() =>
                  window.open("https://scamsniffer.io/?utm_source=plugin-popup")
                }
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/scamsniffer/landingpage@main/assets/logo-light.svg"
                  height={36}
                />
                <span className={classes.beta}>Beta</span>
              </ButtonBase>
            </Box>
            {/* <p className={classes.slogan}>{t("slogan")}</p> */}
          </Box>
          <Setting />
          <Divider />
          <Config />
          <div className={classes.links}>
            <Links />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
