import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonBase from "@mui/material/ButtonBase";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createShadowRootForwardedComponent } from "../core/ShadowRoot/Portal";
import { useState, useRef } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";


import { NFTCheckResult } from "@scamsniffer/detector";
import { useAsync } from "react-use";
import { RPC } from "../core/message";

function SingleTip({
  result,
  type,
  contract,
  tokenId,
}: {
  result: NFTCheckResult;
  type: any;
  contract: any;
  tokenId: any;
}) {

  const { t, i18n } = useTranslation();
  const detailLink = `https://explorer.scamsniffer.io/assets/${contract}/${tokenId}?utm_source=opensea-alert-link`;
  return (
    <Alert
      severity="error"
      style={{
        padding: "16px 30px",
        margin: "20px 20px 8px",
        fontSize: "16px",
      }}
      action={
        <ButtonBase
          sx={{ width: 150, height: 27 }}
          onClick={() =>
            window.open("https://scamsniffer.io?utm_source=opensea-alert-logo")
          }
        >
          <img
            src="https://cdn.jsdelivr.net/gh/scamsniffer/landingpage@main/assets/logo-black.svg"
            height={27}
          />
        </ButtonBase>
      }
    >
      {t("phishing_top")},{" "}
      <a
        href={detailLink}
        target="_blank"
        style={{ color: "rgb(32, 129, 226)" }}
      >
        {" "}
        <strong>{t("details_here")}</strong>
      </a>
    </Alert>
  );
}

function ListTip({
  result,
  type,
  contract,
  tokenId,
}: {
  result: NFTCheckResult;
  type: any;
  contract: any;
  tokenId: any;
}) {
  const { t, i18n } = useTranslation();
  const detailLink = `https://explorer.scamsniffer.io/assets/${contract}/${tokenId}?utm_source=opensea-alert-link`;
  return (
    <Alert
      severity="error"
      action={
        <ButtonBase
          sx={{ width: 62, height: 45 }}
          onClick={() =>
            window.open("https://scamsniffer.io?utm_source=opensea-alert-logo")
          }
        >
          <img
            src="https://cdn.jsdelivr.net/gh/scamsniffer/landingpage@main/assets/logo-background.svg"
            height={40}
          />
        </ButtonBase>
      }
    >
      <AlertTitle>{t("scam_act")}</AlertTitle>
      <a
        href={detailLink}
        target="_blank"
        style={{ color: "rgb(32, 129, 226)" }}
      >
        {" "}
        <strong>{t("details_here")}</strong>
      </a>
    </Alert>
  );
}

export default function ScamAssetTip({ context }: { context: any }) {
  const { type, contract, tokenId } = context;
  const [scamToken, setScamToken] = useState<NFTCheckResult | null>(null);
  const checked = useRef(false)
  useAsync(async () => {
    if (checked.current) return
    checked.current = true;
    const result = await RPC.checkNFT(contract, tokenId);
    if (result) {
      setScamToken(result);
    }
  }, []);

  return (
    scamToken &&
    (type === "single" ? (
      <SingleTip
        result={scamToken}
        type={type}
        contract={contract}
        tokenId={tokenId}
      />
    ) : (
      <ListTip
        result={scamToken}
        type={type}
        contract={contract}
        tokenId={tokenId}
      />
    ))
  );
}
