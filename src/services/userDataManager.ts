/**
 * USER DATA MANAGEMENT & DELETION SYSTEM
 * 
 * This module provides comprehensive user data management including:
 * - Delete all registered users from Supabase
 * - Clear all user data from localStorage
 * - Reset application state
 * - Clear all sessions
 * - Remove all cached data
 */

import { supabase } from '@/db/supabase';

export interface DataResetResult {
  success: boolean;
  message: string;
  details?: {
    usersDeleted?: number;
    localStorageCleared?: boolean;
    sessionStorageCleared?: boolean;
    cookiesCleared?: boolean;
    supabaseCleared?: boolean;
  };
}

export class UserDataManager {
  /**
   * Delete all users from Supabase database
   */
  async deleteAllUsers(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      // First, get count of users
      const { count: userCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error counting users:', countError);
        return { success: false, count: 0, error: countError.message };
      }

      // Delete all users from auth
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError);
        // Continue with profile deletion even if auth deletion fails
      } else if (users?.users) {
        // Delete each user from auth
        for (const user of users.users) {
          await supabase.auth.admin.deleteUser(user.id);
        }
      }

      // Delete all profiles
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except system

      if (deleteError) {
        console.error('Error deleting profiles:', deleteError);
        return { success: false, count: 0, error: deleteError.message };
      }

      return { success: true, count: userCount || 0 };
    } catch (error: any) {
      console.error('Error in deleteAllUsers:', error);
      return { success: false, count: 0, error: error.message };
    }
  }

  /**
   * Clear all localStorage data
   */
  clearLocalStorage(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all sessionStorage data
   */
  clearSessionStorage(): boolean {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }

  /**
   * Clear all cookies
   */
  clearCookies(): boolean {
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
      return true;
    } catch (error) {
      console.error('Error clearing cookies:', error);
      return false;
    }
  }

  /**
   * Sign out from Supabase
   */
  async signOutSupabase(): Promise<boolean> {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
      return false;
    }
  }

  /**
   * Check if user data exists
   */
  hasUserData(): boolean {
    return localStorage.length > 0 || sessionStorage.length > 0;
  }

  /**
   * Get user data statistics
   */
  async getUserDataStats(): Promise<{
    localStorageItems: number;
    sessionStorageItems: number;
    cookiesCount: number;
    registeredUsers: number;
  }> {
    try {
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      return {
        localStorageItems: localStorage.length,
        sessionStorageItems: sessionStorage.length,
        cookiesCount: document.cookie.split(';').filter(c => c.trim()).length,
        registeredUsers: userCount || 0
      };
    } catch (error) {
      console.error('Error getting user data stats:', error);
      return {
        localStorageItems: localStorage.length,
        sessionStorageItems: sessionStorage.length,
        cookiesCount: document.cookie.split(';').filter(c => c.trim()).length,
        registeredUsers: 0
      };
    }
  }

  /**
   * Complete data reset - Delete everything
   */
  async completeDataReset(): Promise<DataResetResult> {
    try {
      const results: DataResetResult = {
        success: true,
        message: 'Data reset completed successfully',
        details: {}
      };

      // 1. Delete all users from Supabase
      const userDeletion = await this.deleteAllUsers();
      results.details!.usersDeleted = userDeletion.count;
      results.details!.supabaseCleared = userDeletion.success;

      if (!userDeletion.success) {
        results.success = false;
        results.message = `Failed to delete users: ${userDeletion.error}`;
      }

      // 2. Sign out from Supabase
      await this.signOutSupabase();

      // 3. Clear localStorage
      results.details!.localStorageCleared = this.clearLocalStorage();

      // 4. Clear sessionStorage
      results.details!.sessionStorageCleared = this.clearSessionStorage();

      // 5. Clear cookies
      results.details!.cookiesCleared = this.clearCookies();

      return results;
    } catch (error: any) {
      return {
        success: false,
        message: `Error during data reset: ${error.message}`,
        details: {}
      };
    }
  }

  /**
   * Reset application - Clear data and reload
   */
  async resetApplication(): Promise<void> {
    await this.completeDataReset();
    
    // Wait a bit for cleanup to complete
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const userDataManager = new UserDataManager();
export default userDataManager;
