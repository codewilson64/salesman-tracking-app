import { Stack } from 'expo-router';
import { useMarkVisitsReportsAsRead } from '../../hooks/notification/useMarkVisitsReportsAsRead';
import { useEffect } from 'react';

export default function ReportsLayout() {
  const { mutate } = useMarkVisitsReportsAsRead();

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
    </Stack>
  );
}