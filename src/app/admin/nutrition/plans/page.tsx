'use client';

import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import NutritionPlanManager from '@/features/nutrition/plan/ui/NutritionPlanManager';

export default function NutritionPlansPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <div className="container mx-auto py-8">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p className="text-center">Загрузка...</p>
          </div>
        </div>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <NutritionPlanManager />
    </UserTypeProtectedRoute>
  );
}