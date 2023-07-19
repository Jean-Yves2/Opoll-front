import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}
// Gestion du mode sombre/lumineux
function DarkModeToggle({ darkMode, toggleDarkMode }: DarkModeToggleProps) {
  return (
    <IconButton color="inherit" onClick={toggleDarkMode}>
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default DarkModeToggle;
