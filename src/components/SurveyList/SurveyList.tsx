import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import './SurveyList.scss';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';

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
      },
    ],
  });

  const [admin, setAdmin] = useState<boolean>(false);

  const token = Cookies.get('token');

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
        console.log(JSON.stringify(response.data));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setAdmin(response.data.isAdmin);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSurveys = () => {
    axios
      .get('http://localhost:3000/survey')
      .then((response) => {
        //console.log(response);
        setSurveys(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getProfile();

  useEffect(() => {
    getSurveys();
  }, []);

  return (
    <div className="containerSurveyList">
      <h1><br /><br />
        Liste des enquêtes
      </h1>

      <ul>
        {surveys.data.map((survey) => (
          <li key={survey.id}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              style={{
                width: '100%',
                height: '6.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              endIcon={
                admin ? (
                  <div>
                    <DriveFileRenameOutlineRoundedIcon />
                    <DeleteIcon />
                  </div>
                ) : null
              }
            >
              {survey.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SurveyList;
