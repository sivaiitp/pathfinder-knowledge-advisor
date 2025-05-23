
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    toast.error(error.message || "Failed to sign up");
    return { success: false, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    toast.error(error.message || "Failed to log in");
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    toast.error(error.message || "Failed to log out");
    return { success: false, error };
  }
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session;
}
