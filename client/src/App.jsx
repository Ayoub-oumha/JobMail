import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import JobForm from './JobForm';
import Dashboard from './Dashboard';
import { Button } from '@/components/ui/button';

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background p-4 md:p-10">
      <div className="max-w-4xl mx-auto text-center mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
          JobMailer 🚀
        </h1>
        <p className="text-muted-foreground mb-6">
          L'IA au service de votre carrière. Postulez intelligemment.
        </p>
        
        <div className="flex space-x-4 mb-4">
          <Link to="/">
            <Button variant={location.pathname === '/' ? "secondary" : "ghost"}>
              Postuler
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant={location.pathname === '/dashboard' ? "secondary" : "ghost"}>
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={<JobForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        © 2026 JobMailer. Tous droits réservés.
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App
