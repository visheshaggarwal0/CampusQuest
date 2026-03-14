import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9ff17bde`;

interface DataState {
  currentUser: any;
  customProjects: any[];
  projectApplications: any[];
  students: any[];
  faculty: any[];
  clubs: any[];
  projects: any[];
}

export async function saveDataToServer(key: string, data: any): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/kv/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ key, value: data }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Failed to save data for key ${key}:`, error);
    }
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
}

export async function loadDataFromServer(key: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_URL}/kv/get?key=${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to load data for key ${key}`);
      return null;
    }

    const result = await response.json();
    return result.value;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return null;
  }
}

export async function saveAppState(state: Partial<DataState>): Promise<void> {
  const promises = Object.entries(state).map(([key, value]) => 
    saveDataToServer(`app_${key}`, value)
  );
  await Promise.all(promises);
}

export async function loadAppState(): Promise<Partial<DataState>> {
  const keys = ['currentUser', 'customProjects', 'projectApplications', 'students', 'faculty', 'clubs', 'projects'];
  const results = await Promise.all(
    keys.map(async (key) => {
      const value = await loadDataFromServer(`app_${key}`);
      return [key, value];
    })
  );
  
  return Object.fromEntries(results.filter(([_, value]) => value !== null));
}
