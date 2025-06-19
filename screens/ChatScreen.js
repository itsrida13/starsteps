import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');
const PANEL_HEIGHT = 200;

// More realistic WhatsApp-style dummy data
const dummyChats = [
  { id: '1', message: 'Hey everyone! 👋', sender: 'Alice', time: '10:30 AM', isOwn: false },
  { id: '2', message: 'Hello! How is everyone doing?', sender: 'You', time: '10:32 AM', isOwn: true },
  { id: '3', message: 'Great! Just finished the project', sender: 'Bob', time: '10:35 AM', isOwn: false },
  { id: '4', message: 'Awesome work Bob! 🎉', sender: 'Charlie', time: '10:36 AM', isOwn: false },
  { id: '5', message: 'Thanks! Should we have a call to discuss?', sender: 'Bob', time: '10:38 AM', isOwn: false },
  { id: '6', message: 'Sure, let\'s do it', sender: 'You', time: '10:39 AM', isOwn: true },
  { id: '7', message: 'I\'m free now', sender: 'Alice', time: '10:40 AM', isOwn: false },
  { id: '8', message: 'Perfect timing!', sender: 'Charlie', time: '10:41 AM', isOwn: false },
  { id: '9', message: 'Let me know when you start', sender: 'Dave', time: '10:42 AM', isOwn: false },
  { id: '10', message: 'Will do 👍', sender: 'You', time: '10:43 AM', isOwn: true },
];

export default function ChatScreen() {
  const translateY = useRef(new Animated.Value(PANEL_HEIGHT)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showFullPanel, setShowFullPanel] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const spinnerTimeout = useRef(null);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy < -10;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        setShowSpinner(false);
        setShowFullPanel(false);
        if (spinnerTimeout.current) {
          clearTimeout(spinnerTimeout.current);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          const dragDistance = Math.abs(gestureState.dy);
          const newTranslateY = Math.max(0, PANEL_HEIGHT - dragDistance);
          translateY.setValue(newTranslateY);
          
          const progress = Math.min(1, dragDistance / PANEL_HEIGHT);
          opacity.setValue(progress);
          
          // Show spinner after dragging for a bit (when panel is 30% visible)
          if (progress > 0.3 && !showSpinner && !showFullPanel) {
            setShowSpinner(true);
            
            // After 1 second of showing spinner, show full panel
            spinnerTimeout.current = setTimeout(() => {
              setShowSpinner(false);
              setShowFullPanel(true);
            }, 1000);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        
        const dragDistance = Math.abs(gestureState.dy);
        
      if (showSpinner || showFullPanel || dragDistance > PANEL_HEIGHT * 0.2) {
          // Keep panel visible
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          
          // If spinner was showing, wait for it to complete
          if (showSpinner && !showFullPanel) {
            // Let the spinner timeout complete
          } else if (!showFullPanel) {
            setShowFullPanel(true);
          }
        } else {
          // Hide panel
          hidePanel();
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        hidePanel();
      },
    })
  ).current;

  const hidePanel = () => {
    setShowSpinner(false);
    setShowFullPanel(false);
    if (spinnerTimeout.current) {
      clearTimeout(spinnerTimeout.current);
      spinnerTimeout.current = null;
    }
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: PANEL_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScreenPress = () => {
    if ((showSpinner || showFullPanel) && !isDragging) {
      hidePanel();
    }
  };

  const handleCallPress = (type) => {
    console.log(`${type} call initiated`);
    hidePanel();
  };

  useEffect(() => {
    return () => {
      if (spinnerTimeout.current) {
        clearTimeout(spinnerTimeout.current);
      }
    };
  }, []);

  const renderChatItem = ({ item }) => (
    <View style={[
      styles.chatBubble,
      item.isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      {!item.isOwn && (
        <Text style={styles.senderName}>{item.sender}</Text>
      )}
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>MAD SP25 SP23 and SP22 BCS M...</Text>
            <Text style={styles.headerSubtitle}>2 online</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Chat Area with Gesture Handler */}
        <View style={styles.chatContainer} {...panResponder.panHandlers}>
          <FlatList
            data={dummyChats}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            renderItem={renderChatItem}
            inverted
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isDragging}
          />
        </View>

        {/* Pull-up Panel */}
        {(isDragging || showSpinner || showFullPanel) && (
          <Animated.View
            style={[
              styles.dragPanel,
              {
                transform: [{ translateY }],
                opacity: opacity,
              },
            ]}
          >
            {/* Drag Handle */}
            <View style={styles.dragHandle} />
            
            {/* Panel Content */}
            {showSpinner && !showFullPanel ? (
              // Show loading spinner
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#25D366" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : showFullPanel ? (
              // Show full panel with icons
              <View style={styles.expandedContent}>
                <Text style={styles.panelTitle}>Start a call</Text>
                
                <View style={styles.iconRow}>
                  <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={() => handleCallPress('Audio')}
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="call" size={28} color="#25D366" />
                    </View>
                    <Text style={styles.iconText}>Audio</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={() => handleCallPress('Video')}
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="videocam" size={28} color="#25D366" />
                    </View>
                    <Text style={styles.iconText}>Video</Text>
                  </TouchableOpacity>
                </View>

                {/* Participants */}
                <View style={styles.participantsSection}>
                  <Text style={styles.participantsTitle}>Participants (4)</Text>
                  <View style={styles.participantsList}>
                    <Text style={styles.participantText}>• Alice, Bob, Charlie, You</Text>
                  </View>
                </View>
              </View>
            ) : (
              // Show empty space while dragging (before spinner)
              <View style={styles.emptyContainer} />
            )}
          </Animated.View>
        )}

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="attach" size={24} color="#54656F" />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPlaceholder}>Message</Text>
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2C33',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerSubtitle: {
    color: '#8696A0',
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    padding: 5,
  },
  chatContainer: {
    flex: 1,
  },
  chatList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 80,
  },
  chatBubble: {
    maxWidth: '80%',
    marginVertical: 2,
    padding: 12,
    borderRadius: 12,
  },
  ownMessage: {
    backgroundColor: '#005C4B',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#1F2C33',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    color: '#8696A0',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  messageText: {
    color: '#E9EDEF',
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    color: '#8696A0',
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  dragPanel: {
    position: 'absolute',
    bottom: 70,
    height: PANEL_HEIGHT,
    width: '100%',
    backgroundColor: '#1F2C33',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#54656F',
    borderRadius: 2,
    marginBottom: 10,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    color: '#E9EDEF',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    width: '100%',
  },
  expandedContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  panelTitle: {
    color: '#E9EDEF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#E9EDEF',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    color: '#E9EDEF',
    fontSize: 14,
    fontWeight: '500',
  },
  participantsSection: {
    width: '100%',
    marginTop: 10,
  },
  participantsTitle: {
    color: '#8696A0',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  participantsList: {
    backgroundColor: '#0B141B',
    borderRadius: 8,
    padding: 10,
  },
  participantText: {
    color: '#E9EDEF',
    fontSize: 13,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2C33',
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  attachButton: {
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#2A3942',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  inputPlaceholder: {
    color: '#8696A0',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00A884',
    borderRadius: 20,
    padding: 10,
  },
});
