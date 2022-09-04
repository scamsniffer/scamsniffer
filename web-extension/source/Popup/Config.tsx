import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";
import { RPC } from "../core/message/index";
import { useAsync } from "react-use";
import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function SwitchListSecondary() {

  const [config, setConfig] = useState<any>({});
  const { t } = useTranslation();

   useAsync(async () => {
     const config = await RPC.getConfig();
     setConfig(config);
   }, []);

    useEffect(() => {
      RPC.setConfig(config);
    }, [config]);

  const handleChange = (field: string) => (args: any) => {
    const value = args.target.value;
    setConfig({
      ...config,
      [field]: value
    })
  };

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      subheader={<ListSubheader>Tenderly Simulator  <a
        href="https://docs.scamsniffer.io/guides/tenderly-simulator"
        target="_blank"
        style={{
          color: "#777",
        }}
      > 
        <HelpOutlineIcon
          style={{
            verticalAlign: "-4px",
            fontSize: "18px",
            marginLeft: "8px",
          }}
        />
      </a></ListSubheader>}
    >
      <ListItem>
      <ListItemText primary="Account" />
        <TextField id="outlined-basic" variant="outlined" size="small"
        value={config.account}
        onChange={handleChange("account")}
        />
      </ListItem>
      <ListItem>
      <ListItemText primary="Project" />
        <TextField id="outlined-basic" variant="outlined" size="small" 
        value={config.project}
         onChange={handleChange("project")}/>
      </ListItem>
      <ListItem>
      <ListItemText primary="API Key" />
        <TextField id="outlined-basic"  value={config.apiKey}  variant="outlined" size="small"   onChange={handleChange("apiKey")}/>
      </ListItem>
    </List>
  );
}
