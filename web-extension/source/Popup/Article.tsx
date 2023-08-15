import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import { useState, useEffect } from 'react';
import { useAsync } from 'react-use';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { RPC } from '../core/message/client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'

export default function SwitchListSecondary() {
  const [articles, setArticles] = useState<any>([]);
  const [loading, setStatus] = useState<boolean>(true);
  const { t } = useTranslation();

  useAsync(async () => {
    setStatus(true)
    const config = await RPC.getRemoteConfig();
    const articles = config.drops || [];
    setArticles(articles.slice(0, 8));
    setStatus(false)
  }, []);

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      subheader={
        <ListSubheader>
          Learn
        </ListSubheader>
      }
    >
      {
        loading ? <ListItem>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress size={25} />
          </Box>
        </ListItem> :
          articles.map((_: any) => {
            return <ListItemButton onClick={() => window.open(_.link)}>
              <ListItemText secondary={_.title} />
            </ListItemButton>
          })
      }
    </List>
  );
}
