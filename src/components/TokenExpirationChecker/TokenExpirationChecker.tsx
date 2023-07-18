import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { handleLogout, resetLoginState } from '../../store/reducers/login';
import { resetSignupSuccess } from '../../store/reducers/signup';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import Cookies from 'js-cookie';

const TokenExpirationChecker = () => {
  const dispatch = useAppDispatch();

  // Cette fonction
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = Cookies.get('token');
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const expirationTimestamp = decodedToken.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000); // Heure actuelle en secondes

        if (
          expirationTimestamp &&
          typeof expirationTimestamp === 'number' &&
          expirationTimestamp < currentTimestamp
        ) {
          dispatch(resetLoginState());
          dispatch(handleLogout());
          dispatch(resetSignupSuccess());
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 10000); // On déconnecte après 10 secondes d'inactivité

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  return null;
};

export default TokenExpirationChecker;
