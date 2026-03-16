import { Text, View } from 'react-native';
import "./global.css";
import { Link, Redirect } from 'expo-router';
import { useAuthStore } from './stores/authStore';

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/home" />;
}

