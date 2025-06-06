import React from 'react';
import { SafeAreaView, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  const handleStart = () => {
    console.log('Start button pressed!');
    // navigation.navigate('NextScreen'); // later
  };

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4F0',
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
    color: '#3B3B98',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6D6D6D',
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#FF7EB3',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
