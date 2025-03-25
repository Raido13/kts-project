import { Header } from "@shared/ui/Header";
import LogoIcon from "@shared/ui/Icon/LogoIcon/LogoIcon";
import UserIcon from "@shared/ui/Icon/UserIcon/UserIcon";

function App() {
  return (
    <Header
      logoIcon={<LogoIcon />}
      homePath={'/'}
      links={
        [
          { label: 'test', path: '/' },
          { label: 'test2', path: '/' },
          { label: 'test3', path: '/' },
        ]
      }
      menuItems={
        [
          { icon: <UserIcon />, path: '/' },
        ]
      }
    />
  );
}

export default App;
