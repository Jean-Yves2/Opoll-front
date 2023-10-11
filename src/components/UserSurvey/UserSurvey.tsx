import { apiUrl } from '../../config';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {  Chip, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link , useParams } from 'react-router-dom';
import './UserSurvey.scss';
export interface UserSurveys {
  author_id: number;
  created_at: string;
  end_at: string;
  id: string;
  multiple_responses: boolean;
  public: boolean;
  start_at: string;
  title: string;
  updated_at: string;
}

function UserSurvey() {
  const token = Cookies.get('token');
  const [surveys, setSurveys] = useState<UserSurveys[]>([
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
    },
  ]);

  const { id } = useParams();
  const getUserSurveys = (id: number) => {
    const data = '';
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/user/${id}`,
      headers: {
        Authorization: token,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setSurveys(response.data[0].surveys);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserSurveys(Number(id));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };

  console.log(surveys);
  return (
    <div className="containerSurveyList">
      <h1>Liste de Sondage</h1>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Nom d'utilisateur"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <ul>
        {surveys.map((survey) => (
          <li key={survey.id}>
            <Link  className='linkBox' to={`/survey/${survey.id}/results`}>
              <div className="surveyBox">
                <div className="surveyTitle">
                  <p>{survey.title}</p>
                  <div className="test">
                    <Chip
                      className="surveyAuthor"
                      label={formatDate(survey.created_at)}
                      color="secondary"
                    />
                    <span
                      className="circleCheck"
                      style={{ backgroundColor: 'green' }}
                    ></span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default UserSurvey;
