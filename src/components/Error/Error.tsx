import { styled } from '@mui/material/styles';

const Error404Container = styled('div')({
  backgroundColor: '#3e3274',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  height: '80vh',
});

function Error() {
  return (
    <Error404Container>
      <div>
        <h1>404</h1>
      </div>
    </Error404Container>
  );
}

export default Error;
