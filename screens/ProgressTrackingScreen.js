// screens/ProgressTrackingScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressTrackingScreen() {
  const [activeType, setActiveType] = useState(null);
  const [history, setHistory] = useState([]);

  const loadProgress = async (type) => {
    try {
      const key = type === 'letter' ? 'letterProgress' : 'shapeProgress';
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        setHistory(parsed.reverse());
        setActiveType(type);
      } else {
        setHistory([]);
        setActiveType(type);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Attempt #{history.length - index}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Correct: ✅ {item.correct}</Text>
      <Text>Wrong: ❌ {item.wrong}</Text>
      <Text>Total Questions: {item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Progress Tracking</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => loadProgress('letter')}
        >
          <Text style={styles.buttonText}>Letter Quiz Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => loadProgress('shape')}
        >
          <Text style={styles.buttonText}>Shape Quiz Progress</Text>
        </TouchableOpacity>
      </View>

      {activeType && (
        <FlatList
          contentContainerStyle={{ paddingBottom: 30 }}
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No progress history found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4FF',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6C63FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
});
