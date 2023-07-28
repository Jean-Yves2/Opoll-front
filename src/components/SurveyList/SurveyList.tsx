import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import './SurveyList.scss';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import Modal from '@mui/material/Modal';
import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

export interface Author {
  id: number;
  username: string;
  avatar_url: string;
  admin: boolean;
  created_at: string;
  updated_at: string;
}
interface Survey {
  data: Array<{
    author_id: number;
    created_at: string;
    end_at: string | null;
    id: string;
    multiple_responses: boolean;
    public: boolean;
    start_at: string;
    title: string;
    updated_at: string;
    author: Author;
  }>;
}
export interface userProfile {
  username: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

function SurveyList() {
  const [surveys, setSurveys] = useState<Survey>({
    data: [
      {
        author_id: 0,
        created_at: '',
        end_at: '',
        id: '',
        multiple_responses: false,
        public: false,
        start_at: '',
        title: '',
        updated_at: '',
        author: {
          id: 0,
          username: '',
          avatar_url: '',
          admin: false,
          created_at: '',
          updated_at: '',
        },
      },
    ],
  });

  const [admin, setAdmin] = useState<boolean>(false);
  const [surveyId, setSurveyId] = useState('');
  const [open, setOpen] = React.useState(false);
  const token = Cookies.get('token');
  const [newName, setNewName] = useState('');
  const isLogged = useAppSelector((state) => state.login.isLogged);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (id: string) => {
    navigate(`/survey/${id}/results`);
  };
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
        setAdmin(response.data.isAdmin);
      })
      .catch((error) => {
        void error;
      });
  };
  getProfile();

  const getSurveys = () => {
    axios
      .get('http://localhost:3000/survey')
      .then((response) => {
        setSurveys(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSurveys();
  }, []);

  const deleteSurvey = (id: string) => {
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/survey/' + id,
      headers: {
        Authorization: token,
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response);
        getSurveys();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const patchSurvey = (id: string, title: string) => {
    const data = {
      title: title,
    };

    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/survey/' + id,
      headers: {
        Authorization: token,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response);
        getSurveys();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpen = (id: string) => {
    setOpen(true);
    setSurveyId(id);
  };
  const handleClose = () => {
    patchSurvey(surveyId, newName);
    setOpen(false);
    setSurveyId('');
  };

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="containerSurveyList" >
      <h1>Liste des enquêtes</h1>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Survey name"
          inputProps={{ 'aria-label': 'search google maps' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <ul>
        {surveys.data
          .filter((survey) =>
            survey.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((survey) => (
            <li key={survey.id}>
              <div
                className="surveyBox"
                onClick={() => handleNavClick(survey.id)}
              >
                <div className="surveyTitle">
                  <p>{survey.title}</p>
                  <div className="test">
                    <Chip
                      className="surveyAuthor"
                      label={survey.author.username.toString()}
                      color="secondary"
                    />
                    <span
                      className="circleCheck"
                      // le style est à changer si l'utilisateur a répondu ou non
                      style={{ backgroundColor: 'green' }}
                    ></span>
                  </div>
                </div>
              </div>

              {admin && isLogged ? (
                <div className="iconItem">
                  <Button className="buttonIcon">
                    <DriveFileRenameOutlineRoundedIcon
                      className="renameIcon"
                      onClick={() => handleOpen(survey.id)}
                    />
                  </Button>
                  <Button className="buttonIcon">
                    <DeleteIcon
                      className="deleteIcon"
                      onClick={() => deleteSurvey(survey.id)}
                    />
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
      </ul>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Name
          </Typography>
          <input
            type="text"
            onChange={(e) => setNewName(e.target.value)}
            style={{
              width: '100%',
              height: '2.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #000',
              padding: '0.5rem',
              marginBottom: '1rem',
              backgroundColor: '#fff',
            }}
          />
          <Button
            variant="contained"
            size="large"
            color="primary"
            style={{ width: '100%' }}
            onClick={handleClose}
          >
            Rename
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default SurveyList;
