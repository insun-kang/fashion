export default function Modal(theme) {
  return {
    MuiModal: {
      styleOverrides: {
        backDrop: {
          backdropFilter: 'blur(30px)',
          backgroundColor: 'rgba(0,0,30,0.4)',
        },
      },
    },
  };
}
