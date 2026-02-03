import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Mail, Send, AlertCircle, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use relative path for production (via Nginx proxy)
                const response = await fetch('/api/stats');
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les données. Vérifiez que le serveur tourne.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Refresh every 10 seconds
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (error) return (
        <div className="flex flex-col items-center justify-center p-10 space-y-4">
            <p className="text-red-500 text-center">{error}</p>
            <Link to="/"><Button variant="outline">Retour</Button></Link>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
                    <p className="text-muted-foreground">Suivi des candidatures automatiques</p>
                 </div>
                 <Link to="/">
                    <Button variant="outline"><Home className="mr-2 h-4 w-4"/> Nouvelle candidature</Button>
                 </Link>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total E-mails</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.stats.total}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Envoyés</CardTitle>
                        <Send className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.stats.sent}</div>
                        <p className="text-xs text-muted-foreground">Succès</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Prêts à l'envoi</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Échecs</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.stats.failed}</div>
                        <p className="text-xs text-muted-foreground">Erreurs</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Derniers Envois</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recent.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">Aucun envoi récent.</p>
                        ) : (
                            stats.recent.map((email, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-2 h-2 rounded-full ${email.status === 'sent' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <div>
                                            <p className="font-medium">{email.email}</p>
                                            {email.error && <p className="text-xs text-red-500">{email.error}</p>}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {email.sentAt ? new Date(email.sentAt).toLocaleString() : 'Échec'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
