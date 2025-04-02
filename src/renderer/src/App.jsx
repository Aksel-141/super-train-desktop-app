function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return <>головна</>
}

export default App
