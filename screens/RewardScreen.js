import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RewardScreen() {
  const [selectedQuiz, setSelectedQuiz] = useState('letter'); // 'letter' or 'shape'
  const [letterStars, setLetterStars] = useState(0);
  const [shapeStars, setShapeStars] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      const letterData = await AsyncStorage.getItem('letterProgress');
      const shapeData = await AsyncStorage.getItem('shapeProgress');
      setLetterStars(letterData ? JSON.parse(letterData).length : 0);
      setShapeStars(shapeData ? JSON.parse(shapeData).length : 0);
    };

    loadProgress();
  }, []);

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push('⭐️');
    }
    return stars.join(' ');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎁 Rewards</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedQuiz === 'letter' && styles.selectedButton]}
          onPress={() => setSelectedQuiz('letter')}
        >
          <Text style={styles.buttonText}>Letter Identification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, selectedQuiz === 'shape' && styles.selectedButton]}
          onPress={() => setSelectedQuiz('shape')}
        >
          <Text style={styles.buttonText}>Shape Identification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rewardBox}>
        <Text style={styles.starsText}>
          {selectedQuiz === 'letter'
            ? renderStars(letterStars)
            : renderStars(shapeStars)}
        </Text>
        <Text style={styles.countText}>
          Completed {selectedQuiz === 'letter' ? letterStars : shapeStars} time(s)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFBEF',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 30,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 30,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#6C63FF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rewardBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  starsText: {
    fontSize: 32,
    textAlign: 'center',
  },
  countText: {
    marginTop: 10,
    fontSize: 18,
    color: '#555',
  },
});
