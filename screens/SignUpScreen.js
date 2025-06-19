import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
//import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';


export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    email: '',
    password: '',

  });

  const handleChange = (field, value) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleSignup = async () => {
  const { email, password, firstName, lastName, phone, city } = form;

  if (!email || !password || !firstName || !lastName || !phone || !city) {
    Toast.show({
      type: 'error',
      text1: 'Validation Error',
      text2: 'Please fill all fields.',
    });
    return;
  }

  try {
    // ✅ Use compat version method
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      phone,
      city,
      email,
      uid: user.uid,
      createdAt: new Date(),
       //themePreference: 'light',
    });

    Toast.show({
      type: 'success',
      text1: 'Account Created!',
      text2: 'You can now log in to your account.',
    });

    setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Sign Up Failed',
      text2: error.message,
    });
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/signup_kids.png')} // Make sure this image exists
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Create Your StarSteps Account</Text>

      <TextInput
        label="First Name"
        mode="outlined"
        value={form.firstName}
        onChangeText={(val) => handleChange('firstName', val)}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        mode="outlined"
        value={form.lastName}
        onChangeText={(val) => handleChange('lastName', val)}
        style={styles.input}
      />
      <TextInput
        label="Phone"
        mode="outlined"
        value={form.phone}
        onChangeText={(val) => handleChange('phone', val)}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        label="City"
        mode="outlined"
        value={form.city}
        onChangeText={(val) => handleChange('city', val)}
        style={styles.input}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={form.email}
        onChangeText={(val) => handleChange('email', val)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={form.password}
        onChangeText={(val) => handleChange('password', val)}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSignup} style={styles.signupButton}>
        Sign Up
      </Button>

      <Button
        onPress={() => navigation.navigate('Login')}
        mode="text"
        style={styles.loginLink}
        labelStyle={{ color: '#3B3B98', fontSize: 14, fontWeight: '600' }}
      >
        Already have an account? Login to your account
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F5',
    padding: 20,
    flexGrow: 1,
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
  signupButton: {
    backgroundColor: '#FF7EB3',
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
  },
  loginLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
