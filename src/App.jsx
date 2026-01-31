import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./contexts/UserContext";
const App = () => {
  return (
    <>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </>
  );
};

export default App;
