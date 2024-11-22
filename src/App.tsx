import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import UserManagement from "./components/UserManagement";
import RoleManagement from "./components/RoleManagement";
import Permissions from "./components/Permissions";


// Custom Theme
const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#1976d2" : "#90caf9",
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });

const WelcomeScreen: React.FC<{ onEnterDashboard: () => void }> = ({ onEnterDashboard }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="100vh"
    textAlign="center"
    sx={{
      background: "linear-gradient(135deg, #1976d2, #90caf9)",
      color: "white",
    }}
  >
    <Typography variant="h3" gutterBottom>
      Welcome, Administrator
    </Typography>
    <Typography variant="body1" gutterBottom>
      Manage your platform effectively with intuitive tools.
    </Typography>
    <Button
      variant="contained"
      color="secondary"
      size="large"
      onClick={onEnterDashboard}
      sx={{
        marginTop: 3,
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      Enter Dashboard
    </Button>
  </Box>
);

const DashboardLayout: React.FC<{ toggleTheme: () => void; mode: "light" | "dark" }> = ({
  toggleTheme,
  mode,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Map routes to tab indices
  const routeToTabIndex: { [key: string]: number } = {
    "/": 0,
    "/roles": 1,
    "/permissions": 2,
  };

  // Get the current tab index based on the route
  const currentTabIndex =
    location.pathname in routeToTabIndex ? routeToTabIndex[location.pathname] : 0;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationItems = [
    { label: "Users", icon: <PersonIcon />, path: "/" },
    { label: "Roles", icon: <GroupIcon />, path: "/roles" },
    { label: "Permissions", icon: <SecurityIcon />, path: "/permissions" },
  ];

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {!isMobile && (
            <Tabs
              value={currentTabIndex}
              textColor="inherit"
              indicatorColor="secondary"
            >
              {navigationItems.map((item) => (
                <Tab key={item.label} label={item.label} component={Link} to={item.path} />
              ))}
            </Tabs>
          )}
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.label}
                component={Link}
                to={item.path}
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Page Content */}
      <Box padding="20px" sx={{ marginTop: "64px" }}>
        <Routes>
          <Route path="/" element={<UserManagement />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="/permissions" element={<Permissions />} />
        </Routes>
      </Box>
    </>
  );
};

const App: React.FC = () => {
  const [isDashboardVisible, setDashboardVisible] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!isDashboardVisible ? (
          <WelcomeScreen onEnterDashboard={() => setDashboardVisible(true)} />
        ) : (
          <DashboardLayout toggleTheme={toggleTheme} mode={mode} />
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;













