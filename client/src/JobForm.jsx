import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Schéma de validation
const formSchema = z.object({
  recruiterEmail: z.string().refine((val) => {
    if (!val) return false;
    const emails = val.split(',').map(e => e.trim());
    return emails.every(email => z.string().email().safeParse(email).success);
  }, { message: "Un ou plusieurs emails sont invalides. Séparez-les par des virgules." }),
  offerText: z.string().optional(),
  stack: z.string().optional(),
});

export default function JobForm() {
  const [status, setStatus] = useState(null); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stack: ''
    }
  });

  const onSubmit = async (data) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.recruiterEmail,
          offerText: data.offerText,
          stack: data.stack
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Erreur serveur (${response.status})`);
      }

      setStatus('success');
      reset();
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus(null), 5000);

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
      setStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle>Candidature Automatique</CardTitle>
        <CardDescription>
          Collez l'offre d'emploi ci-dessous. L'IA générera un email personnalisé et l'enverra avec votre CV.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="recruiterEmail">Email(s) du recruteur</Label>
            <Input 
              id="recruiterEmail" 
              placeholder="recruteur1@gmail.com, recruteur2@yahoo.fr" 
              {...register("recruiterEmail")} 
            />
            {errors.recruiterEmail && (
              <p className="text-sm text-destructive">{errors.recruiterEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stack">Stack Technique (Optionnel)</Label>
            <select
              id="stack"
              {...register('stack')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Général (Tous les stacks)</option>
              <option value="php">PHP (Laravel)</option>
              <option value="mern">MERN Stack (Node.js, React)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerText">Offre d'emploi (Optionnel)</Label>
            <Textarea 
              id="offerText" 
              placeholder="Collez ici le texte de l'offre. Si laissé vide, une candidature spontanée standard sera envoyée." 
              className="min-h-[200px]"
              {...register("offerText")} 
            />
            {errors.offerText && (
              <p className="text-sm text-destructive">{errors.offerText.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération & Envoi...
              </>
            ) : (
              'Générer et Envoyer ma candidature'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {status === 'success' && (
           <p className="text-sm text-green-600 font-medium">✅ Candidature envoyée avec succès !</p>
        )}
        {status === 'error' && (
           <p className="text-sm text-destructive font-medium">❌ {errorMessage || 'Une erreur est survenue. Vérifiez les logs.'}</p>
        )}
      </CardFooter>
    </Card>
  );
}