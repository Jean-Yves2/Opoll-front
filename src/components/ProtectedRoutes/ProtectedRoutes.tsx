import { useEffect, ComponentType, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAppDispatch } from '../../hooks/redux';
import { setSnackbarLogged } from '../../store/reducers/snackbar';

interface Props {
  element: ComponentType<any>;
  [x: string]: any;
}

const ProtectedRoutes = ({ element: Element, ...rest }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      axios
        .get('http://localhost:3000/@me', {
          headers: {
            authorization: `${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          dispatch(setSnackbarLogged(true));
        })
        .catch((error) => {
          console.log('Une erreur à été détectée, le token est invalide');
          console.error(error);
          dispatch(setSnackbarLogged(false));
          navigate('/');
        });
    } else {
      console.log('Token non existant');
      dispatch(setSnackbarLogged(false));
      navigate('/');
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Element {...rest} />
    </>
  );
};

export default ProtectedRoutes;
