import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { handleLogout } from '../../store/reducers/login';
import { resetSignupSuccess } from '../../store/reducers/signup';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import Cookies from 'js-cookie';

const TokenExpirationChecker = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = Cookies.get('token');
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        // Cette ligne décode le JWT. En décodant le token, vous obtenez un objet JavaScript
        const expirationTimestamp = decodedToken.exp;
        // Permet d'extraire la date d'expiration du token à partir de l'objet décodé
        const currentTimestamp = Math.floor(Date.now() / 1000);
        // Heure actuelle en secondes

        if (
          expirationTimestamp &&
          typeof expirationTimestamp === 'number' &&
          expirationTimestamp < currentTimestamp
          // Si le token est expiré, on déconnecte l'utilisateur
        ) {
          dispatch(handleLogout());
          dispatch(resetSignupSuccess());
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 300000);
    // On va vérifier toutes les 5 minutes si le token est expiré en appelant la fonction checkTokenExpiration

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  return null;
};

export default TokenExpirationChecker;
