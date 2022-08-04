import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";
import { RPC } from "../core/message/index";
import { useAsync } from "react-use";
import { useTranslation } from "react-i18next";

export default function SwitchListSecondary() {

  const [checked, setChecked] = useState<string[]>([]);
  const { t } = useTranslation();

   useAsync(async () => {
     const disabled = await RPC.getDisabledFeatures();
     setChecked(disabled);
   }, []);

    useEffect(() => {
        RPC.setDisableFeature(checked);
    }, [checked]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      subheader={<ListSubheader>{t("setting")}</ListSubheader>}
    >
      <ListItem>
        <ListItemText id="switch-list-label-wifi" primary={t("risk_assets")} />
        <Switch
          edge="end"
          onChange={handleToggle("asset")}
          checked={checked.indexOf("asset") === -1}
          inputProps={{
          }}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          id="switch-list-label-bluetooth"
          primary={t("scam_detection")}
        />
        <Switch
          edge="end"
          onChange={handleToggle("webpage")}
          checked={checked.indexOf("webpage") === -1}
          inputProps={{
          }}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          id="switch-list-label-bluetooth"
          primary={t("firewall_check")}
        />
        <Switch
          edge="end"
          onChange={handleToggle("firewall")}
          checked={checked.indexOf("firewall") === -1}
          inputProps={{
          }}
        />
      </ListItem>
    </List>
  );
}
