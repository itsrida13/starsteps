import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Image, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ThemeContext } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);

  const handleStart = () => {
    console.log('Start button pressed!');
  };

  const handleAuth = () => {
    navigation.navigate('Login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#FFE4F0',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    logo: {
      width: 160,
      height: 160,
      marginBottom: 30,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#3B3B98',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: isDarkMode ? '#cccccc' : '#6D6D6D',
      marginBottom: 40,
      textAlign: 'center',
    },
    startButton: {
      backgroundColor: '#FF7EB3',
      borderRadius: 30,
      paddingHorizontal: 30,
      paddingVertical: 10,
      marginBottom: 20,
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
    },
    authButton: {
      borderColor: '#FF7EB3',
      borderWidth: 2,
      borderRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 6,
    },
    authButtonText: {
      color: '#FF7EB3',
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/starsteps-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to StarSteps 🌟</Text>
      <Text style={styles.subtitle}>
        Learning and fun for every amazing child!
      </Text>

      <Button
        mode="contained"
        onPress={handleStart}
        style={styles.startButton}
        labelStyle={styles.buttonText}
      >
        Start Learning
      </Button>

      <Button
        mode="outlined"
        onPress={handleAuth}
        style={styles.authButton}
        labelStyle={styles.authButtonText}
      >
        Login / Register
      </Button>
    </SafeAreaView>
  );
}
