import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
//import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Toast from 'react-native-toast-message';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    await auth.signInWithEmailAndPassword(email, password);

    Toast.show({
      type: 'success',
      text1: 'Login Successful!',
      text2: 'Welcome back!',
    });

    setTimeout(() => {
      navigation.replace('DrawerMenu');
    }, 1500);
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: error.message,
    });
  }
};


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/login_kids.png')} // Add your image to assets folder
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Welcome to StarSteps</Text>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
      >
        Login
      </Button>

      <Button
        onPress={() => navigation.navigate('Signup')}
        mode="text"
        style={styles.signupLink}
        labelStyle={{ color: '#3B3B98', fontSize: 14, fontWeight: '600' }}
      >
        Don't have an account? Sign up here
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    padding: 20,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  loginButton: {
    backgroundColor: '#FF7EB3',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  signupLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
