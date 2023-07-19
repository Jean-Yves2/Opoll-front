const data = [
  { id: 0, value: 44, color: '#F44336', label: 'Réponse 1' },
  { id: 1, value: 26, color: '#2196F3', label: 'Réponse 2' },
  { id: 2, value: 20, color: '#4CAF50', label: 'Réponse 3' },
  { id: 3, value: 10, color: '#7f2f57', label: 'Réponse 4' },

<LinearContainer>
  {data.map((item) => (
    <Box key={item.id} sx={{ width: '100%', marginBottom: '2rem' }}>
      <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '1rem' }}>
        {item.label} ({item.value} Votes)
      </Typography>
      <LinearProgress
        variant="determinate"
        value={item.value}
        sx={{
          color: item.color,
          backgroundColor: '#212121',
          height: '2rem',
          border: '1px solid #565656',
          '& .MuiLinearProgress-bar': {
            backgroundColor: item.color,
          },
        }}
      />
    </Box>
  ))}
</LinearContainer>;

const LinearContainer = styled('div')({
  width: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});
