import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../firebaseConfig';
import { DrawerActions } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SpecialChildScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMotivation, setShowMotivation] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [moduleVisibility, setModuleVisibility] = useState({
    showLetters: true,
    showShapes: true,
    showTasks: true,
  });

  // ⏰ Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📥 Load visibility settings from AsyncStorage
  useEffect(() => {
    const loadModuleVisibility = async () => {
      try {
        const settings = await AsyncStorage.getItem('moduleSettings'); // ✅ fixed key name
        if (settings) {
          setModuleVisibility(JSON.parse(settings));
        }
      } catch (error) {
        console.error('Failed to load module visibility:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadModuleVisibility); // ✅ reload every time screen opens
    loadModuleVisibility();

    return unsubscribe;
  }, [navigation]);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  const handleMotivationPress = () => {
    setShowMotivation(true);
    setShowModules(false);
  };

  const handleModulesPress = () => {
    setShowMotivation(false);
    setShowModules(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Date and Time Box */}
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>📅 {formattedDate}</Text>
        <Text style={styles.timeText}>⏰ {formattedTime}</Text>
      </View>

      <Text style={styles.title}>Welcome to SpecialChild Screen ✯</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMotivationPress}>
          <Text style={styles.buttonText}>Special Child</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleModulesPress}>
          <Text style={styles.buttonText}>Learning Modules</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => alert('Games coming soon!')}>
          <Text style={styles.buttonText}>Games</Text>
        </TouchableOpacity>

        {/* Only show Tasks if enabled by parent */}
        {moduleVisibility.showTasks && (
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TasksScreen')}>
            <Text style={styles.buttonText}>Tasks</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Motivational Message */}
      {showMotivation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            "Every child is a different kind of flower, and all together, they make this world a beautiful garden. 🌸
            Believe in your sparkle, you are unique, strong, and unstoppable!"
          </Text>
        </View>
      )}

      {/* Learning Modules */}
      {showModules && (
        <View style={styles.infoBox}>
          {/* Always show Learning Alphabets */}
          <TouchableOpacity
            style={styles.circularButton}
            onPress={() => navigation.navigate('LearningAlphabets')}
          >
            <Text style={styles.moduleText}>Module 0: Learning Alphabets</Text>
          </TouchableOpacity>

          {/* Show Letter module if allowed */}
          {moduleVisibility.showLetters && (
            <TouchableOpacity
              style={[styles.circularButton, { marginTop: 20 }]}
              onPress={() => navigation.navigate('LetterIdentification')}
            >
              <Text style={styles.moduleText}>Module 1: Identify Letter</Text>
            </TouchableOpacity>
          )}

          {/* Show Shape module if allowed */}
          {moduleVisibility.showShapes && (
            <TouchableOpacity
              style={[styles.circularButton, { marginTop: 20 }]}
              onPress={() => navigation.navigate('ShapeIdentification')}
            >
              <Text style={styles.moduleText}>Module 2: Identify Shapes</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingBottom: 100,
  },
  dateBox: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 30,
  },
  dateText: {
    fontSize: 18,
    color: '#3B3B98',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 24,
    color: '#FF7EB3',
    fontWeight: 'bold',
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3B3B98',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 11,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    width: '90%',
    backgroundColor: '#FFF5F8',
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  circularButton: {
    backgroundColor: '#e693c2',
    borderRadius: 150,
    width: 250,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 20,
    marginTop: 5,
  },
  moduleText: {
    color: '#320b52',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});
