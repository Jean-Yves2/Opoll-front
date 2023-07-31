import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { userProfil } from '../../Interfaces/UserProfil';
import Error from '../Error/Error';
import { Avatar, Button, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
import './AdminPage.scss';

function AdminPage() {
  const [admin, setAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<userProfil[]>([]);
  const token = Cookies.get('token');
  const [activUserName, setActivUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getProfile = () => {
    const data = '';
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/@me',
      headers: {
        Authorization: token,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setActivUserName(response.data.username);
        console.log(activUserName);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setAdmin(response.data.isAdmin);
      })
      .catch((error) => {
        void error;
      });
  };
  getProfile();

  const getAllUsers = () => {
    const data = '';

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/user',
      headers: {
        Authorization: token,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setUsers(response.data);
      })
      .catch((error) => {
        void error;
      });
  };

  const deleteUser = (id: number) => {
    const data = '';

    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://localhost:3000/user/${id}`,
      headers: {
        Authorization: token,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        getAllUsers();
        void response;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  if (!admin) {
    return <Error />;
  }
  return (
    <div className="containerSurveyList">
      <h1>Liste des Utilisateurs</h1>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Nom d'utilisateur"
          inputProps={{ 'aria-label': 'search google maps' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      {admin ? (
        <ul>
          {users
            .filter((user) =>
              user.username.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user) =>
              user.username !== activUserName ? (
                <li className="liBox" key={user.id}>
                  <div className="userBox">
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                    <p>{user.username}</p>
                  </div>
                  <div className="buttonBox">
                    <Button
                      className="sondage"
                      variant="outlined"
                      color="error"
                      component={RouterLink}
                      to={`/user/${user.id}`}
                    >
                      Sondages
                    </Button>
                    <Button
                      className="bannir"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        deleteUser(user.id);
                      }}
                    >
                      Bannir
                    </Button>
                  </div>
                </li>
              ) : null
            )}
        </ul>
      ) : null}
    </div>
  );
}

export default AdminPage;
