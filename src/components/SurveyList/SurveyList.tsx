import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import './SurveyList.scss';

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
  
  const getSurveys = () => {
    axios
      .get('http://localhost:3000/survey')
      .then((response) => {
        console.log(response);
        setSurveys(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSurveys();
  }, []);

  return (
    <div  className='containerSurveyList'>
      <h1>Liste des enquêtes</h1>
      
      <ul >
        {surveys.data.map((survey) => (
          <li  key={survey.id} >
            <Button variant="contained"
              size="large"
              color="primary"
              style={{
                width: '100%',
                height: '6.25rem',
                display: 'flex',
                alignItems: 'center',
              }}>
              {survey.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SurveyList;
