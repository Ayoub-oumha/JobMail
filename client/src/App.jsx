import JobForm from './JobForm'

function App() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-10">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
          JobMailer 🚀
        </h1>
        <p className="text-muted-foreground">
          L'IA au service de votre carrière. Postulez intelligemment.
        </p>
      </div>
      
      <JobForm />
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        © 2026 JobMailer. Tous droits réservés.
      </footer>
    </div>
  )
}

export default App
