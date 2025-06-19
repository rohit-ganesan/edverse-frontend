// No React import needed with new JSX transform
import { Button } from 'components/ui/Button';
import { useAuth } from 'features/auth/AuthContext';

export function DashboardPage(): JSX.Element {
  const { user, signOut } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-primary-600">EdVerse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.email || 'User'}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to EdVerse!
              </h2>
              <p className="text-gray-600 mb-6">
                Your learning dashboard will be built here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Courses</h3>
                  <p className="text-gray-600 text-sm">
                    Explore and enroll in courses
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
                  <p className="text-gray-600 text-sm">
                    Track your learning progress
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Achievements
                  </h3>
                  <p className="text-gray-600 text-sm">
                    View your accomplishments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
