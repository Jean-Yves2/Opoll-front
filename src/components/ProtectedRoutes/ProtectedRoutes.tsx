import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { showSnackbar } from '../../store/reducers/snackbar';
import { useAppDispatch } from '../../hooks/redux';

interface ProtectedRoutesProps {
  element: React.ComponentType<any>;
}

function ProtectedRoutes(
  props: ProtectedRoutesProps
): React.ReactElement | null {
  const { element: Element, ...rest } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // On récupère la valeur du state isLogged pour savoir si l'utilisateur est connecté
  const isLogged = useAppSelector((state) => state.login.isLogged);

  useEffect(() => {
    if (!isLogged) {
      // Si l'utilisateur n'est pas connecté, on affiche le snackbar
      dispatch(showSnackbar());
      // Puis on le redirige vers la page d'accueil
      navigate('/');
    }
  }, [dispatch, isLogged, navigate]);

  return isLogged ? <Element {...rest} /> : null;
}

export default ProtectedRoutes;
