import { List, ListItem, ListItemText, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';

interface DrawerListProps {
  menuItems: { name: string; path: string }[];
  onLogout?: () => void;
}

function DrawerList({ menuItems, onLogout }: DrawerListProps) {
  return (
    <List
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PersonIcon sx={{ fontSize: '5em' }} />
      {/* On boucle sur les données fournis par le parent navbar qui contient les nom et routes des boutons */}
      {menuItems.map((item) =>
        // Cas spécial pour le bouton de déconnexion
        item.path === '/logout' ? (
          <ListItem
            key={item.name}
            // Fonction qui gère la déconnexion
            onClick={onLogout}
            sx={{
              padding: '40px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
            }}
          >
            <ListItemText>
              <Typography
                variant="h4"
                sx={{ textAlign: 'center' }}
                color="white"
              >
                {item.name}
              </Typography>
            </ListItemText>
          </ListItem>
        ) : (
          <ListItem
            key={item.name}
            component={RouterLink}
            to={item.path}
            sx={{
              padding: '40px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
            }}
          >
            <ListItemText>
              <Typography
                variant="h4"
                sx={{ textAlign: 'center' }}
                color="white"
              >
                {item.name}
              </Typography>
            </ListItemText>
          </ListItem>
        )
      )}
    </List>
  );
}

export default DrawerList;
