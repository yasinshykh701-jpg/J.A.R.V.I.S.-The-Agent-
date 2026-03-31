import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw, Database, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userDataManager } from '@/services/userDataManager';

export default function DataResetPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    localStorageItems: 0,
    sessionStorageItems: 0,
    cookiesCount: 0,
    registeredUsers: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await userDataManager.getUserDataStats();
    setStats(data);
  };

  const handleClearData = async () => {
    setIsLoading(true);
    toast.info('Clearing all user data...');
    
    try {
      const result = await userDataManager.completeDataReset();
      
      if (result.success) {
        toast.success(`✅ Success! Deleted ${result.details?.usersDeleted || 0} users and cleared all data`);
        await loadStats();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error: any) {
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetApp = async () => {
    setIsLoading(true);
    toast.info('Resetting application...');
    
    try {
      await userDataManager.resetApplication();
    } catch (error: any) {
      toast.error(`❌ Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const hasData = stats.localStorageItems > 0 || stats.registeredUsers > 0;

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6" />
          Data Management
        </h2>
        <p className="text-muted-foreground">
          Manage application data and user accounts
        </p>
      </div>

      <div className="space-y-4">
        {/* Data Status */}
        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Data Status</p>
              <p className="text-sm text-muted-foreground">
                {hasData ? 'User data exists in storage' : 'No user data found'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              hasData ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
            }`}>
              {hasData ? 'Data Present' : 'Clean State'}
            </div>
          </div>
          
          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Registered Users</p>
              <p className="text-lg font-bold flex items-center gap-2">
                <Users className="w-4 h-4" />
                {stats.registeredUsers}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Local Storage Items</p>
              <p className="text-lg font-bold flex items-center gap-2">
                <Database className="w-4 h-4" />
                {stats.localStorageItems}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Session Items</p>
              <p className="text-lg font-bold">{stats.sessionStorageItems}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Cookies</p>
              <p className="text-lg font-bold">{stats.cookiesCount}</p>
            </div>
          </div>
        </div>

        {/* Clear User Data */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="w-full"
              disabled={!hasData || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Users & Clear Data
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>⚠️ Delete All Users & Clear Data?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>{stats.registeredUsers} registered user accounts</strong> from database</li>
                  <li>All user profiles and authentication data</li>
                  <li>All conversation history</li>
                  <li>All generated images and videos</li>
                  <li>All saved preferences</li>
                  <li>{stats.localStorageItems} localStorage items</li>
                  <li>{stats.sessionStorageItems} session items</li>
                  <li>{stats.cookiesCount} cookies</li>
                </ul>
                <p className="mt-3 font-semibold text-destructive">
                  ⚠️ THIS ACTION CANNOT BE UNDONE!
                </p>
                <p className="mt-2 text-sm">
                  The application will reload after deletion.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearData} 
                className="bg-destructive hover:bg-destructive/90"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete Everything'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reset Application */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Application
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>🔄 Reset Application?</AlertDialogTitle>
              <AlertDialogDescription>
                This will:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Delete all {stats.registeredUsers} registered users</li>
                  <li>Clear all user data</li>
                  <li>Reset all settings to default</li>
                  <li>Reload the application</li>
                </ul>
                <p className="mt-3 font-semibold">
                  The app will restart with a clean state.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetApp} disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Yes, Reset App'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Info Section */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 className="font-semibold text-blue-500 mb-2">🎉 Lifetime Free Services</h3>
        <p className="text-sm text-muted-foreground">
          All AI services are completely free and unlimited:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
          <li>Text-to-Speech (Browser Native - Unlimited)</li>
          <li>Speech-to-Text (Browser Native - Unlimited)</li>
          <li>Image Generation (Pollinations AI + Hugging Face - Free)</li>
          <li>Chat/LLM (Hugging Face DialoGPT - Free)</li>
          <li>Video Generation (Canvas-based - Unlimited)</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">
          ✅ No API keys required • ♾️ No usage limits • 💰 100% Free Forever
        </p>
      </div>
    </div>
  );
}
