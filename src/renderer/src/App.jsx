function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return <>1213</>
}

export default App
