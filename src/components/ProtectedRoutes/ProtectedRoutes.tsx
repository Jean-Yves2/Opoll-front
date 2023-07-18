import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { showSnackbar } from '../../store/reducers/snackbar';
import { useAppDispatch } from '../../hooks/redux';

interface ProtectedRoutesProps {
  element: React.ComponentType<any>;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  element: Element,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLogged = useAppSelector((state) => state.login.isLogged);

  useEffect(() => {
    if (!isLogged) {
      dispatch(showSnackbar());
      navigate('/');
    }
  }, [dispatch, isLogged, navigate]);

  return isLogged ? <Element {...rest} /> : null;
};

export default ProtectedRoutes;
