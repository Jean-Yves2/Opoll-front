import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { showSnackbar } from '../../store/reducers/snackbar';

// Définition du type des props attendues par le composant
interface ProtectedRoutesProps {
  element: React.ElementType;
}

const HOME_ROUTE = '/';

function ProtectedRoutes(
  props: ProtectedRoutesProps
): React.ReactElement | null {
  // Destructuration des props pour extraire 'element' et 'rest'
  const { element: Element, ...rest } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // On récupère la valeur du state isLogged pour savoir si l'utilisateur est connecté
  const isLogged = useAppSelector((state) => state.login.isLogged);

  // Utilisation du hook useEffect pour effectuer une action après le rendu du composant
  useEffect(() => {
    if (!isLogged) {
      // Si l'utilisateur n'est pas connecté, on affiche le snackbar
      dispatch(showSnackbar());
      // Puis on le redirige vers la page d'accueil
      navigate(HOME_ROUTE);
    }
  }, [dispatch, isLogged, navigate]);

  // Si l'utilisateur est connecté, on renvoie le composant passé en props, sinon on renvoie null
  return isLogged ? <Element {...rest} /> : null;
}

export default ProtectedRoutes;
